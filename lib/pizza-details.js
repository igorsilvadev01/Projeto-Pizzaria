export const pizzaDetails = {
  margherita: {
    introduction: "A simplicidade pede precisão: tomate, queijo e ervas em uma composição clássica, feita para deixar cada elemento aparecer.",
    ingredients: [
      { name: "Tomate italiano", note: "Acidez delicada e sabor marcante na base da receita.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/500px-Tomato_je.jpg", imageAlt: "Tomates italianos maduros", imageCredit: "Foto: Softeis · GFDL 1.2+", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Tomato_je.jpg" },
      { name: "Fior di latte", note: "Leveza láctea e textura cremosa a cada fatia.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/2021-06-22_15_52_51_A_ball_of_Bel_Gioioso_Fresh_Mozzarella_cheese_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg/500px-2021-06-22_15_52_51_A_ball_of_Bel_Gioioso_Fresh_Mozzarella_cheese_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg", imageAlt: "Bola de queijo mozzarella fresco", imageCredit: "Foto: Famartin · CC BY-SA 4.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:2021-06-22_15_52_51_A_ball_of_Bel_Gioioso_Fresh_Mozzarella_cheese_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg" },
      { name: "Manjericão fresco", note: "Aroma herbal que traz frescor ao conjunto.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Basil_leaves_on_plate.JPG/500px-Basil_leaves_on_plate.JPG", imageAlt: "Folhas frescas de manjericão", imageCredit: "Foto: Jw2c · CC BY-SA 3.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Basil_leaves_on_plate.JPG" },
      { name: "Azeite", note: "Um toque final que arredonda os sabores.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Bottle_of_olive_oil.jpg/500px-Bottle_of_olive_oil.jpg", imageAlt: "Garrafa de azeite de oliva" },
    ],
    stages: [
      { title: "A massa", text: "A base da casa começa com fermentação lenta de 48 horas, respeitando o tempo como parte da receita." },
      { title: "O encontro", text: "Tomate italiano e fior di latte formam o coração da Margherita: equilíbrio entre acidez e cremosidade." },
      { title: "O toque final", text: "Manjericão fresco e azeite completam a composição com perfume e frescor." },
    ],
  },
  calabresa: {
    introduction: "Uma receita direta e cheia de personalidade: calabresa artesanal, cebola roxa e queijo em um equilíbrio de sabor e aroma.",
    ingredients: [
      { name: "Calabresa artesanal", note: "O sabor intenso que conduz a receita.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Pork_sausage_and_sauerkraut%2C_with_mustard%2C_and_cheddar_cheese_on_German_three-grain_bread_-_Massachusetts.jpg/500px-Pork_sausage_and_sauerkraut%2C_with_mustard%2C_and_cheddar_cheese_on_German_three-grain_bread_-_Massachusetts.jpg", imageAlt: "Linguiça artesanal fatiada" },
      { name: "Cebola roxa", note: "Uma nota adocicada que contrasta com a calabresa.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Red_Onion_on_White.JPG/500px-Red_Onion_on_White.JPG", imageAlt: "Cebola roxa fresca", imageCredit: "Foto: Colin · CC BY-SA 3.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Red_Onion_on_White.JPG" },
      { name: "Muçarela", note: "Cremosidade para unir os sabores da cobertura.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/2021-06-22_15_52_51_A_ball_of_Bel_Gioioso_Fresh_Mozzarella_cheese_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg/500px-2021-06-22_15_52_51_A_ball_of_Bel_Gioioso_Fresh_Mozzarella_cheese_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg", imageAlt: "Bola de queijo mozzarella fresco", imageCredit: "Foto: Famartin · CC BY-SA 4.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:2021-06-22_15_52_51_A_ball_of_Bel_Gioioso_Fresh_Mozzarella_cheese_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg" },
      { name: "Orégano", note: "Aroma herbal que arremata o clássico.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Oregano-spice.jpg/500px-Oregano-spice.jpg", imageAlt: "Orégano seco", imageCredit: "Foto: Henna · CC BY-SA 1.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Oregano-spice.jpg" },
    ],
    stages: [
      { title: "A massa", text: "A base da casa recebe fermentação lenta de 48 horas, para que o tempo também faça parte da experiência." },
      { title: "A cobertura", text: "Calabresa artesanal e cebola roxa criam o contraste principal; a muçarela completa a composição." },
      { title: "O aroma", text: "Orégano finaliza o perfil clássico e perfumado da pizza." },
    ],
  },
  cogumelos: {
    introduction: "Três cogumelos, um creme de alho e tomilho: uma composição aromática em que cada ingrediente tem seu próprio espaço.",
    ingredients: [
      { name: "Shiitake", note: "Sabor profundo e uma presença marcante.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Fresh_shiitake_mushrooms.jpg/500px-Fresh_shiitake_mushrooms.jpg", imageAlt: "Cogumelos shiitake frescos" },
      { name: "Shimeji", note: "Textura delicada para ampliar a composição.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Hon-shimeji_mushrooms_-_Cambridge%2C_MA.jpg/500px-Hon-shimeji_mushrooms_-_Cambridge%2C_MA.jpg", imageAlt: "Cogumelos shimeji frescos" },
      { name: "Portobello", note: "Notas terrosas que dão corpo ao trio.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/20161028-AMS-LSC-0104_%2830837218735%29.jpg/500px-20161028-AMS-LSC-0104_%2830837218735%29.jpg", imageAlt: "Cogumelos portobello frescos" },
      { name: "Creme de alho", note: "Cremosidade e sabor envolvente para a base.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Garlic_bulbs_and_cloves.jpg/500px-Garlic_bulbs_and_cloves.jpg", imageAlt: "Bulbos e dentes de alho", imageCredit: "Foto: Ivar Leidus · CC BY-SA 4.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Garlic_bulbs_and_cloves.jpg" },
      { name: "Tomilho", note: "Aroma herbal que conecta os ingredientes.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Thyme_plant_in_a_pot_18.jpg/500px-Thyme_plant_in_a_pot_18.jpg", imageAlt: "Planta de tomilho fresco", imageCredit: "Foto: Netha Hussain · CC BY-SA 4.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Thyme_plant_in_a_pot_18.jpg" },
    ],
    stages: [
      { title: "A massa", text: "A receita parte da massa da casa, com fermentação lenta de 48 horas." },
      { title: "O trio", text: "Shiitake, shimeji e portobello aparecem juntos, cada um contribuindo com textura e personalidade." },
      { title: "A composição", text: "Creme de alho e tomilho completam a receita com cremosidade e notas aromáticas." },
    ],
  },
  doce: {
    introduction: "Chocolate 60%, morangos frescos e flor de sal: uma sobremesa que equilibra intensidade, frescor e um delicado contraste.",
    ingredients: [
      { name: "Chocolate 60%", note: "Intensidade de cacau como protagonista da receita.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Newman%27s_Own_Dark_Chocolate_bar_%2832502456922%29.jpg/500px-Newman%27s_Own_Dark_Chocolate_bar_%2832502456922%29.jpg", imageAlt: "Barra de chocolate amargo", imageCredit: "Foto: Willis Lam · CC BY-SA 2.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Newman%27s_Own_Dark_Chocolate_bar_(32502456922).jpg" },
      { name: "Morangos frescos", note: "Frescor e acidez para equilibrar o chocolate.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Fresh_Cut_Strawberries.jpg/500px-Fresh_Cut_Strawberries.jpg", imageAlt: "Morangos frescos cortados" },
      { name: "Flor de sal", note: "Um contraste sutil que destaca os sabores.", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Maldon_Salt_tub.jpg/500px-Maldon_Salt_tub.jpg", imageAlt: "Sal marinho em flocos" },
    ],
    stages: [
      { title: "A base", text: "A massa da casa, de fermentação lenta por 48 horas, recebe uma leitura doce." },
      { title: "O chocolate", text: "Chocolate 60% traz intensidade e estrutura à sobremesa." },
      { title: "O contraste", text: "Morangos frescos e flor de sal completam a receita entre frescor e notas doces." },
    ],
  },
};
