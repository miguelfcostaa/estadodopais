import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Parkinsans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { NavHistory } from "@/components/NavHistory";
import { SiteHeader } from "@/components/SiteHeader";
import { horaMinutoAtual } from "@/lib/format";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-display" });
const sans = Parkinsans({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "previsao.pt", template: "%s · previsao.pt" },
  description: "Previsão do tempo, avisos e estado do mar em Portugal, explicados de forma simples. Dados do IPMA.",
};

export const viewport: Viewport = {
  themeColor: "#0b1520",
  viewportFit: "cover",
};

// Aplica o tema guardado antes de pintar, para não piscar.
const temaInicial = `try{var t=localStorage.getItem("tema");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInicial }} />
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
