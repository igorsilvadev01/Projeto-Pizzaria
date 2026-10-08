import { json, apiError } from "../../../../lib/api-response";
import { requireUser } from "../../../../lib/server-auth";
import { findOrder } from "../../../../lib/orders";
export const runtime = "nodejs";
export async function GET(request, { params }) { try { return json({ order: findOrder((await params).id, await requireUser()) }); } catch (e) { return apiError(e); } }
