"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "../lib/catalog";
import BrandMark from "./components/brand-mark";
import { usePortal } from "./components/portal-provider";
import { Icon, FavoriteButton } from "./components/portal-ui";
import { isAvailable, defaultConfiguration } from "../lib/commerce";


export default function Storefront() {
  const { catalog, cart, total: cartTotal, add, changeQuantity: changeCartQuantity, user, notify } = usePortal();
  const menu = catalog.pizzas;
  const { storeAddress, openingHours } = catalog.settings;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [panel, setPanel] = useState("");
  const [cep, setCep] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [cartAnnouncement, setCartAnnouncement] = useState("");
  const cartPanelRef = useRef(null);
  const locationPanelRef = useRef(null);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!panel) return undefined;
    const previousActiveElement = document.activeElement;
    const dialog = panel === "cart" ? cartPanelRef.current : locationPanelRef.current;
    const initialFocus = dialog?.querySelector("button, input");
    initialFocus?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setPanel("");
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = [...dialog.querySelectorAll(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.classList.add("panel-open");
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("panel-open");
      document.removeEventListener("keydown", onKeyDown);
      if (previousActiveElement instanceof HTMLElement && previousActiveElement.isConnected) {
        previousActiveElement.focus();
      }
    };
  }, [panel]);

  function addToCart(pizza, size) {
    try { add(defaultConfiguration(pizza.id, size)); setCartAnnouncement(pizza.name + " adicionada à sacola."); } catch (error) { notify(error.message); }
  }
  function changeQuantity(id, size, amount) {
    const item = cart.find(i => i.configuration.flavorIds.length === 1 && i.pizza.id === id && i.size === size && i.configuration.crustId === "tradicional" && !i.configuration.extras.length && !i.configuration.removedIngredientIds.length && !i.configuration.note);
    if (item) changeCartQuantity(item.key, amount);
  }

  function showDirections(origin) {
    const url = storeAddress
      ? new URL("https://www.google.com/maps/dir/")
      : new URL("https://www.google.com/maps/search/");
    url.searchParams.set("api", "1");
    if (storeAddress) {
      url.searchParams.set("destination", storeAddress);
      if (origin) url.searchParams.set("origin", origin);
    } else {
      url.searchParams.set("query", origin ? `pizzaria perto de ${origin}` : "pizzaria perto de mim");
    }
    setLocationMessage(storeAddress
      ? "Pronto! Veja como chegar até a SPADONI."
      : "O endereço da SPADONI ainda será cadastrado. Por enquanto, veja pizzarias próximas.");
    return url.toString();
  }

  async function searchCep(event) {
    event.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setLocationMessage("Digite um CEP válido com 8 números.");
      return;
    }
    setLocationMessage("Buscando seu endereço…");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) throw new Error("Falha ao consultar o CEP.");
      const data = await response.json();
      if (data.erro) {
        setLocationMessage("Não encontramos esse CEP. Confira os números e tente novamente.");
        return;
      }
      const address = [data.logradouro, data.bairro, data.localidade, data.uf].filter(Boolean).join(", ");
      const href = showDirections(address);
      setLocationMessage(
        <>
          {storeAddress ? "" : `${address}. O endereço da SPADONI ainda será cadastrado. `}
          <a href={href} target="_blank" rel="noreferrer">Abrir rota no mapa ↗</a>
        </>,
      );
    } catch {
      setLocationMessage("Não foi possível buscar o CEP agora. Confira sua conexão e tente novamente.");
    }
  }

  function useLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Seu navegador não oferece acesso à localização. Você pode buscar pelo CEP.");
      return;
    }
    setLocationMessage("Buscando sua localização…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const href = showDirections(`${coords.latitude},${coords.longitude}`);
        setLocationMessage(
          <>
            {storeAddress ? "Veja como chegar até a SPADONI. " : "O endereço da SPADONI ainda será cadastrado. "}
            <a href={href} target="_blank" rel="noreferrer">Abrir mapa ↗</a>
          </>,
        );
      },
      (error) => setLocationMessage(error.code === error.PERMISSION_DENIED
        ? "A permissão de localização foi negada. Você pode buscar pelo CEP."
        : error.code === error.TIMEOUT
          ? "A localização demorou para responder. Tente novamente ou busque pelo CEP."
          : "Não foi possível determinar sua localização. Você pode buscar pelo CEP."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  const visiblePizzas = menu.filter((pizza) => isAvailable(pizza, catalog) && (category === "all" || category === "favorites" && user?.favorites?.includes(pizza.id) || pizza.category === category) && `${pizza.name} ${pizza.description} ${pizza.ingredientIds.map(id => catalog.ingredients.find(i => i.id === id)?.name || "").join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="SPADONI, início"><BrandMark /><span>SPADONI<span className="brand-period">.</span></span></a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#cardapio">Cardápio</a><a href="#jeito-brasa">Nosso jeito</a>
          <button className="nav-location" type="button" onClick={() => setPanel("location")}><span aria-hidden="true">⌖</span> Encontrar a gente</button>
        </nav>
        <div className="sp-store-actions"><Link className="sp-account-link" href="/conta" aria-label="Minha conta"><Icon name="user" size={18} /><span>Minha conta</span></Link><button className="cart-button" type="button" onClick={() => setPanel("cart")} aria-label="Abrir sacola">
          <span className="cart-icon" aria-hidden="true">♧</span><span className="cart-label">Sua sacola</span><span className="cart-count" key={cartCount}>{cartCount}</span>
        </button></div>
      </header>
      <span className="visually-hidden" role="status" aria-live="polite">{cartAnnouncement}</span>
      {!catalog.settings.open && <div className="sp-store-closed">A cozinha está pausada para novos pedidos. Você pode explorar o cardápio e salvar seus favoritos.</div>}

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow"><span /> FEITA AQUI. PRA COMER AÍ.</p>
            <h1>Uma boa pizza<br />muda <em>a noite.</em></h1>
            <p className="hero-description">Massa de longa fermentação, ingredientes de verdade e aquele capricho que dá pra sentir no primeiro pedaço.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#cardapio">Escolha sua pizza <span aria-hidden="true">↘</span></a>
              <button className="text-link" type="button" onClick={() => setPanel("location")}><span aria-hidden="true">⌖</span> Descubra se entregamos aí</button>
            </div>
            <div className="hero-note"><div className="avatar-stack" aria-hidden="true"><span>🍅</span><span>🌿</span><span>🧀</span></div><p><strong>Feita à mão, todo dia.</strong><br />Sem pressa. Sem atalhos.</p></div>
          </div>
          <div className="hero-art" aria-label="Pizza artesanal recém-saída do forno" role="img">
            <div className="hero-stamp"><span>FERMENTAÇÃO</span><strong>48h</strong><span>DE PACIÊNCIA</span></div>
            <div className="hero-caption"><span>01 / 04</span><span>O clássico da casa</span></div>
          </div>
          <div className="hero-bottom"><span>ARRASTE PRA DESCOBRIR</span><span aria-hidden="true">↓</span></div>
        </section>

        <section className="menu-section section-wrap" id="cardapio">
          <div className="section-heading">
            <div><p className="eyebrow"><span /> BOAS, FEITAS PARA VOCÊ</p><h2>Seu próximo<br className="mobile-break" /> bom encontro.</h2></div>
            <p className="section-aside">Receitas da casa, com o seu toque.<br />Cada sabor tem seu próprio momento.</p>
          </div>
          <div className="sp-store-searchbar"><div className="sp-category-tabs" role="group" aria-label="Categorias do cardápio">{[["all","Todas"],["savory","Salgadas"],["sweet","Doces"],["favorites","Favoritas"]].map(([id,label])=><button key={id} type="button" className={category===id?"is-selected":""} aria-pressed={category===id} onClick={()=>setCategory(id)}>{label}</button>)}</div><label className="sp-search"><Icon name="search" size={16} /><input aria-label="Buscar pizza ou ingrediente" placeholder="Um sabor, um ingrediente…" value={search} onChange={e=>setSearch(e.target.value)} /></label></div>
          <div className="pizza-grid">
            {visiblePizzas.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onAdd={addToCart}
                cartItems={cart.filter((item) => item.pizza.id === pizza.id && item.configuration.flavorIds.length === 1 && item.configuration.crustId === "tradicional" && !item.configuration.extras.length && !item.configuration.removedIngredientIds.length && !item.configuration.note)}
                onChangeQuantity={changeQuantity}
              />
            ))}
          </div>
          {visiblePizzas.length===0&&<p className="sp-form-help">{category==="favorites"?"Seus favoritos aparecem aqui. Toque no coração de uma pizza para guardar o sabor.":"Nenhuma pizza encontrada. Experimente outro sabor ou ingrediente."}</p>}
          <div className="sp-make-banner"><div><p className="eyebrow"><span /> O SEU TOQUE FAZ PARTE DA RECEITA</p><h3>Uma pizza.<br /><em>Do seu jeito.</em></h3><p>Combine sabores, escolha a borda e descubra os adicionais da casa.</p><Link className="button button-primary" href="/montar">Montar minha combinação <span aria-hidden="true">↗</span></Link></div><img src="/images/pizzas/calabresa.webp" alt="Pizza da casa" width="300" height="300" /></div>
          <div className="menu-footnote"><span>✳</span> Massa artesanal • Fermentação natural • Ingredientes frescos</div>
        </section>

        <section className="order-guide" aria-labelledby="order-guide-title">
          <div className="order-guide-heading">
            <p className="eyebrow"><span /> SIMPLES ASSIM</p>
            <h2 id="order-guide-title">Da nossa cozinha<br /><em>até você.</em></h2>
          </div>
          <div className="order-steps">
            <article className="order-step"><span>01</span><h3>Escolha seus sabores</h3><p>Selecione o tamanho e adicione cada pizza à sacola.</p></article>
            <article className="order-step"><span>02</span><h3>Escolha como receber</h3><p>Prefere entrega? Diga seu bairro para confirmarmos a região e o frete. Também dá para retirar.</p></article>
            <article className="order-step"><span>03</span><h3>Confirme no WhatsApp</h3><p>Confira os itens e combine com a equipe os detalhes antes de fechar o pedido.</p></article>
          </div>
        </section>

        <section className="manifesto" id="jeito-brasa">
          <div className="manifesto-image" role="img" aria-label="Forno a lenha aceso" />
          <div className="manifesto-copy">
            <p className="eyebrow"><span /> NOSSO JEITO</p><h2>O segredo?<br /><em>Não ter pressa.</em></h2>
            <p>A gente acredita que as melhores coisas levam tempo. Nossa massa descansa por 48 horas, os ingredientes vêm de produtores que conhecemos pelo nome e cada pizza sai do forno quando está no ponto.</p>
            <div className="manifesto-signature">Com carinho, equipe SPADONI <span>✳</span></div>
          </div>
        </section>

        <section className="location-banner">
          <div><p className="eyebrow"><span /> A PIZZA VAI ATÉ VOCÊ?</p><h2>Seu sofá já está<br />com saudade.</h2><p className="store-banner-hours">{openingHours}</p></div>
          <button className="button button-light" type="button" onClick={() => setPanel("location")}>Descobrir meu endereço <span aria-hidden="true">↗</span></button>
          <span className="banner-doodle" aria-hidden="true">✳</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#inicio"><BrandMark /><span>SPADONI<span className="brand-period">.</span></span></a>
        <p>Pizza de bairro, feita com tempo e carinho.</p>
        <span className="store-contact">
          {storeAddress ? <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeAddress)}`} target="_blank" rel="noreferrer">{storeAddress} ↗</a> : <span>Endereço ainda não informado.</span>}
          <small>{openingHours}</small>
        </span>
        <span>© 2026 SPADONI. Um pedaço de cada vez.</span>
        <a className="admin-link" href="/admin/login">Área administrativa ↗</a>
      </footer>

      {cartCount > 0 && panel !== "cart" && (
        <button className="mobile-cart-dock" type="button" onClick={() => setPanel("cart")} aria-label={`Abrir sacola com ${cartCount} itens, subtotal ${formatPrice(cartTotal)}`}>
          <span className="mobile-dock-icon" aria-hidden="true">♧ <span>{cartCount}</span></span>
          <span className="mobile-dock-copy"><strong>Ver minha sacola</strong><small>{cartCount} {cartCount === 1 ? "item" : "itens"}</small></span>
          <strong className="mobile-dock-total">{formatPrice(cartTotal)}</strong>
          <span className="mobile-dock-arrow" aria-hidden="true">→</span>
        </button>
      )}

      {panel && <div className="overlay visible" onClick={() => setPanel("")} aria-hidden="true" />}
      <aside
        ref={cartPanelRef}
        className={`side-panel cart-panel${panel === "cart" ? " is-open" : ""}`}
        role="dialog"
        aria-modal={panel === "cart" ? "true" : undefined}
        aria-labelledby="cart-title"
        aria-hidden={panel !== "cart"}
        inert={panel !== "cart"}
        tabIndex="-1"
      >
        <div className="panel-heading">
          <div><p className="eyebrow"><span /> JÁ ESTÁ COM FOME?</p><h2 id="cart-title">Sua sacola<span className="brand-period">.</span></h2></div>
          <button className="icon-button" type="button" onClick={() => setPanel("")} aria-label="Fechar sacola">×</button>
        </div>
        <div className="cart-items">
          {cart.map(({ pizza, size, quantity, key, details, invalid, error }) => (
            <div className="cart-line" key={key}>
              <img src={pizza.image} alt="" />
              <div className="cart-line-copy"><strong>{pizza.name}</strong><span>{details || error} · {formatPrice(pizza.prices[size])}</span></div>
              <div className="quantity-control" aria-label={`Quantidade de ${pizza.name}`}>
                <button type="button" onClick={() => changeCartQuantity(key, -1)} aria-label={`Remover uma ${pizza.name}`}>−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => changeCartQuantity(key, 1)} disabled={quantity>=10} aria-label={`Adicionar uma ${pizza.name}`}>+</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty"><span aria-hidden="true">🍕</span><h3>Uma pizza ficaria bem aqui.</h3><p>Escolha seu sabor favorito e a gente cuida do resto.</p><button className="text-link" type="button" onClick={() => setPanel("")}>Ver o cardápio <span aria-hidden="true">↗</span></button></div>
        ) : (
          <div className="cart-summary">
            <div className="subtotal"><span>Subtotal das pizzas</span><strong>{formatPrice(cartTotal)}</strong></div>
            <p>Revise sua combinação, escolha retirada ou entrega e acompanhe o pedido pela sua conta.</p>
            <Link className="button button-primary checkout-button" href="/sacola" onClick={() => setPanel("")}>Revisar e finalizar <span aria-hidden="true">→</span></Link>
            <Link className="sp-text-link" href="/montar" onClick={() => setPanel("")}>Montar outra pizza →</Link>
          </div>
        )}
      </aside>

      {panel === "location" && (
        <section ref={locationPanelRef} className="dialog-panel location-panel is-open" role="dialog" aria-modal="true" aria-labelledby="location-title" tabIndex="-1">
          <button className="icon-button dialog-close" type="button" onClick={() => setPanel("")} aria-label="Fechar">×</button>
          <p className="eyebrow"><span /> VAMOS NOS ENCONTRAR?</p>
          <h2 id="location-title">Onde você<br /><em>está com fome?</em></h2>
          <p className="dialog-description">Digite seu CEP ou use sua localização para consultar o endereço da pizzaria e descobrir como chegar.</p>
          <form className="location-form" onSubmit={searchCep}>
            <label htmlFor="cep">Seu CEP</label>
            <div className="input-row">
              <input id="cep" name="cep" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" maxLength={9} value={cep} onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
                setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
              }} />
              <button className="button button-primary" type="submit">Buscar</button>
            </div>
          </form>
          <button className="location-device" type="button" onClick={useLocation}><span aria-hidden="true">⌖</span> Usar minha localização</button>
          <div className="location-result" aria-live="polite">{locationMessage}</div>
          <p className="location-config-note">
            {storeAddress ? <>Retirada na SPADONI: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeAddress)}`} target="_blank" rel="noreferrer">{storeAddress} ↗</a></> : "Endereço ainda não informado."}
          </p>
        </section>
      )}
    </>
  );
}

function PizzaCard({ pizza, onAdd, cartItems, onChangeQuantity }) {
  const { catalog } = usePortal();
  const [size, setSize] = useState(catalog.sizes.find(s=>s.id==="grande"&&s.active)?.id || catalog.sizes.find(s=>s.active)?.id);
  const [justAdded, setJustAdded] = useState(false);
  const [feedbackId, setFeedbackId] = useState(0);
  const feedbackTimer = useRef(null);
  const selectedQuantity = cartItems.find((item) => item.size === size)?.quantity || 0;

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);
  useEffect(() => { if (!catalog.sizes.find(s => s.id === size && s.active)) setSize(catalog.sizes.find(s => s.active)?.id); }, [catalog.sizes, size]);

  function add(event) {
    onAdd(pizza, size);
    setFeedbackId((current) => current + 1);
    setJustAdded(true);
    window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setJustAdded(false), 850);
  }

  return (
    <article className="pizza-card">
      <div style={{position:"relative"}}><Link className="pizza-photo-link" href={`/pizzas/${pizza.id}`} aria-label={`Ver ingredientes e preparo da pizza ${pizza.name}`}>
        <div className={`pizza-photo${feedbackId ? " pizza-photo-confirmed" : ""}`}>
          <img src={pizza.image} alt={pizza.imageAlt} loading="lazy" />
          <span className="pizza-tag">{pizza.tag}</span>
          {feedbackId > 0 && <span className="photo-confirmation-ripple" key={feedbackId} aria-hidden="true" />}
          {selectedQuantity > 0 && (
            <span
              className="pizza-selection-count"
              key={selectedQuantity}
              aria-label={`${selectedQuantity} ${selectedQuantity === 1 ? "pizza selecionada" : "pizzas selecionadas"} no carrinho`}
            >
              <span aria-hidden="true">✓</span> {selectedQuantity} na sacola
            </span>
          )}
        </div>
      </Link><div className="sp-card-favorite"><FavoriteButton pizzaId={pizza.id} /></div></div>
      <div className="pizza-info">
        <div className="pizza-title-row"><h3><Link href={`/pizzas/${pizza.id}`}>{pizza.name}</Link></h3><span className="pizza-price">{formatPrice(pizza.prices[size])}</span></div>
        <p>{pizza.description}</p>
        <Link className="pizza-detail-link" href={`/pizzas/${pizza.id}`}>Conheça os ingredientes <span aria-hidden="true">↗</span></Link>
        <div className="pizza-controls">
          <select className="size-select" aria-label={`Tamanho da pizza ${pizza.name}`} value={size} onChange={(event) => setSize(event.target.value)}>
            {catalog.sizes.filter(s=>s.active).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="pizza-quantity-control" role="group" aria-label={`Quantidade de ${pizza.name} tamanho ${size === "grande" ? "grande" : "individual"}`}>
            <button
              className="pizza-quantity-button"
              type="button"
              onClick={() => onChangeQuantity(pizza.id, size, -1)}
              disabled={selectedQuantity === 0}
              aria-label={`Tirar uma ${pizza.name} ${size === "grande" ? "grande" : "individual"}`}
            >−</button>
            <span className="pizza-quantity-value" aria-live="polite">{selectedQuantity}</span>
            <button className={`add-button${justAdded ? " add-button-success" : ""}`} type="button" onClick={add} disabled={!catalog.settings.open||selectedQuantity>=10} aria-label={`Adicionar ${pizza.name} à sacola`}>
              <span aria-hidden="true">{justAdded ? "✓" : "+"}</span>
            </button>
          </div>
        </div>
        <Link className="sp-customize-link" href={`/montar?sabor=${pizza.id}`}><Icon name="settings" size={13} />Personalizar esta pizza</Link>
      </div>
    </article>
  );
}
