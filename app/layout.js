import "../styles.css";
import "./portal.css";
import PortalProvider from "./components/portal-provider";
import { getCatalog } from "../lib/database";
import { currentUser, publicUser } from "../lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "SPADONI — pizza de bairro",
  description: "Pizza de fermentação lenta, ingredientes de verdade e feita para compartilhar.",
};

export const viewport = {
  themeColor: "#241712",
};

export default async function RootLayout({ children }) {
  const catalog = getCatalog();
  const user = publicUser(await currentUser());
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body><PortalProvider initialCatalog={catalog} initialUser={user}>{children}</PortalProvider></body>
    </html>
  );
}
