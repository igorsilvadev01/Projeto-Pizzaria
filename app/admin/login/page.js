import AuthForm from "../../components/auth-form";
import { needsAdminSetup } from "../../../lib/server-auth";
export const metadata = { title: "Acesso da equipe | SPADONI" };
export default function AdminLoginPage() { return <AuthForm admin canSetup={needsAdminSetup()} />; }
