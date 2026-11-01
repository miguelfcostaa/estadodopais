import { ImageResponse } from "next/og";

// Imagem que aparece ao partilhar o site (WhatsApp, redes sociais): logótipo, nome e o que o site mostra
export const alt = "estadodopais.pt: tempo, avisos e mar em Portugal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagem() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px", background: "#0b1520", color: "#e3edf6" }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="15" fill="#13202e" />
          <circle cx="39" cy="25" r="12" fill="#58b0ff" />
          <path d="M15 47h28a8 8 0 0 0 .6-16 11 11 0 0 0-21 3.4A6.4 6.4 0 0 0 15 47Z" fill="#e3edf6" stroke="#13202e" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 600, marginTop: 40, letterSpacing: -2 }}>
          <span>estadodopais</span>
          <span style={{ color: "#58b0ff", marginLeft: -12 }}>.pt</span>
        </div>
        <div style={{ fontSize: 38, color: "#8aa0b5", marginTop: 16 }}>Tempo, avisos, mar e risco de incêndio em Portugal</div>
      </div>
    ),
    size,
  );
}
