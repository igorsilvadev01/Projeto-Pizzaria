"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePortal, api } from "./portal-provider";
import { PortalHeader, Icon } from "./portal-ui";
import BrandMark from "./brand-mark";

export default function AuthForm({ admin = false, setup = false, next = "", canSetup = false }) {
  const [register, setRegister] = useState(false);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [setupToken, setSetupToken] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const { setUser } = usePortal(); const router = useRouter();
  useEffect(() => { if (setup) { const hash = new URLSearchParams(window.location.hash.slice(1)); if (hash.has("chave")) { setSetupToken(hash.get("chave")); window.history.replaceState(null,"",window.location.pathname); } } }, [setup]);
  async function submit(event) {
    event.preventDefault(); if (busy) return; setBusy(true); setError("");
    try {
      const result = await api(`/api/auth/${setup ? "setup" : register ? "register" : "login"}`, "POST", { name, email, password, admin, setupToken });
      setUser(result.user);
      const safeNext = next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") && !next.startsWith("/api/") ? next : null;
      router.replace(admin || setup ? "/admin" : safeNext || "/conta"); router.refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <div className="sp-auth-page"><PortalHeader /><main className="sp-auth-layout"><section className="sp-auth-story"><span className="eyebrow"><span /> {admin || setup ? "CENTRAL DA CASA" : "SEU CANTINHO NA SPADONI"}</span><h1>{admin || setup ? <>Boas receitas.<br /><em>Uma casa bem cuidada.</em></> : <>A gente guarda<br /><em>seu lugar à mesa.</em></>}</h1><p>{admin || setup ? "Cardápio, ingredientes e pedidos. Tudo que a equipe precisa, em um só lugar." : "Seus sabores favoritos, suas pizzas do seu jeito e o próximo bom encontro."}</p><div className="sp-auth-pizza"><img src="/images/pizzas/margherita.webp" alt="Pizza Margherita da SPADONI" width="500" height="500" /><div><BrandMark /><span>FEITA COM CARINHO</span></div></div><span className="sp-auth-caption">SPADONI · PIZZA DE BAIRRO</span></section><section className="sp-auth-form-wrap"><div className="sp-auth-form-card"><span className="sp-line-icon"><Icon name={admin || setup ? "settings" : "user"} size={25} /></span><p className="eyebrow">{setup ? "PRIMEIRO ACESSO" : register ? "BEM-VINDO À CASA" : admin ? "ACESSO DA EQUIPE" : "BOM TER VOCÊ AQUI"}</p><h2>{setup ? "Prepare a casa." : register ? "Sua mesa está pronta." : "A casa é sua."}</h2><p className="sp-form-intro">{setup ? "Crie o acesso do responsável pela SPADONI." : register ? "Crie sua conta para guardar seus favoritos e acompanhar seus pedidos." : "Entre para continuar de onde parou."}</p><form onSubmit={submit}>
          {(register || setup) && <label className="sp-field">Seu nome<input name="name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required maxLength={80} placeholder="Como podemos chamar você?" /></label>}
          <label className="sp-field">E-mail<input name="email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254} placeholder="voce@exemplo.com" /></label>
          <label className="sp-field">Senha<div className="sp-password-field"><input name="password" aria-label="Senha" type={showPassword ? "text" : "password"} autoComplete={register || setup ? "new-password" : "current-password"} value={password} onChange={e=>setPassword(e.target.value)} required minLength={register || setup ? 15 : undefined} maxLength={128} placeholder={register || setup ? "Uma frase com pelo menos 15 caracteres" : "Sua senha"} /><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? "Ocultar" : "Mostrar"}</button></div></label>
          {setup && <label className="sp-field">Chave de configuração<input name="setupToken" type="password" autoComplete="off" required value={setupToken} onChange={e=>setSetupToken(e.target.value)} /><small>Use a chave entregue ao responsável pelo projeto.</small></label>}
          {(register || setup) && <p className="sp-form-help">Uma frase longa também funciona como senha. Use pelo menos 15 caracteres.</p>}
          {error && <p className="sp-form-error" role="alert">{error}</p>}
          <button className="button button-primary sp-full-button" type="submit" disabled={busy}>{busy ? "Só um instante…" : setup ? "Criar acesso administrativo" : register ? "Criar minha conta" : "Entrar"}<Icon name="arrow" size={18} /></button>
        </form>{!admin && !setup && <p className="sp-switch-auth">{register ? "Já faz parte da casa?" : "Ainda não tem conta?"} <button type="button" onClick={()=>{setRegister(v=>!v);setError("")}}>{register ? "Entrar" : "Criar minha conta"}</button></p>}{admin && canSetup && <Link className="sp-setup-link" href="/admin/configurar">Configurar o primeiro administrador <Icon name="arrow" size={15} /></Link>}<div className="sp-auth-footer"><Link href="/">← Voltar ao cardápio</Link>{!admin && !setup && <Link href="/admin/login">Acesso da equipe ↗</Link>}</div></div></section></main></div>;
}
