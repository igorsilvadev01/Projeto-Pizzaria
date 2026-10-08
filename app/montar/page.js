import PizzaBuilder from "./pizza-builder";
export const metadata = { title: "Monte sua pizza | SPADONI", description: "Combine sabores, escolha a borda e dê o seu toque à pizza da SPADONI." };
export default async function BuilderPage({ searchParams }) { const params=await searchParams; return <PizzaBuilder initialFlavor={typeof params.sabor === "string" ? params.sabor : ""} />; }
