import { POST as authenticate } from "../../auth/[action]/route";
export const runtime = "nodejs";
export async function POST(request) { return authenticate(request, { params: Promise.resolve({ action: "login" }) }); }
