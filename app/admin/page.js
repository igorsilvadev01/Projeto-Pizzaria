import { redirect } from "next/navigation";
import AdminWorkspace from "./workspace";
import { requireUser } from "../../lib/server-auth";
import { getCatalog } from "../../lib/database";
import { listOrders } from "../../lib/orders";
export const runtime = "nodejs";
export const metadata = { title: "Central da casa | SPADONI" };
export default async function AdminPage() {
  let user; try { user = await requireUser(true); } catch (e) { redirect(e.status === 403 ? "/conta" : "/admin/login"); }
  return <AdminWorkspace initialCatalog={getCatalog()} initialOrders={listOrders(null,true)} adminName={user.name} />;
}
