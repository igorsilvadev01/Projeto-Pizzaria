"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultConfiguration, quoteItem, cents, money } from "../../lib/commerce";

const PortalContext = createContext(null);
const CART_KEY = "spadoni_cart_v2";
function validEntry(item) {
  const config = item?.configuration;
  return config && Array.isArray(config.flavorIds) && config.flavorIds.every(id => typeof id === "string") && Array.isArray(config.extras) && config.extras.every(extra => extra && typeof extra.ingredientId === "string" && Number.isInteger(extra.quantity)) && Array.isArray(config.removedIngredientIds) && config.removedIngredientIds.every(id => typeof id === "string") && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 10;
}
export async function api(url, method = "GET", body) {
  const response = await fetch(url, { method, credentials: "same-origin", cache: "no-store", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const result = await response.json(); if (!response.ok) { const error = new Error(result.error || "Não foi possível concluir."); error.status = response.status; throw error; } return result;
}
export function configurationKey(config) { return JSON.stringify({ ...config, flavorIds: [...config.flavorIds].sort(), extras: [...config.extras].sort((a,b) => a.ingredientId.localeCompare(b.ingredientId)), removedIngredientIds: [...config.removedIngredientIds].sort() }); }

export default function PortalProvider({ initialCatalog, initialUser, children }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [user, setUser] = useState(initialUser);
  const [entries, setEntries] = useState([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try { const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); if (Array.isArray(stored)) setEntries(stored.slice(0,20).filter(validEntry)); } catch { setNotice("Não foi possível recuperar sua sacola. Monte sua pizza novamente."); }
    setReady(true);
    const refresh = () => { api("/api/catalog").then(setCatalog).catch(() => {}); api("/api/auth/session").then(result => setUser(result.user)).catch(() => {}); };
    window.addEventListener("focus", refresh); const timer = window.setInterval(refresh, 60000);
    return () => { window.removeEventListener("focus", refresh); window.clearInterval(timer); };
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(CART_KEY, JSON.stringify(entries)); } catch { setNotice("Seu navegador não conseguiu salvar a sacola."); } }, [entries, ready]);
  const cart = useMemo(() => entries.map(entry => {
    const key = configurationKey(entry.configuration);
    try {
      const quote = quoteItem(catalog, entry.configuration); const pizza = catalog.pizzas.find(p => p.id === entry.configuration.flavorIds[0]);
      return { ...entry, ...quote, key, size: quote.configuration.sizeId, sizeName: quote.size, pizza: { ...pizza, name: quote.label, prices: { ...pizza.prices, [quote.configuration.sizeId]: quote.unitPrice } }, invalid: false };
    } catch (e) { return { ...entry, key, invalid: true, error: e.message, label: "Pizza indisponível", pizza: { id: entry.configuration.flavorIds[0], name: "Pizza indisponível", image: "/images/pizzas/margherita.webp", prices: { grande: 0, individual: 0 } }, size: entry.configuration.sizeId, unitPrice: 0 }; }
  }), [entries, catalog]);
  const total = money(cart.reduce((sum, item) => sum + cents(item.unitPrice) * item.quantity, 0));
  function add(configuration, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("Escolha de 1 a 10 unidades por pizza.");
    const quote = quoteItem(catalog, configuration);
    const key = configurationKey(quote.configuration);
    const existing = entries.find(item => configurationKey(item.configuration) === key);
    if (existing && existing.quantity + quantity > 10) throw new Error("Escolha até 10 unidades por pizza.");
    if (!existing && entries.length >= 20) throw new Error("A sacola comporta até 20 pizzas diferentes.");
    setEntries(current => existing ? current.map(i => configurationKey(i.configuration) === key ? { ...i, quantity: i.quantity + quantity } : i) : [...current, { configuration: quote.configuration, quantity }]);
    setNotice(`${quote.label} adicionada à sacola.`); return quote;
  }
  function changeQuantity(key, amount) { setEntries(current => current.map(i => configurationKey(i.configuration) === key ? { ...i, quantity: Math.min(10, i.quantity + amount) } : i).filter(i => i.quantity > 0)); }
  function remove(key) { setEntries(current => current.filter(i => configurationKey(i.configuration) !== key)); }
  function addMany(items) {
    const next = entries.map(item => ({ ...item }));
    for (const item of items) {
      const quote = quoteItem(catalog, item.configuration);
      const key = configurationKey(quote.configuration);
      const prior = next.find(i => configurationKey(i.configuration) === key);
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10 || (prior?.quantity || 0) + item.quantity > 10) throw new Error("A sacola aceita até 10 unidades por combinação.");
      if (prior) prior.quantity += item.quantity; else next.push({ configuration: quote.configuration, quantity: item.quantity });
    }
    if (next.length > 20) throw new Error("A sacola aceita até 20 combinações diferentes.");
    setEntries(next); setNotice("Pedido adicionado à sacola com os preços atuais.");
  }
  async function favorite(pizzaId) { if (!user) { window.location.assign(`/conta/entrar?next=${encodeURIComponent(window.location.pathname)}`); return; } try { const result = await api("/api/account", "PATCH", { action: "favorite", pizzaId }); setUser(result.user); } catch (e) { setNotice(e.message); } }
  async function refreshCatalog() { const next = await api("/api/catalog"); setCatalog(next); return next; }
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 4500); return () => clearTimeout(timer); }, [notice]);
  return <PortalContext.Provider value={{ catalog, setCatalog, user, setUser, ready, cart, total, add, addMany, changeQuantity, remove, clear: () => setEntries([]), favorite, refreshCatalog, notify: setNotice, defaultConfiguration }}>
    {children}
    {notice && <div className="sp-toast" role="status">{notice}<button type="button" aria-label="Fechar mensagem" onClick={() => setNotice("")}>×</button></div>}
  </PortalContext.Provider>;
}
export function usePortal() { return useContext(PortalContext); }
