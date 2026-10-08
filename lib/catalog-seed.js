import { pizzas } from "./catalog";
import { pizzaDetails } from "./pizza-details";
import { pizzaVisuals } from "./pizza-visuals";
import { slugify } from "./commerce";
import { storeAddress, openingHours } from "./business-info";

export function seedCatalog() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "";
  const ingredients = [];
  const menu = pizzas.map(pizza => {
    const detail = pizzaDetails[pizza.id];
    const visual = pizzaVisuals[pizza.id];
    const ingredientIds = detail.ingredients.map((item, index) => {
      const id = slugify(item.name);
      if (!ingredients.some(i => i.id === id)) ingredients.push({ id, name: item.name, note: item.note, active: true, allowExtra: true, category: pizza.id === "doce" ? "sweet" : "savory", prices: { individual: 3, grande: 5 }, ...visual.ingredients[index] });
      return id;
    });
    return { ...pizza, image: visual.image, category: pizza.id === "doce" ? "sweet" : "savory", introduction: detail.introduction, ingredientIds };
  });
  return { revision: 1, pizzas: menu, ingredients,
    sizes: [{ id: "individual", name: "Individual", description: "Seu momento, sua pizza", active: true, maxFlavors: 1 }, { id: "grande", name: "Grande", description: "Feita para compartilhar", active: true, maxFlavors: 2 }],
    crusts: [{ id: "tradicional", name: "Tradicional", category: "all", active: true, prices: { individual: 0, grande: 0 } }, { id: "cream-cheese", name: "Cream cheese", category: "savory", active: true, prices: { individual: 6, grande: 10 } }, { id: "chocolate", name: "Chocolate", category: "sweet", active: true, prices: { individual: 6, grande: 10 } }],
    settings: { open: Boolean(storeAddress && /^\d{10,15}$/.test(whatsappNumber)), halfPricing: "highest", maxExtras: 5, prepMinutes: 40, minOrder: 0, deliveryEnabled: true, pickupEnabled: true, storeAddress, openingHours, whatsappNumber },
  };
}
