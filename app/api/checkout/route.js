import { transaction } from "../../../lib/database";
import { requireUser, sameOrigin, rateLimit } from "../../../lib/server-auth";
import { createOrder } from "../../../lib/orders";
import { assert } from "../../../lib/commerce";
import { json, apiError, readBody } from "../../../lib/api-response";
export const runtime = "nodejs";
export async function POST(request) {
  try {
    sameOrigin(request); const user = await requireUser(); rateLimit("checkout:" + user.id, 20, 3600000);
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    assert(accessToken, "Pagamento online ainda não configurado. Registre o pedido e confirme pelo WhatsApp.", 503);
    const body = await readBody(request); assert(body.fulfillment === "pickup", "Entrega deve ser confirmada com a equipe antes do pagamento.");
    let appUrl; try { appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL); } catch { assert(false, "A URL pública da loja precisa ser configurada.", 503); }
    assert(appUrl.protocol === "https:" || ["localhost","127.0.0.1"].includes(appUrl.hostname), "A URL pública precisa usar HTTPS.", 503);
    const order = createOrder(body, user, "mercadopago");
    if (order.checkoutUrl) return json({ checkoutUrl: order.checkoutUrl, orderId: order.id });
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST", headers: { Authorization: "Bearer " + accessToken, "Content-Type": "application/json", "X-Idempotency-Key": order.id },
      body: JSON.stringify({ items: order.items.map((item,index) => ({ id: order.id + "-" + index, title: item.label + " · " + item.details, quantity: item.quantity, unit_price: item.unitPrice, currency_id: "BRL" })), external_reference: order.id, back_urls: { success: new URL("/pedido/retorno?status=success",appUrl).toString(), pending: new URL("/pedido/retorno?status=pending",appUrl).toString(), failure: new URL("/pedido/retorno?status=failure",appUrl).toString() }, auto_return: "approved" }), signal: AbortSignal.timeout(12000)
    });
    const preference = await response.json().catch(()=>({})); assert(response.ok, "Não foi possível iniciar o pagamento. Seu pedido está registrado; tente novamente ou confirme pelo WhatsApp.", 502);
    const checkoutUrl = preference.init_point || preference.sandbox_init_point;
    assert(typeof checkoutUrl === "string" && checkoutUrl.startsWith("https://"), "O provedor não retornou um link de pagamento válido.", 502);
    transaction(db => { const row=db.prepare("SELECT * FROM orders WHERE id=?").get(order.id);const document=JSON.parse(row.document);document.checkoutUrl=checkoutUrl;db.prepare("UPDATE orders SET payment_status=?,document=? WHERE id=?").run("Aguardando confirmação",JSON.stringify(document),order.id); });
    return json({ checkoutUrl, orderId: order.id });
  } catch(e) { return apiError(e); }
}
