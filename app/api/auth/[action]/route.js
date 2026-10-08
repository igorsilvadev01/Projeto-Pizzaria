import { createHash, timingSafeEqual } from "node:crypto";
import { createAdminSession, getAdminCookieName } from "../../../../lib/admin-session";
import { database } from "../../../../lib/database";
import { assert } from "../../../../lib/commerce";
import { json, apiError, readBody } from "../../../../lib/api-response";
import { currentUser, publicUser, needsAdminSetup, createUser, checkPassword, startSession, endSession, sameOrigin, rateLimit, emailValue, requireUser } from "../../../../lib/server-auth";
export const runtime = "nodejs";
const equal = (a, b) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
export async function GET(request, { params }) {
  try {
    const { action } = await params; assert(action === "session", "Página não encontrada.", 404);
    let user = await currentUser();
    if (!user) { try { const admin = await requireUser(true); if (admin.id === null) return json({ user: { name: admin.name, role: "admin", email: admin.email, id: null, favorites: [], address: {} }, needsAdminSetup: false }); } catch {} }
    return json({ user: publicUser(user), needsAdminSetup: needsAdminSetup() });
  } catch (e) { return apiError(e); }
}
export async function POST(request, { params }) {
  try {
    sameOrigin(request); const { action } = await params;
    if (action === "logout") { const response = json({ ok: true }); await endSession(response); return response; }
    const body = await readBody(request);
    const email = emailValue(body.email);
    rateLimit(`auth:${action}:${email}`, 10);
    rateLimit(`auth-ip:${request.headers.get("x-forwarded-for") || "local"}`, 60);
    if (["register", "setup"].includes(action)) {
      if (action === "setup") { rateLimit("admin-setup", 10); assert(needsAdminSetup(), "O acesso administrativo já foi configurado.", 409); }
      const user = await createUser(body, action === "setup" ? "admin" : "customer");
      const response = json({ user: publicUser(user) }, 201); startSession(response, user.id); return response;
    }
    assert(action === "login", "Operação não encontrada.", 404);
    const user = database().prepare("SELECT * FROM users WHERE email=?").get(email);
    if (!user && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && typeof body.password === "string" && body.password.length <= 128 && equal(email, process.env.ADMIN_EMAIL.trim().toLowerCase()) && equal(body.password, process.env.ADMIN_PASSWORD)) {
      const session = createAdminSession(); const response = json({ user: { role: "admin", name: "Equipe SPADONI" } });
      response.cookies.set(getAdminCookieName(), session.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: session.maxAge }); return response;
    }
    assert(user && await checkPassword(body.password, user.password_hash), "E-mail ou senha incorretos.", 401);
    assert(!(body.admin || new URL(request.url).pathname === "/api/admin/login") || user.role === "admin", "Este acesso é exclusivo da equipe.", 403);
    const response = json({ user: publicUser(user) }); startSession(response, user.id); return response;
  } catch (e) { return apiError(e); }
}
