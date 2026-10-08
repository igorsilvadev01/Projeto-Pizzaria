import "server-only";
import { cookies } from "next/headers";
import { randomBytes, randomUUID, createHash, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { readFileSync } from "node:fs";
import { database, transaction, setupKeyPath } from "./database";
import { assert, text } from "./commerce";
import { verifyAdminSession, getAdminCookieName } from "./admin-session";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "spadoni_session";
const lifetime = 8 * 60 * 60;
const digest = value => createHash("sha256").update(value).digest("hex");
export const emailValue = value => { assert(typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), "Informe um e-mail válido."); return value.trim().toLowerCase(); };
export async function hashPassword(password) {
  assert(typeof password === "string" && password.length >= 15 && password.length <= 128, "Use uma senha ou frase com 15 a 128 caracteres.");
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
  return `${salt}:${hash.toString("hex")}`;
}
export async function checkPassword(password, encoded) {
  if (typeof password !== "string" || password.length > 128) return false;
  const [salt, expected] = encoded.split(":");
  const hash = await scrypt(password, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
  const wanted = Buffer.from(expected, "hex"); return hash.length === wanted.length && timingSafeEqual(hash, wanted);
}
export function publicUser(user) { return user ? { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: JSON.parse(user.address || "{}"), favorites: JSON.parse(user.favorites || "[]"), createdAt: user.created_at } : null; }
export async function currentUser() {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie || cookie.length > 200) return null;
  return database().prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?").get(digest(cookie), Date.now()) ?? null;
}
export async function requireUser(admin = false) {
  const user = await currentUser();
  if (admin && !user) {
    const oldCookie = (await cookies()).get(getAdminCookieName())?.value;
    if (verifyAdminSession(oldCookie)) return { id: null, email: process.env.ADMIN_EMAIL, name: "Equipe SPADONI", role: "admin" };
  }
  assert(user, "Entre na sua conta para continuar.", 401);
  assert(!admin || user.role === "admin", "Este acesso é exclusivo da equipe.", 403);
  return user;
}
export function startSession(response, userId) {
  const token = randomBytes(32).toString("base64url");
  const db = database(); db.prepare("DELETE FROM sessions WHERE expires_at<=?").run(Date.now());
  db.prepare("INSERT INTO sessions VALUES (?,?,?)").run(digest(token), userId, Date.now() + lifetime * 1000);
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: lifetime });
}
export async function endSession(response) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) database().prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(token));
  for (const name of [SESSION_COOKIE, getAdminCookieName()]) response.cookies.set(name, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  assert(origin && origin === new URL(request.url).origin, "Origem da solicitação inválida.", 403);
}
export function rateLimit(key, limit = 12, duration = 15 * 60 * 1000) {
  const hashed = digest(key);
  transaction(db => {
    db.prepare("DELETE FROM auth_attempts WHERE expires_at<=?").run(Date.now());
    const row = db.prepare("SELECT * FROM auth_attempts WHERE key=?").get(hashed);
    assert(!row || row.count < limit, "Muitas tentativas. Aguarde alguns minutos e tente novamente.", 429);
    db.prepare("INSERT INTO auth_attempts VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET count=count+1").run(hashed, 1, Date.now() + duration);
  });
}
export function needsAdminSetup() { return !database().prepare("SELECT id FROM users WHERE role='admin'").get() && !(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET?.length >= 32); }
export async function createUser(body, role = "customer") {
  const name = text(body.name, "Nome", 80); const email = emailValue(body.email);
  assert(role === "admin" || email !== process.env.ADMIN_EMAIL?.trim().toLowerCase(), "Este e-mail é reservado à equipe.", 409);
  assert(!database().prepare("SELECT id FROM users WHERE email=?").get(email), "Este e-mail já tem uma conta. Entre com sua senha.", 409);
  const passwordHash = await hashPassword(body.password);
  const id = randomUUID();
  return transaction(db => {
    assert(!db.prepare("SELECT id FROM users WHERE email=?").get(email), "Este e-mail já tem uma conta. Entre com sua senha.", 409);
    if (role === "admin") {
      assert(needsAdminSetup(), "O administrador já está configurado.", 409);
      let token = process.env.ADMIN_SETUP_TOKEN;
      if (!token) token = readFileSync(setupKeyPath(), "utf8").trim();
      assert(typeof body.setupToken === "string" && timingSafeEqual(Buffer.from(digest(token)), Buffer.from(digest(body.setupToken))), "Chave de configuração incorreta.", 403);
    }
    db.prepare("INSERT INTO users (id,email,name,password_hash,role,created_at) VALUES (?,?,?,?,?,?)").run(id, email, name, passwordHash, role, new Date().toISOString());
    return db.prepare("SELECT * FROM users WHERE id=?").get(id);
  });
}
