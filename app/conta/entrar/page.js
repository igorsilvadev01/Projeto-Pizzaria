import AuthForm from "../../components/auth-form";
export const metadata = { title: "Minha conta | SPADONI" };
export default async function LoginPage({ searchParams }) { const params = await searchParams; return <AuthForm next={typeof params.next === "string" ? params.next : ""} />; }
