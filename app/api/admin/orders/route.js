import { json, apiError, readBody } from "../../../../lib/api-response";
import { requireUser, sameOrigin } from "../../../../lib/server-auth";
import { listOrders, changeOrderStatus } from "../../../../lib/orders";
export const runtime = "nodejs";
export async function GET() { try { await requireUser(true); return json({ orders: listOrders(null, true) }); } catch (e) { return apiError(e); } }
export async function PATCH(request) { try { sameOrigin(request); await requireUser(true); const body = await readBody(request); return json({ order: changeOrderStatus(body.id, body.status) }); } catch (e) { return apiError(e); } }
