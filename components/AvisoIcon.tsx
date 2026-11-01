// Ícones dos tipos de aviso do IPMA: só traço, na cor do texto, numa grelha de 24 px (como os ícones do tempo)

const NUVEM = "M7 19a4 4 0 0 1-.4-7.98 6 6 0 0 1 11.3-1A4.5 4.5 0 0 1 17.5 19H7Z";
const TERMOMETRO = "M8 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z";

function floco(): string {
  const d: string[] = [];
  for (const a of [90, 30, 150]) {
    const r = (a * Math.PI) / 180, dx = 8.5 * Math.cos(r), dy = 8.5 * Math.sin(r);
    d.push(`M${(12 - dx).toFixed(2)} ${(12 - dy).toFixed(2)}L${(12 + dx).toFixed(2)} ${(12 + dy).toFixed(2)}`);
  }
  // pequenas pontas em V nas extremidades de cima e de baixo
  d.push("M9.8 4.8L12 6.4l2.2-1.6M9.8 19.2L12 17.6l2.2 1.6");
  return d.join("");
}

export function AvisoIcon({ tipo, size = 20 }: { tipo: string; size?: number }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="aviso-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g {...s}>
        {tipo === "Precipitação" && (
          <>
            <path d={NUVEM} transform="translate(0 -3.5)" />
            <path d="M8.5 18.5l-1 3M12.5 18.5l-1 3M16.5 18.5l-1 3" />
          </>
        )}
        {tipo === "Vento" && (
          <>
            <path d="M3 8h10.5a2.5 2.5 0 1 0-2.5-2.5" />
            <path d="M3 12h15a3 3 0 1 1-3 3" />
            <path d="M3 16h7" />
          </>
        )}
        {tipo === "Trovoada" && (
          <>
            <path d={NUVEM} transform="translate(0 -3.5)" />
            <path d="M13 16.5l-2.5 3.5h3l-2.5 3.5" />
          </>
        )}
        {tipo === "Nevoeiro" && <path d="M4 7h10M17 7h3M4 11h3M10 11h10M4 15h12M19 15h1M7 19h10" />}
        {tipo === "Agitação Marítima" && (
          <>
            <path d="M3 10c1.5-4 6-6 9.5-4.5-2.2.8-2.8 3.2-1.2 4.5" />
            <path d="M2.5 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 4 2" />
            <path d="M2.5 18.5c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 4 2" />
          </>
        )}
        {tipo === "Neve" && <path d={floco()} />}
        {tipo === "Tempo Quente" && (
          <>
            <path d={TERMOMETRO} />
            <path d="M10 9v6.5" />
            <path d="M18 10V4M15.8 6.2L18 4l2.2 2.2" />
          </>
        )}
        {tipo === "Tempo Frio" && (
          <>
            <path d={TERMOMETRO} />
            <path d="M10 13v2.5" />
            <path d="M18 4v6M15.8 7.8L18 10l2.2-2.2" />
          </>
        )}
      </g>
    </svg>
  );
}
