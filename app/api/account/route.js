import { database, getCatalog, transaction } from "../../../lib/database";
import { assert, text } from "../../../lib/commerce";
import { json, apiError, readBody } from "../../../lib/api-response";
import { requireUser, publicUser, sameOrigin, checkPassword, hashPassword, startSession, rateLimit } from "../../../lib/server-auth";
import { validateAddress, listOrders } from "../../../lib/orders";
export const runtime = "nodejs";
export async function GET() { try { const user = await requireUser(); return json({ user: publicUser(user), orders: listOrders(user.id) }); } catch (e) { return apiError(e); } }
export async function PATCH(request) {
  try {
    sameOrigin(request); const user = await requireUser(); const body = await readBody(request);
    if (body.action === "favorite") {
      assert(getCatalog().pizzas.some(p => p.id === body.pizzaId), "Sabor não encontrado.", 404);
      const updated = transaction(db => { const row = db.prepare("SELECT favorites FROM users WHERE id=?").get(user.id); let favorites = JSON.parse(row.favorites); favorites = favorites.includes(body.pizzaId) ? favorites.filter(id => id !== body.pizzaId) : [...favorites, body.pizzaId]; db.prepare("UPDATE users SET favorites=? WHERE id=?").run(JSON.stringify(favorites), user.id); return db.prepare("SELECT * FROM users WHERE id=?").get(user.id); });
      return json({ user: publicUser(updated) });
    }
    if (body.action === "password") {
      rateLimit("password:" + user.id, 10);
      assert(await checkPassword(body.currentPassword, user.password_hash), "A senha atual está incorreta.", 401);
      const hash = await hashPassword(body.password);
      transaction(db => { db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(hash, user.id); db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id); });
      const response = json({ ok: true }); startSession(response, user.id); return response;
    }
    assert(body.action === "profile", "Operação inválida.");
    const name = text(body.name, "Nome", 80); const phone = text(body.phone || "", "Telefone", 25, true);
    assert(!phone || phone.replace(/\D/g, "").length >= 10, "Informe um telefone com DDD.");
    const address = body.address?.street ? validateAddress(body.address) : {};
    database().prepare("UPDATE users SET name=?,phone=?,address=? WHERE id=?").run(name, phone, JSON.stringify(address), user.id);
    return json({ user: publicUser(database().prepare("SELECT * FROM users WHERE id=?").get(user.id)) });
  } catch (e) { return apiError(e); }
}
