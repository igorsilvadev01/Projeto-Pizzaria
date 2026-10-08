import Link from "next/link";
import { notFound } from "next/navigation";
import BrandMark from "../../components/brand-mark";
import IngredientExplosion from "./ingredient-explosion";
import { pizzas, formatPrice } from "../../../lib/catalog";
import { pizzaVisuals } from "../../../lib/pizza-visuals";
import { getCatalog } from "../../../lib/database";
import { isAvailable } from "../../../lib/commerce";
import "./pizza-detail.css";

export function generateStaticParams() { return pizzas.map((pizza) => ({ slug: pizza.id })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pizza = getCatalog().pizzas.find((item) => item.id === slug);
  if (!pizza) return {};
  return { title: `${pizza.name} | SPADONI`, description: `${pizza.description} Conheça cada ingrediente da ${pizza.name} da SPADONI.` };
}

export default async function PizzaPage({ params }) {
  const { slug } = await params;
  const catalog = getCatalog();
  const pizza = catalog.pizzas.find((item) => item.id === slug);
  if (!pizza) notFound();
  const ingredients = pizza.ingredientIds.map(id => catalog.ingredients.find(i => i.id === id));
  const details = { introduction: pizza.introduction || pizza.description, ingredients, stages: [{ title: "A massa", text: "A base da casa recebe tempo e cuidado em cada etapa." }, { title: "A cobertura", text: pizza.description }, { title: "O toque final", text: "Uma composição preparada pela nossa cozinha, com o seu jeito de pedir." }] };
  const available = isAvailable(pizza, catalog);
  const sizes = catalog.sizes.filter(size => size.active);
  const visual = { ...(pizzaVisuals[slug] || { word: "encontro", category: pizza.category === "sweet" ? "Um encontro doce" : "A receita da casa", subtitle: "Um sabor, do nosso jeito.", number: String(catalog.pizzas.indexOf(pizza) + 1).padStart(2, "0") }), image: pizza.image, recipeNote: pizza.description, ingredients: ingredients.map(i => ({ profile: i.profile || "UM DETALHE DO SABOR", role: i.role || "Um elemento da composição", texture: i.texture || i.note })) };
  const others = catalog.pizzas.filter((item) => item.id !== slug && isAvailable(item, catalog)).slice(0, 3);
  return (
    <main className={`pd-page pd-flavor-${slug}`}>
      <header className="site-header pd-header">
        <Link className="brand" href="/" aria-label="SPADONI, início"><BrandMark /><span>SPADONI<span className="brand-period">.</span></span></Link>
        <nav className="main-nav" aria-label="Navegação principal"><Link href="/#cardapio">Cardápio</Link><Link href="/#jeito-brasa">Nossa cozinha</Link></nav>
        <Link className="pd-back-link" href="/#cardapio"><span aria-hidden="true">←</span> Voltar ao cardápio</Link>
      </header>
      <section className="pd-hero" aria-labelledby="pizza-title">
        <div className="pd-hero-copy">
          <nav className="pd-breadcrumb" aria-label="Caminho da página"><Link href="/#cardapio">Nossas pizzas</Link><span aria-hidden="true">/</span><span>{pizza.name}</span></nav>
          <p className="eyebrow"><span /> {visual.category.toUpperCase()}</p>
          <h1 id="pizza-title">{pizza.name}<span className="brand-period">.</span></h1>
          <p className="pd-hero-subtitle">{visual.subtitle}</p>
          <p className="pd-hero-description">{details.introduction}</p>
          <div className="pd-hero-actions"><Link className="button button-primary" href={available ? `/montar?sabor=${slug}` : "/#cardapio"}>{available ? "Personalizar e pedir" : "Ver sabores disponíveis"} <span aria-hidden="true">↗</span></Link><a className="pd-explore-link" href="#ingredientes">Explorar ingredientes <span aria-hidden="true">↓</span></a></div>
          {!available && <p className="sp-form-help">Este sabor está indisponível no momento. Ele volta à vitrine assim que a receita estiver pronta para novos pedidos.</p>}
          <div className="pd-hero-meta"><div><span>A PARTIR DE</span><strong>{formatPrice(Math.min(...sizes.map(size => pizza.prices[size.id])))}</strong></div><div><span>DO SEU JEITO</span><strong>{sizes.map(size => size.name).join(" ou ")}</strong></div></div>
        </div>
        <div className="pd-hero-art">
          <span className="pd-hero-word" aria-hidden="true">{visual.word}</span><div className="pd-hero-ring" /><div className="pd-hero-ring pd-hero-ring-two" />
          <img className="pd-hero-pizza" src={visual.image} alt={`Pizza ${pizza.name}: ${pizza.description}`} width="1024" height="1024" fetchPriority="high" />
          <div className="pd-hero-seal"><span>RECEITA</span><BrandMark /><span>DA CASA</span></div>
          <div className="pd-hero-art-footer"><span>FEITA COM TEMPO. SERVIDA COM CARINHO.</span><span>SPADONI / {visual.number}</span></div>
        </div>
      </section>
      <div className="pd-recipe-strip"><span>A COMBINAÇÃO</span><p>{details.ingredients.map((item, index) => <span key={item.name}>{index > 0 && <i aria-hidden="true">+</i>}{item.name}</span>)}</p><a href="#ingredientes" aria-label="Conhecer a composição da pizza">↓</a></div>
      <IngredientExplosion pizza={pizza} ingredients={details.ingredients} visual={visual} />
      <section className="pd-craft" aria-labelledby="craft-title">
        <div className="pd-craft-intro"><p className="eyebrow"><span /> O JEITO SPADONI</p><h2 id="craft-title">O cuidado começa<br /><em>antes do forno.</em></h2><p>Tempo, bons ingredientes e atenção aos detalhes. É assim que a nossa receita ganha vida.</p><span className="pd-craft-signature">Da nossa cozinha, para a sua mesa.</span></div>
        <ol className="pd-craft-stages">{details.stages.map((stage, index) => <li key={stage.title}><span>0{index + 1}</span><div><h3>{stage.title}</h3><p>{stage.text}</p></div></li>)}</ol>
      </section>
      <section className="pd-more" aria-labelledby="more-title"><div className="pd-more-heading"><div><p className="eyebrow"><span /> MAIS BONS ENCONTROS</p><h2 id="more-title">Seu próximo favorito.</h2></div><Link className="pd-explore-link" href="/#cardapio">Ver o cardápio completo <span aria-hidden="true">↗</span></Link></div><div className="pd-more-grid">{others.map(item => <Link className="pd-more-card" key={item.id} href={`/pizzas/${item.id}`}><div className="pd-more-image"><img src={item.image} alt={item.name} width="400" height="400" loading="lazy" /><span aria-hidden="true">↗</span></div><div className="pd-more-card-copy"><span>{pizzaVisuals[item.id]?.category || "Um sabor da casa"}</span><h3>{item.name}</h3><p>A partir de {formatPrice(Math.min(...Object.values(item.prices)))}</p></div></Link>)}</div></section>
      <section className="pd-cta"><p className="eyebrow"><span /> A MELHOR PARTE É A PRIMEIRA FATIA</p><h2>Deu vontade?<br /><em>A gente entende.</em></h2><Link className="button button-primary" href="/#cardapio">Escolher minha pizza <span aria-hidden="true">↗</span></Link><p>Pizza de bairro, feita para compartilhar.</p></section>
      <footer className="site-footer pd-footer"><Link className="brand" href="/"><BrandMark /><span>SPADONI<span className="brand-period">.</span></span></Link><p>Pizza de bairro, feita com tempo e carinho.</p><Link className="pd-back-link" href="/#cardapio">Voltar ao cardápio <span aria-hidden="true">↗</span></Link></footer>
    </main>
  );
}
