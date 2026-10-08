import { getCatalog } from "../../../lib/database";
import { json, apiError, readBody } from "../../../lib/api-response";
import { requireUser, sameOrigin, rateLimit } from "../../../lib/server-auth";
import { createOrder, listOrders, whatsappLink } from "../../../lib/orders";
export const runtime = "nodejs";
export async function GET() { try { const user = await requireUser(); return json({ orders: listOrders(user.id) }); } catch (e) { return apiError(e); } }
export async function POST(request) { try { sameOrigin(request); const user = await requireUser(); rateLimit(`orders:${user.id}`, 20, 60 * 60 * 1000); const body = await readBody(request); const order = createOrder(body, user); return json({ order, whatsappUrl: whatsappLink(order, getCatalog()) }, 201); } catch (e) { return apiError(e); } }
