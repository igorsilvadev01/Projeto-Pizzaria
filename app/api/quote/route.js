import { getCatalog } from "../../../lib/database";
import { quoteItem } from "../../../lib/commerce";
import { json, apiError, readBody } from "../../../lib/api-response";
export const runtime = "nodejs";
export async function POST(request) { try { const body = await readBody(request); const catalog = getCatalog(); return json({ ...quoteItem(catalog, body.configuration), revision: catalog.revision }); } catch (e) { return apiError(e); } }
