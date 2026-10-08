"use client";

import { useRef, useState } from "react";
import IngredientArt from "./ingredient-art";
import PizzaArt from "./pizza-art";

export default function IngredientExplosion({ pizza, ingredients, visual }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const toggleRef = useRef(null);
  const ingredient = ingredients[selected];
  const specs = visual.ingredients[selected];
  const number = (index) => String(index + 1).padStart(2, "0");

  function close() {
    setIsOpen(false);
    toggleRef.current?.focus({ preventScroll: true });
  }

  return (
    <section className="pd-ingredients" id="ingredientes" aria-labelledby="ingredients-title">
      <div className="pd-section-heading">
        <div><p className="eyebrow"><span /> POR DENTRO DO SABOR</p><h2 id="ingredients-title">Boa por inteiro.<br /><em>Incrível em cada camada.</em></h2></div>
        <p>Uma receita feita de bons encontros.<br />Abra a pizza e descubra o que faz<br className="pd-desktop-break" /> cada ingrediente ser especial.</p>
      </div>

      <div className={`pd-experience${isOpen ? " is-open" : ""}`} style={{ "--layers": Math.min(ingredients.length, 5) }} onKeyDown={(event) => { if (event.key === "Escape" && isOpen) close(); }}>
        <div className="pd-stage">
          <div className="pd-stage-top"><span>O SABOR, CAMADA POR CAMADA</span><span className="pd-stage-status"><i />{isOpen ? "Receita aberta" : "Receita completa"}</span></div>
          <div className="pd-pizza-scene">
            <div className="pd-orbit pd-orbit-outer" /><div className="pd-orbit pd-orbit-inner" />
            <span className="pd-scene-word" aria-hidden="true">{visual.word}</span>
            <div className="pd-ground-shadow" />
            <div className="pd-pizza-base"><PizzaArt dough sweet={pizza.id === "doce"} /></div>
            <div className="pd-pizza-layers" aria-hidden={!isOpen} inert={!isOpen}>
              {ingredients.map((item, index) => (
                <button type="button" className={`pd-pizza-layer${selected === index ? " is-selected" : ""}`} key={item.name}
                  style={{ "--lift": `${(index + 1) * Math.min(65, 265 / ingredients.length)}px`, "--layer-index": index }}
                  aria-label={`Explorar ${item.name}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
                  <PizzaArt ingredient={item} sweet={pizza.id === "doce"} />
                  <span className="pd-layer-tag">{number(index)}<span>{item.name}</span></span>
                </button>
              ))}
            </div>
            <button className="pd-whole-pizza" type="button" aria-expanded={isOpen} aria-controls="pd-ingredient-details" aria-label={`Abrir a pizza ${pizza.name} e revelar os ingredientes`} onClick={() => { setIsOpen(true); toggleRef.current?.focus({ preventScroll: true }); }} tabIndex={isOpen ? -1 : 0} disabled={isOpen}>
              <img src={visual.image} alt={`Pizza ${pizza.name}, vista de cima`} width="1024" height="1024" />
              <span className="pd-pizza-touch"><span>+</span> Toque para abrir</span>
            </button>
          </div>
          <div className="pd-stage-bottom"><span>{isOpen ? "Selecione uma camada para explorar" : "Os melhores encontros começam aqui"}</span><button className="pd-open-toggle" type="button" ref={toggleRef} aria-expanded={isOpen} aria-controls="pd-ingredient-details" onClick={() => setIsOpen((current) => !current)}><span aria-hidden="true">{isOpen ? "−" : "+"}</span>{isOpen ? "Montar a pizza" : "Abrir ingredientes"}</button></div>
        </div>

        <div className="pd-ingredient-panel" id="pd-ingredient-details">
          <div className="pd-closed-panel" aria-hidden={isOpen} inert={isOpen}>
            <span className="pd-small-label">{number(ingredients.length - 1)} INGREDIENTES. UM BOM ENCONTRO.</span>
            <div className="pd-ingredient-preview" aria-hidden="true">{ingredients.slice(0, 3).map(item => <IngredientArt key={item.name} name={item.name} />)}</div>
            <h3>O segredo?<br /><em>Está no que vai dentro.</em></h3>
            <p>{visual.recipeNote}</p>
            <div className="pd-closed-recipe">{ingredients.map((item, i) => <span key={item.name}><i>{number(i)}</i>{item.name}</span>)}</div>
            <span className="pd-discover-note"><span aria-hidden="true">↖</span> Abra a pizza para conhecer cada detalhe</span>
          </div>
          <div className="pd-open-panel" aria-hidden={!isOpen} inert={!isOpen}>
            <div className="pd-detail-top"><span className="pd-small-label">INGREDIENTE EM DESTAQUE</span><span>{number(selected)} / {number(ingredients.length - 1)}</span></div>
            <div className="pd-ingredient-portrait" key={`portrait-${selected}`}><span aria-hidden="true">{number(selected)}</span><IngredientArt name={ingredient.name} /></div>
            <div className="pd-ingredient-description" key={`description-${selected}`} aria-live="polite" aria-atomic="true"><span className="pd-flavor-label">{specs.profile}</span><h3>{ingredient.name}<span>.</span></h3><p>{ingredient.note}</p><dl><div><dt>Na receita</dt><dd>{specs.role}</dd></div><div><dt>No paladar</dt><dd>{specs.texture}</dd></div></dl></div>
            <div className="pd-ingredient-selector" role="group" aria-label="Escolher ingrediente">{ingredients.map((item, index) => <button key={item.name} type="button" aria-label={`Ver ${item.name}`} aria-pressed={selected === index} className={selected === index ? "is-selected" : ""} onClick={() => setSelected(index)}><IngredientArt name={item.name} /><span>{number(index)}</span></button>)}</div>
            <div className="pd-ingredient-navigation"><button type="button" aria-label="Ingrediente anterior" onClick={() => setSelected((selected + ingredients.length - 1) % ingredients.length)}>←</button><span>Explore todos os ingredientes</span><button type="button" aria-label="Próximo ingrediente" onClick={() => setSelected((selected + 1) % ingredients.length)}>→</button></div>
          </div>
        </div>
      </div>
      <p className="pd-illustration-note">Uma ilustração da nossa receita. O sabor acontece no forno.</p>
    </section>
  );
}
