// Presentation only. Prices and recipe ingredients stay in the original catalog.
export const pizzaVisuals = {
  margherita: {
    image: "/images/pizzas/margherita.webp", word: "essência", subtitle: "O clássico que diz tudo.", category: "O clássico italiano", number: "01",
    recipeNote: "Tomate, queijo e manjericão. Poucos elementos, um equilíbrio que atravessa gerações.",
    ingredients: [
      { profile: "VIVO · DELICADO · EQUILIBRADO", role: "A base que desperta o sabor", texture: "Acidez delicada e suculência" },
      { profile: "SUAVE · LÁCTEO · CREMOSO", role: "O coração cremoso da pizza", texture: "Maciez e sabor delicado" },
      { profile: "FRESCO · VERDE · AROMÁTICO", role: "O perfume do último toque", texture: "Frescor e leveza herbal" },
      { profile: "FRUTADO · REDONDO · SUTIL", role: "A finalização que une tudo", texture: "Textura sedosa e aroma frutado" },
    ],
  },
  calabresa: {
    image: "/images/pizzas/calabresa.webp", word: "encontro", subtitle: "Uma favorita. Do nosso jeito.", category: "O sabor da casa", number: "02",
    recipeNote: "A intensidade da calabresa encontra a delicadeza da cebola. Um clássico com a personalidade da casa.",
    ingredients: [
      { profile: "INTENSO · MARCANTE · ARTESANAL", role: "A protagonista da cobertura", texture: "Sabor intenso a cada pedaço" },
      { profile: "DELICADA · ADOCICADA · VIVA", role: "O contraponto da calabresa", texture: "Doçura suave e textura delicada" },
      { profile: "SUAVE · CREMOSA · ENVOLVENTE", role: "A camada que conecta os sabores", texture: "Queijo derretido e cremosidade" },
      { profile: "HERBAL · PERFUMADO · CLÁSSICO", role: "O aroma que completa a receita", texture: "Notas herbais e final perfumado" },
    ],
  },
  cogumelos: {
    image: "/images/pizzas/cogumelos.webp", word: "natureza", subtitle: "Da terra, uma bela surpresa.", category: "O encontro da estação", number: "03",
    recipeNote: "Três cogumelos, três personalidades. Creme de alho e tomilho fazem a ligação entre elas.",
    ingredients: [
      { profile: "PROFUNDO · TERROSO · INTENSO", role: "A profundidade do trio", texture: "Textura firme e sabor marcante" },
      { profile: "DELICADO · SUAVE · MACIO", role: "A leveza entre os cogumelos", texture: "Pequenos buquês, textura delicada" },
      { profile: "TERROSO · ENCORPADO · RICO", role: "O corpo da composição", texture: "Carnoso e cheio de sabor" },
      { profile: "CREMOSO · AROMÁTICO · SUAVE", role: "A base que envolve o trio", texture: "Cremosidade com notas de alho" },
      { profile: "HERBAL · SUTIL · PERFUMADO", role: "O fio aromático da receita", texture: "Pequenas folhas, aroma delicado" },
    ],
  },
  doce: {
    image: "/images/pizzas/doce.webp", word: "afeto", subtitle: "O final que vira lembrança.", category: "Para fechar com carinho", number: "04",
    recipeNote: "Chocolate intenso, morangos frescos e um toque de sal. Uma combinação doce, com espaço para o contraste.",
    ingredients: [
      { profile: "INTENSO · AVELUDADO · CACAU", role: "A base e a estrela da sobremesa", texture: "Chocolate 60% e textura aveludada" },
      { profile: "FRESCO · SUCULENTO · DELICADO", role: "O frescor que equilibra o cacau", texture: "Doçura natural e acidez delicada" },
      { profile: "SUTIL · MINERAL · SURPREENDENTE", role: "O detalhe que revela o chocolate", texture: "Flocos delicados, contraste sutil" },
    ],
  },
};
