export const slugify = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const cents = (value) => Math.round(value * 100);
export const money = (value) => value / 100;
export const ORDER_STATUSES = ["Recebido", "Confirmado", "Em preparo", "Pronto para retirada", "Saiu para entrega", "Concluído", "Cancelado"];

export class CommerceError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export function assert(value, message, status) { if (!value) throw new CommerceError(message, status); }
export function text(value, label, max = 120, optional = false) {
  assert(typeof value === "string" && value.trim().length <= max && (optional || value.trim()), `${label} inválido.`);
  return value.trim();
}
const idValid = (id) => typeof id === "string" && /^[a-z0-9][a-z0-9-]{0,69}$/.test(id);
const isPrice = (p) => typeof p === "number" && Number.isFinite(p) && p >= 0 && p <= 9999 && Math.abs(cents(p) - p * 100) < .00001;
const pricePair = (p) => p && isPrice(p.individual) && isPrice(p.grande);
export function isAvailable(pizza, catalog) { return pizza.active && pizza.ingredientIds.every(id => catalog.ingredients.find(i => i.id === id)?.active); }
export function defaultConfiguration(pizzaId, sizeId = "grande") { return { flavorIds: [pizzaId], sizeId, crustId: "tradicional", extras: [], removedIngredientIds: [], note: "" }; }

export function quoteItem(catalog, input) {
  assert(input && typeof input === "object", "Escolha sua pizza.");
  const size = catalog.sizes.find(s => s.id === input.sizeId && s.active);
  assert(size, "Este tamanho não está disponível.");
  assert(Array.isArray(input.flavorIds) && input.flavorIds.length >= 1 && input.flavorIds.length <= size.maxFlavors && new Set(input.flavorIds).size === input.flavorIds.length, `Escolha entre 1 e ${size.maxFlavors} sabores diferentes.`);
  const flavors = input.flavorIds.map(id => catalog.pizzas.find(p => p.id === id));
  assert(flavors.every(p => p && isAvailable(p, catalog)), "Um sabor ou ingrediente não está disponível. Revise sua pizza.");
  assert(flavors.every(p => p.category === flavors[0].category), "Combine sabores da mesma categoria: salgados ou doces.");
  const crust = catalog.crusts.find(c => c.id === input.crustId && c.active);
  assert(crust && (crust.category === "all" || crust.category === flavors[0].category), "Escolha uma borda disponível para esta pizza.");
  const baseIngredients = [...new Set(flavors.flatMap(p => p.ingredientIds))];
  const removed = input.removedIngredientIds ?? [];
  assert(Array.isArray(removed) && removed.length <= baseIngredients.length && new Set(removed).size === removed.length && removed.every(id => baseIngredients.includes(id)), "Confira os ingredientes que deseja retirar.");
  const extras = input.extras ?? [];
  assert(Array.isArray(extras) && extras.length <= catalog.settings.maxExtras && new Set(extras.map(x => x?.ingredientId)).size === extras.length, `Escolha até ${catalog.settings.maxExtras} adicionais diferentes.`);
  const additional = extras.map(extra => {
    const ingredient = catalog.ingredients.find(i => i.id === extra?.ingredientId && i.active && i.allowExtra);
    assert(ingredient && (ingredient.category === "all" || ingredient.category === flavors[0].category) && Number.isInteger(extra.quantity) && extra.quantity >= 1 && extra.quantity <= 3 && !removed.includes(ingredient.id), "Confira os adicionais e as quantidades (até 3 por ingrediente).");
    return { ingredientId: ingredient.id, quantity: extra.quantity, name: ingredient.name, price: money(cents(ingredient.prices[size.id]) * extra.quantity) };
  });
  const prices = flavors.map(p => cents(p.prices[size.id]));
  const base = catalog.settings.halfPricing === "average" ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : Math.max(...prices);
  const crustPrice = cents(crust.prices[size.id]);
  const extrasPrice = additional.reduce((sum, i) => sum + cents(i.price), 0);
  const configuration = { flavorIds: flavors.map(p => p.id), sizeId: size.id, crustId: crust.id, extras: additional.map(({ ingredientId, quantity }) => ({ ingredientId, quantity })), removedIngredientIds: removed, note: text(input.note ?? "", "Observação", 240, true) };
  const label = flavors.length === 1 ? flavors[0].name : flavors.map(p => `${flavors.length === 2 ? "½" : "⅓"} ${p.name}`).join(" + ");
  const removedNames = removed.map(id => catalog.ingredients.find(i => i.id === id).name);
  return { configuration, label, image: flavors[0].image, size: size.name, crust: crust.name, basePrice: money(base), crustPrice: money(crustPrice), extrasPrice: money(extrasPrice), unitPrice: money(base + crustPrice + extrasPrice), extras: additional, removed: removedNames, details: [size.name, crust.name, ...additional.map(e => `+ ${e.quantity}× ${e.name}`), ...removedNames.map(n => `sem ${n}`)].join(" · ") };
}

export function validateCatalog(input) {
  assert(input && typeof input === "object", "Cardápio inválido.");
  for (const [key, limit] of [["pizzas", 100], ["ingredients", 200], ["crusts", 30], ["sizes", 2]]) {
    assert(Array.isArray(input[key]) && input[key].length <= limit && input[key].length >= 1, `Confira a lista de ${key}.`);
    assert(input[key].every(item => item && typeof item === "object"), "Item do cardápio inválido.");
    assert(new Set(input[key].map(x => x.id)).size === input[key].length, "Existem identificadores repetidos.");
    for (const item of input[key]) {
      assert(idValid(item.id), "Identificador inválido.");
      text(item.name, "Nome", 80);
      assert(typeof item.active === "boolean", "Disponibilidade inválida.");
      if (key !== "sizes") assert(pricePair(item.prices), `Confira os preços de ${item.name} (até 2 casas decimais).`);
    }
  }
  assert(input.sizes.length === 2 && input.sizes.some(s => s.id === "individual") && input.sizes.some(s => s.id === "grande") && input.sizes.some(s => s.active), "Mantenha os tamanhos individual e grande e pelo menos um ativo.");
  for (const s of input.sizes) { text(s.description, "Descrição do tamanho", 120, true); assert(Number.isInteger(s.maxFlavors) && s.maxFlavors >= 1 && s.maxFlavors <= 3, "Permita de 1 a 3 sabores por tamanho."); }
  for (const i of input.ingredients) {
    text(i.note, "Descrição do ingrediente", 240, true);
    assert(["savory", "sweet", "all"].includes(i.category) && typeof i.allowExtra === "boolean", "Categoria de ingrediente inválida.");
    text(i.profile, "Perfil de sabor", 100, true); text(i.role, "Função na receita", 120, true); text(i.texture, "Textura", 120, true);
  }
  for (const p of input.pizzas) {
    text(p.description, "Descrição", 400); text(p.tag, "Etiqueta", 40, true); text(p.introduction, "Apresentação", 600, true);
    assert(["savory", "sweet"].includes(p.category), "Categoria de sabor inválida.");
    assert(Array.isArray(p.ingredientIds) && p.ingredientIds.length >= 1 && p.ingredientIds.length <= 8 && new Set(p.ingredientIds).size === p.ingredientIds.length && p.ingredientIds.every(id => input.ingredients.some(i => i.id === id)), `Confira os ingredientes de ${p.name}.`);
    assert(typeof p.image === "string" && p.image.length <= 1500 && (/^\/images\/[a-zA-Z0-9/_\-.]+$/.test(p.image) || (() => { try { const u = new URL(p.image); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; } })()), "Use uma imagem local /images/... ou uma URL HTTPS válida.");
    assert(p.prices.individual > 0 && p.prices.grande > 0, "O preço de venda deve ser maior que zero.");
  }
  assert(input.pizzas.some(p => isAvailable(p, input)), "Mantenha pelo menos um sabor disponível com ingredientes ativos.");
  for (const c of input.crusts) assert(["savory", "sweet", "all"].includes(c.category), "Categoria de borda inválida.");
  assert(input.crusts.some(c => c.id === "tradicional" && c.active && c.category === "all"), "Mantenha a borda tradicional disponível para todos os sabores.");
  const s = input.settings;
  assert(s && ["highest", "average"].includes(s.halfPricing), "Regra de preço inválida.");
  assert(Number.isInteger(s.maxExtras) && s.maxExtras >= 0 && s.maxExtras <= 8, "Permita de 0 a 8 adicionais.");
  assert(Number.isInteger(s.prepMinutes) && s.prepMinutes >= 10 && s.prepMinutes <= 180, "Tempo de preparo inválido.");
  assert(typeof s.open === "boolean" && typeof s.deliveryEnabled === "boolean" && typeof s.pickupEnabled === "boolean" && (s.pickupEnabled || s.deliveryEnabled), "Habilite pelo menos uma modalidade de atendimento.");
  text(s.storeAddress, "Endereço da loja", 240, true); text(s.openingHours, "Horários", 180);
  assert(typeof s.whatsappNumber === "string" && (s.whatsappNumber === "" || /^\d{10,15}$/.test(s.whatsappNumber)), "WhatsApp inválido; inclua país e DDD.");
  assert(!s.open || /^\d{10,15}$/.test(s.whatsappNumber), "Configure o WhatsApp antes de aceitar pedidos.");
  assert(!s.open || !s.pickupEnabled || s.storeAddress.trim(), "Configure o endereço antes de aceitar pedidos para retirada.");
  assert(isPrice(s.minOrder), "Pedido mínimo inválido.");
  return JSON.parse(JSON.stringify(input));
}
