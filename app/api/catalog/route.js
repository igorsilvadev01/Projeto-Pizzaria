import { getCatalog } from "../../../lib/database";
import { json, apiError } from "../../../lib/api-response";
export const runtime = "nodejs";
export async function GET() { try { return json(getCatalog()); } catch (e) { return apiError(e); } }
