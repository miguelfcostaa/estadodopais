import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// O mesmo desenho do ícone do site (app/icon.svg)
const ICONE = `data:image/svg+xml;base64,${readFileSync(join(process.cwd(), "app/icon.svg")).toString("base64")}`;

// Imagem que aparece ao partilhar o site (WhatsApp, redes sociais): nome e o que o site mostra à esquerda, logótipo grande à direita
export const alt = "estadodopais.pt: tempo, avisos e mar em Portugal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagem() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px 0 96px", background: "#0b1520", color: "#e3edf6" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 600, letterSpacing: -2 }}>
            <span>estadodopais</span>
            <span style={{ color: "#58b0ff", marginLeft: -12 }}>.pt</span>
          </div>
          <div style={{ fontSize: 38, color: "#8aa0b5", marginTop: 20, lineHeight: 1.3 }}>Tempo, avisos, mar e risco de incêndio em Portugal</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ICONE} width={420} height={420} alt="" />
      </div>
    ),
    size,
  );
}
