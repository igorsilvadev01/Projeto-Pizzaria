import Bag from "./shopping-bag";
export const metadata = { title: "Sua sacola | SPADONI" };
export default function BagPage() { return <Bag mercadoPagoConfigured={Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN)} />; }
