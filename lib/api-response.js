import { NextResponse } from "next/server";
import { CommerceError, assert } from "./commerce";
export function json(value, status = 200) { return NextResponse.json(value, { status, headers: { "Cache-Control": "no-store" } }); }
export function apiError(error) { if (error instanceof CommerceError) return json({ error: error.message }, error.status); console.error("Falha na operação SPADONI:", error.message); return json({ error: "Não foi possível concluir. Tente novamente." }, 500); }
export async function readBody(request) {
  assert(Number(request.headers.get("content-length") || 0) <= 200000, "Solicitação muito grande.", 413);
  const raw = await request.text(); assert(raw.length <= 200000, "Solicitação muito grande.", 413);
  let body; try { body = JSON.parse(raw); } catch { throw new CommerceError("Solicitação inválida."); }
  assert(body && typeof body === "object" && !Array.isArray(body), "Solicitação inválida.");
  return body;
}
