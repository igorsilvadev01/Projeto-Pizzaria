import { redirect, notFound } from "next/navigation";
import { currentUser } from "../../../lib/server-auth";
import { findOrder, whatsappLink } from "../../../lib/orders";
import { getCatalog } from "../../../lib/database";
import OrderTracker from "./order-tracker";
export const metadata = { title: "Seu pedido | SPADONI" };
export default async function OrderPage({ params }) {const {id}=await params;const user=await currentUser();if(!user)redirect(`/conta/entrar?next=/pedido/${id}`);let order;try{order=findOrder(id,user)}catch{notFound()}return <OrderTracker initialOrder={order} whatsappUrl={whatsappLink(order,getCatalog())} />;}
