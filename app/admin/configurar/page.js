import { redirect } from "next/navigation";
import AuthForm from "../../components/auth-form";
import { needsAdminSetup } from "../../../lib/server-auth";
export const metadata = { title: "Preparar a casa | SPADONI" };
export default function AdminSetupPage() { if (!needsAdminSetup()) redirect("/admin/login"); return <AuthForm setup />; }
