"use client";
import Link from "next/link";
import BrandMark from "./brand-mark";
import { usePortal, api } from "./portal-provider";
import { formatPrice } from "../../lib/catalog";

export function Icon({ name, size = 20, ...props }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-3a8 8 0 0 1 16 0v3" /></>,
    pizza: <><path d="m4 21 4-17q6-2 12 5Z" /><path d="M8 4q6-2 12 5l-2 3q-5-5-11-5Z" /><circle cx="10" cy="11" r="1" /><circle cx="13" cy="15" r="1" /></>,
    bag: <><path d="M5 7h14l1 14H4Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    heart: <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-4 5 3 10 8 15 5-5 12-10 8-15Z" />,
    leaf: <><path d="M20 3C9 2 2 8 5 15c7 8 16-1 15-12Z" /><path d="m3 21 13-13" /></>,
    settings: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="currentColor" /><circle cx="16" cy="12" r="2" fill="currentColor" /><circle cx="10" cy="18" r="2" fill="currentColor" /></>,
    logout: <><path d="M9 3H4v18h5M13 7l5 5-5 5M8 12h12" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    pin: <><path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    check: <path d="m5 12 4 4 10-10" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    edit: <><path d="m4 16 12-12 4 4-12 12-5 1Z" /><path d="m13 7 4 4" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.grid}</svg>;
}
export function PortalHeader() {
  const { cart, user } = usePortal(); const count = cart.reduce((n,i)=>n+i.quantity,0);
  return <header className="sp-header"><Link className="brand" href="/"><BrandMark /><span>SPADONI<span className="brand-period">.</span></span></Link><nav aria-label="Navegação"><Link href="/#cardapio">Cardápio</Link><Link href="/montar">Monte sua pizza</Link></nav><div><Link className="sp-account-link" href="/conta" aria-label="Minha conta"><Icon name="user" /><span>{user ? user.name.split(" ")[0] : "Minha conta"}</span></Link><Link className="sp-bag-link" href="/sacola" aria-label={`Sacola com ${count} itens`}><Icon name="bag" /><span>{count}</span></Link></div></header>;
}
export function FavoriteButton({ pizzaId }) { const { user, favorite } = usePortal(); const selected = user?.favorites?.includes(pizzaId); return <button className={`sp-favorite${selected ? " is-favorite" : ""}`} type="button" onClick={() => favorite(pizzaId)} aria-pressed={Boolean(selected)} aria-label={selected ? "Remover dos favoritos" : "Adicionar aos favoritos"}><Icon name="heart" fill={selected ? "currentColor" : "none"} size={17} /></button>; }
export function StatusPill({ status }) { return <span className={`sp-status ${status === "Concluído" ? "is-done" : status === "Cancelado" ? "is-cancelled" : ""}`}>{status}</span>; }
export function EmptyState({ icon = "pizza", title, text, href, action }) { return <div className="sp-empty"><span><Icon name={icon} size={32} /></span><h3>{title}</h3><p>{text}</p>{href && <Link className="button button-primary" href={href}>{action || "Explorar cardápio"}<Icon name="arrow" size={17} /></Link>}</div>; }
export function AddressFields({ value, onChange, required = true }) { return <div className="sp-address-fields">{[["street","Rua","street-address"],["number","Número","off"],["neighborhood","Bairro","address-level3"],["city","Cidade","address-level2"],["postalCode","CEP","postal-code"],["complement","Complemento","address-line2"]].map(([key,label,autocomplete])=><label className={`sp-field field-${key}`} key={key}>{label}<input name={key} autoComplete={autocomplete} required={required && !["postalCode","complement"].includes(key)} value={value[key]||""} maxLength={key==="number"?20:key==="postalCode"?9:120} onChange={e=>onChange({...value,[key]:e.target.value})} /></label>)}</div>; }
export function OrderCard({ order }) { return <article className="sp-order-card"><div className="sp-order-card-top"><span><strong>{order.id}</strong><small>{new Date(order.createdAt).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo",dateStyle:"medium",timeStyle:"short"})}</small></span><StatusPill status={order.status} /></div><div className="sp-order-items">{order.items.map((i,index)=><div key={index}><img src={i.image} alt="" width="56" height="56" /><span><strong>{i.quantity}× {i.label}</strong><small>{i.details}</small></span></div>)}</div><div className="sp-order-card-bottom"><strong>{formatPrice(order.total)}</strong><Link href={`/pedido/${order.id}`}>Acompanhar pedido <Icon name="arrow" size={16} /></Link></div></article>; }
export async function logout() { await api("/api/auth/logout","POST"); window.location.assign("/"); }
