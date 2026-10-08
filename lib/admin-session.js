import { createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "brasa_admin_session";
const sessionLifetimeSeconds = 60 * 60 * 8;

export function getAdminCookieName() {
  return cookieName;
}

export function createAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("ADMIN_SESSION_SECRET precisa ter ao menos 32 bytes.");
  }
  const payload = Buffer.from(JSON.stringify({
    email: process.env.ADMIN_EMAIL,
    expiresAt: Date.now() + sessionLifetimeSeconds * 1000,
  })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return { value: `${payload}.${signature}`, maxAge: sessionLifetimeSeconds };
}

export function verifyAdminSession(value) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32 || typeof value !== "string") return false;
  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra) return false;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const supplied = Buffer.from(signature, "base64url");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.email === process.env.ADMIN_EMAIL && data.expiresAt > Date.now();
  } catch {
    return false;
  }
}
