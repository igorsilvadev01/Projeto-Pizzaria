import { database } from "../../../../lib/database";
import { json, apiError } from "../../../../lib/api-response";
import { requireUser } from "../../../../lib/server-auth";
export const runtime = "nodejs";
export async function GET() { try { await requireUser(true); return json({ customers: database().prepare("SELECT u.id,u.name,u.email,u.phone,u.created_at AS createdAt,COUNT(o.id) AS orderCount FROM users u LEFT JOIN orders o ON o.user_id=u.id WHERE u.role='customer' GROUP BY u.id ORDER BY u.created_at DESC LIMIT 300").all() }); } catch (e) { return apiError(e); } }
