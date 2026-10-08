import "server-only";
import { randomUUID } from "node:crypto";
import { database, getCatalog, transaction } from "./database";
import { assert, text, quoteItem, cents, money, ORDER_STATUSES } from "./commerce";

export function quoteOrder(catalog, body) {
  assert(catalog.settings.open, "A loja está pausada para novos pedidos. Volte em breve.", 409);
  assert(/^\d{10,15}$/.test(catalog.settings.whatsappNumber), "O contato da loja ainda não está configurado.", 503);
  assert(Array.isArray(body.items) && body.items.length >= 1 && body.items.length <= 20, "Adicione de 1 a 20 itens à sacola.");
  const items = body.items.map(item => {
    assert(item && typeof item === "object", "Item da sacola inválido.");
    assert(Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 10, "Escolha de 1 a 10 unidades por pizza.");
    return { ...quoteItem(catalog, item.configuration), quantity: item.quantity };
  });
  const subtotal = money(items.reduce((sum, item) => sum + cents(item.unitPrice) * item.quantity, 0));
  assert(subtotal >= catalog.settings.minOrder, `O pedido mínimo é R$ ${catalog.settings.minOrder.toFixed(2)}.`);
  if (body.expectedTotal !== undefined) assert(typeof body.expectedTotal === "number" && cents(body.expectedTotal) === cents(subtotal), "Os preços mudaram. Atualize a sacola antes de confirmar.", 409);
  assert(["pickup", "delivery"].includes(body.fulfillment) && catalog.settings[body.fulfillment === "pickup" ? "pickupEnabled" : "deliveryEnabled"], "Escolha uma modalidade disponível.");
  const address = body.fulfillment === "delivery" ? validateAddress(body.address) : null;
  return { items, subtotal, total: subtotal, deliveryFee: null, fulfillment: body.fulfillment, address, note: text(body.note ?? "", "Observações do pedido", 300, true), catalogRevision: catalog.revision };
}
export function validateAddress(input) {
  assert(input && typeof input === "object", "Informe o endereço de entrega.");
  return { street: text(input.street, "Rua", 120), number: text(input.number, "Número", 20), neighborhood: text(input.neighborhood, "Bairro", 80), city: text(input.city, "Cidade", 80), complement: text(input.complement || "", "Complemento", 120, true), postalCode: text(input.postalCode || "", "CEP", 9, true) };
}
export function orderRecord(row) { return { ...JSON.parse(row.document), id: row.id, createdAt: row.created_at, updatedAt: row.updated_at, status: row.status, paymentStatus: row.payment_status }; }
export function listOrders(userId, all = false) { return (all ? database().prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 300").all() : database().prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 100").all(userId)).map(orderRecord); }
export function findOrder(id, user) { const row = database().prepare("SELECT * FROM orders WHERE id=?").get(id); assert(row && (user.role === "admin" || row.user_id === user.id), "Pedido não encontrado.", 404); return orderRecord(row); }
export function createOrder(body, user, channel = "whatsapp") {
  const key = text(body.idempotencyKey, "Chave do pedido", 100); assert(/^[a-zA-Z0-9-]{16,100}$/.test(key), "Chave do pedido inválida.");
  return transaction(db => {
    const prior = db.prepare("SELECT * FROM orders WHERE idempotency_key=?").get(key);
    if (prior) { assert(prior.user_id === user.id, "Pedido inválido.", 409); return orderRecord(prior); }
    const quote = quoteOrder(getCatalog(), body);
    const phone = text(body.phone || user.phone, "Telefone", 25); assert(phone.replace(/\D/g, "").length >= 10, "Informe um telefone com DDD.");
    const id = `SPD-${randomUUID().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const document = { ...quote, customer: { name: user.name, phone }, userId: user.id, channel, timeline: [{ status: "Recebido", at: now }], checkoutUrl: null };
    db.prepare("INSERT INTO orders VALUES (?,?,?,?,?,?,?,?)").run(id, user.id, now, now, "Recebido", "Não confirmado", JSON.stringify(document), key);
    return orderRecord(db.prepare("SELECT * FROM orders WHERE id=?").get(id));
  });
}
export function changeOrderStatus(id, status) {
  assert(ORDER_STATUSES.includes(status), "Status inválido.");
  return transaction(db => {
    const row = db.prepare("SELECT * FROM orders WHERE id=?").get(id); assert(row, "Pedido não encontrado.", 404);
    assert(!["Concluído", "Cancelado"].includes(row.status) || row.status === status, "Um pedido encerrado não pode ser reaberto.", 409);
    if (row.status === status) return orderRecord(row);
    const document = JSON.parse(row.document); const now = new Date().toISOString();
    assert(status !== (document.fulfillment === "pickup" ? "Saiu para entrega" : "Pronto para retirada"), "Este status não corresponde à modalidade do pedido.");
    document.timeline.push({ status, at: now });
    db.prepare("UPDATE orders SET status=?,updated_at=?,document=? WHERE id=?").run(status, now, JSON.stringify(document), id);
    return orderRecord(db.prepare("SELECT * FROM orders WHERE id=?").get(id));
  });
}
export function whatsappLink(order, catalog) {
  if (!/^\d{10,15}$/.test(catalog.settings.whatsappNumber)) return null;
  const lines = order.items.map(item => `${item.quantity}× ${item.label}\n${item.details}${item.configuration.note ? `\nObservação: ${item.configuration.note}` : ""}\n${item.quantity}× R$ ${item.unitPrice.toFixed(2)}`);
  const address = order.address;
  const destination = address ? `Entrega: ${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}${address.complement ? ` (${address.complement})` : ""}. Favor confirmar cobertura e frete.` : `Retirada: ${catalog.settings.storeAddress}`;
  const message = `Olá, SPADONI! Quero confirmar o pedido ${order.id}.\n${order.customer.name} · ${order.customer.phone}\n${destination}\n\n${lines.join("\n\n")}\n\nSubtotal: R$ ${order.subtotal.toFixed(2)}${order.note ? `\nObservações: ${order.note}` : ""}`;
  return `https://wa.me/${catalog.settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
