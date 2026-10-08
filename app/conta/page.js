import { redirect } from "next/navigation";
import { currentUser } from "../../lib/server-auth";
import { listOrders } from "../../lib/orders";
import CustomerDashboard from "./dashboard";
export const metadata = { title: "Seu cantinho | SPADONI" };
export default async function AccountPage() { const user = await currentUser(); if (!user) redirect("/conta/entrar"); return <CustomerDashboard initialOrders={listOrders(user.id)} />; }
