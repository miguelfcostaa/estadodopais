import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Krub } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { NavHistory } from "@/components/NavHistory";
import { SiteHeader } from "@/components/SiteHeader";
import { horaMinutoAtual } from "@/lib/format";
import { SITE_DESCRICAO, SITE_NOME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Títulos em Inter e texto em Krub; números e etiquetas em IBM Plex Mono
const display = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-display" });
const sans = Krub({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NOME} · Tempo, avisos e mar em Portugal`, template: `%s · ${SITE_NOME}` },
  description: SITE_DESCRICAO,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pt_PT", siteName: SITE_NOME, url: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b1520",
  viewportFit: "cover",
};

// Aplica o tema guardado antes de pintar, para não piscar.
const temaInicial = `try{var t=localStorage.getItem("tema");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

// Dados estruturados do site (só o que é verdade: nome, endereço, língua e descrição)
const dadosSite = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NOME,
  url: SITE_URL,
  inLanguage: "pt-PT",
  description: SITE_DESCRICAO,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInicial }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: dadosSite }} />
      </head>
      <body>
        <NavHistory />
        <SiteHeader atualizado={horaMinutoAtual()} />
        <main className="site-main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
