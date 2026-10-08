import { getCatalog, saveCatalog } from "../../../../lib/database";
import { json, apiError, readBody } from "../../../../lib/api-response";
import { requireUser, sameOrigin } from "../../../../lib/server-auth";
export const runtime = "nodejs";
export async function GET() { try { await requireUser(true); return json(getCatalog()); } catch (e) { return apiError(e); } }
export async function PUT(request) { try { sameOrigin(request); await requireUser(true); return json(saveCatalog(await readBody(request))); } catch (e) { return apiError(e); } }
