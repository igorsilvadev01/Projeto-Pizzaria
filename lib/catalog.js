export const pizzas = [
  {
    id: "margherita",
    name: "Margherita",
    tag: "A queridinha",
    description: "Tomate italiano, fior di latte, manjericão fresco e azeite.",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Pizza Margherita com manjericão e queijo",
    prices: { individual: 34, grande: 54 },
  },
  {
    id: "calabresa",
    name: "Calabresa da casa",
    tag: "Sem erro",
    description: "Calabresa artesanal, cebola roxa, muçarela e orégano.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Pizza de calabresa saindo do forno",
    prices: { individual: 36, grande: 57 },
  },
  {
    id: "cogumelos",
    name: "Trio de cogumelos",
    tag: "Da estação",
    description: "Shiitake, shimeji, portobello, creme de alho e tomilho.",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Pizza artesanal com cogumelos frescos",
    prices: { individual: 39, grande: 62 },
  },
  {
    id: "doce",
    name: "Doce de verdade",
    tag: "Pra fechar",
    description: "Chocolate 60%, morangos frescos e um toque de flor de sal.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Pizza artesanal recém-assada para compartilhar",
    prices: { individual: 38, grande: 59 },
  },
].map((pizza) => ({ ...pizza, active: true }));

export const formatPrice = (price) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
