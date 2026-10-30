// Ícones do tempo: só linhas, sem cor (herdam a cor do texto), traço de 1,5 numa grelha de 24 px.
// Cada grupo de códigos do IPMA tem um desenho próprio.

type Props = { tipo: number; size?: number; noite?: boolean };

type Grupo =
  | "limpo" | "poucoNublado" | "parcial" | "nuvensAltas" | "nublado" | "convectiva"
  | "chuvisco" | "chuva" | "chuvaForte" | "trovoada" | "trovoadaChuva"
  | "neblina" | "nevoeiro" | "nuvensBaixas" | "neve" | "chuvaNeve" | "granizo" | "geada" | "desconhecido";

function grupo(tipo: number): Grupo {
  switch (tipo) {
    case 1: return "limpo";
    case 2: return "poucoNublado";
    case 3: return "parcial";
    case 5: return "nuvensAltas";
    case 4: case 25: case 27: return "nublado";
    case 24: return "convectiva";
    case 7: case 10: case 13: case 15: return "chuvisco";
    case 6: case 9: case 12: return "chuva";
    case 8: case 11: case 14: return "chuvaForte";
    case 19: return "trovoada";
    case 20: case 23: return "trovoadaChuva";
    case 16: return "neblina";
    case 26: return "nevoeiro";
    case 17: return "nuvensBaixas";
    case 18: case 28: return "neve";
    case 29: case 30: return "chuvaNeve";
    case 21: return "granizo";
    case 22: return "geada";
    default: return "desconhecido";
  }
}

// Lua em quarto crescente (grelha de 24 px)
const LUA = "M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6Z";

// Crescente: círculo (cx, cy, r) menos o círculo (ix, iy, ir); a parte cheia fica do lado oposto ao corte
function crescente(cx: number, cy: number, r: number, ix: number, iy: number, ir: number): string {
  const dx = ix - cx, dy = iy - cy, d = Math.hypot(dx, dy);
  const a = (r * r - ir * ir + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(r * r - a * a, 0));
  const mx = cx + (a * dx) / d, my = cy + (a * dy) / d;
  const p1 = [mx + (h * dy) / d, my - (h * dx) / d];
  const p2 = [mx - (h * dy) / d, my + (h * dx) / d];
  const f = (n: number) => n.toFixed(2);
  return `M${f(p1[0])} ${f(p1[1])}A${r} ${r} 0 1 0 ${f(p2[0])} ${f(p2[1])}A${ir} ${ir} 0 0 1 ${f(p1[0])} ${f(p1[1])}Z`;
}
const LUA_POUCO = crescente(9, 9, 5.2, 12.2, 11.6, 4.4);
const LUA_PARCIAL = crescente(8.2, 7.6, 4.6, 11, 9.8, 3.9);
const LUA_ALTAS = crescente(12, 15, 4.6, 15, 12.6, 3.9);

// Nuvem base (ocupa a parte de baixo da grelha)
const NUVEM = "M7 19a4 4 0 0 1-.4-7.98 6 6 0 0 1 11.3-1A4.5 4.5 0 0 1 17.5 19H7Z";
// Nuvem subida, para deixar espaço à precipitação por baixo
const SOBE = "translate(0 -3.5)";

function Raios({ cx, cy, r1, r2, de = 0, ate = 360 }: { cx: number; cy: number; r1: number; r2: number; de?: number; ate?: number }) {
  const d: string[] = [];
  for (let a = 0; a < 360; a += 45) {
    if (a < de || a > ate) continue;
    const rad = (a * Math.PI) / 180;
    d.push(`M${(cx + r1 * Math.cos(rad)).toFixed(2)} ${(cy + r1 * Math.sin(rad)).toFixed(2)}L${(cx + r2 * Math.cos(rad)).toFixed(2)} ${(cy + r2 * Math.sin(rad)).toFixed(2)}`);
  }
  return <path d={d.join("")} />;
}

// Esconde o que fica por trás de uma nuvem, sem usar preenchimentos de cor
function Mascara({ id, d, transform }: { id: string; d: string; transform?: string }) {
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <rect width="24" height="24" fill="white" />
      <path d={d} transform={transform} fill="black" stroke="black" strokeWidth="3.5" />
    </mask>
  );
}

const pontos = (xs: [number, number][]) => xs.map(([x, y]) => `M${x} ${y}h.01`).join("");
const floco = (x: number, y: number, r = 1.3) =>
  `M${x} ${y - r}v${2 * r}M${x - r * 0.87} ${y - r / 2}l${r * 1.74} ${r}M${x - r * 0.87} ${y + r / 2}l${r * 1.74} ${-r}`;

export function WeatherIcon({ tipo, size = 26, noite = false }: Props) {
  const g = grupo(tipo);
  const comSol = g === "limpo" || g === "poucoNublado" || g === "parcial" || g === "nuvensAltas";
  const lua = noite && comSol;
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const id = `wi-${g}${lua ? "-n" : ""}`;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="wx-icon">
      <g {...s}>
        {lua && g === "limpo" && (
          <>
            <path d={LUA} />
            <path d="M17.5 3.5v2M16.5 4.5h2M20.5 8.5v1.4M19.8 9.2h1.4" strokeWidth={1.2} />
          </>
        )}

        {lua && g === "poucoNublado" && (
          <>
            <defs><Mascara id={id} d="M13 20a2.8 2.8 0 0 1-.3-5.58 4.2 4.2 0 0 1 7.9-.7A3.1 3.1 0 0 1 20.3 20H13Z" /></defs>
            <path d={LUA_POUCO} mask={`url(#${id})`} />
            <path d="M13 20a2.8 2.8 0 0 1-.3-5.58 4.2 4.2 0 0 1 7.9-.7A3.1 3.1 0 0 1 20.3 20H13Z" />
          </>
        )}

        {lua && g === "parcial" && (
          <>
            <defs><Mascara id={id} d={NUVEM} /></defs>
            <path d={LUA_PARCIAL} mask={`url(#${id})`} />
            <path d={NUVEM} />
          </>
        )}

        {lua && g === "nuvensAltas" && (
          <>
            <path d={LUA_ALTAS} />
            <path d="M3.5 7.5c2.5-1.6 5 1.6 7.5 0s5-1.6 7.5 0M7 4c2-1.2 4 1.2 6 0s3.5-1 4.5-.3" />
          </>
        )}

        {!lua && g === "limpo" && (
          <>
            <circle cx="12" cy="12" r="4" />
            <Raios cx={12} cy={12} r1={6.6} r2={9} />
          </>
        )}

        {!lua && g === "poucoNublado" && (
          <>
            <defs><Mascara id={id} d="M13 20a2.8 2.8 0 0 1-.3-5.58 4.2 4.2 0 0 1 7.9-.7A3.1 3.1 0 0 1 20.3 20H13Z" /></defs>
            <g mask={`url(#${id})`}>
              <circle cx="10" cy="10" r="3.8" />
              <Raios cx={10} cy={10} r1={6.2} r2={8.4} />
            </g>
            <path d="M13 20a2.8 2.8 0 0 1-.3-5.58 4.2 4.2 0 0 1 7.9-.7A3.1 3.1 0 0 1 20.3 20H13Z" />
          </>
        )}

        {!lua && g === "parcial" && (
          <>
            <defs><Mascara id={id} d={NUVEM} /></defs>
            <g mask={`url(#${id})`}>
              <circle cx="8.5" cy="8.5" r="3.3" />
              <Raios cx={8.5} cy={8.5} r1={5.5} r2={7.5} de={90} ate={315} />
            </g>
            <path d={NUVEM} />
          </>
        )}

        {!lua && g === "nuvensAltas" && (
          <>
            <circle cx="12" cy="14.5" r="3.6" />
            <Raios cx={12} cy={14.5} r1={6} r2={8} de={0} ate={180} />
            <path d="M3.5 7.5c2.5-1.6 5 1.6 7.5 0s5-1.6 7.5 0M7 4c2-1.2 4 1.2 6 0s3.5-1 4.5-.3" />
          </>
        )}

        {g === "nublado" && (
          <>
            <defs><Mascara id={id} d={NUVEM} transform="translate(-1 3.4) scale(.85)" /></defs>
            <path d={NUVEM} transform="translate(9 0.6) scale(.6)" mask={`url(#${id})`} />
            <path d={NUVEM} transform="translate(-1 3.4) scale(.85)" />
          </>
        )}

        {g === "convectiva" && (
          <>
            <path d="M6.8 20a4 4 0 0 1-.9-7.9 4.2 4.2 0 0 1 2.6-5.3 4.2 4.2 0 0 1 7.6-.6 4 4 0 0 1 1.6 5.6A4.2 4.2 0 0 1 17.4 20H6.8Z" />
          </>
        )}

        {g === "chuvisco" && (
          <>
            <path d={NUVEM} transform={SOBE} />
            <path d={pontos([[8, 19], [12, 19], [16, 19], [10, 22], [14, 22]])} strokeWidth={2} />
          </>
        )}

        {g === "chuva" && (
          <>
            <path d={NUVEM} transform={SOBE} />
            <path d="M8.5 18.5l-1 3M12.5 18.5l-1 3M16.5 18.5l-1 3" />
          </>
        )}

        {g === "chuvaForte" && (
          <>
            <path d={NUVEM} transform={SOBE} />
            <path d="M7.5 18l-1.5 4M11 18l-1.5 4M14.5 18l-1.5 4M18 18l-1.5 4" />
          </>
        )}

        {g === "trovoada" && (
          <>
            <path d={NUVEM} transform={SOBE} />
            <path d="M13 16.5l-2.5 3.5h3l-2.5 3.5" />
          </>
        )}

        {g === "trovoadaChuva" && (
          <>
            <path d={NUVEM} transform={SOBE} />
            <path d="M12.8 16.5l-2.3 3.3h2.8l-2.3 3.4" />
            <path d="M7.5 18l-1 2.8M17.5 18l-1 2.8" />
          </>
        )}

        {g === "neblina" && <path d="M4 8h10M17 8h3M4 12h3M10 12h10M4 16h12M19 16h1" />}

        {g === "nevoeiro" && <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />}

        {g === "nuvensBaixas" && (
          <>
            <path d={NUVEM} transform="translate(0 -5)" />
            <path d="M4 17.5h16M6 21h12" />
          </>
        )}

        {g === "neve" && (
          <>
            <path d={NUVEM} transform={SOBE} />
            <path d={floco(8, 19.5) + floco(12, 21) + floco(16, 19.5)} strokeWidth={1.2} />
          </>
        )}

        {g === "chuvaNeve" && (
          <>
            <path d={NUVEM} transform={SOBE} />
            <path d="M8.5 18.5l-1 3M16.5 18.5l-1 3" />
            <path d={floco(12, 20.2)} strokeWidth={1.2} />
          </>
        )}

        {g === "granizo" && (
          <>
            <path d={NUVEM} transform={SOBE} />
            <circle cx="8" cy="19.5" r="1" />
            <circle cx="12" cy="21.2" r="1" />
            <circle cx="16" cy="19.5" r="1" />
          </>
        )}

        {g === "geada" && (
          <>
            <path d={floco(12, 10, 6)} />
            <path d="M9.6 4.8l2.4 1.4 2.4-1.4M9.6 15.2l2.4-1.4 2.4 1.4" />
            <path d="M4 20h16" />
          </>
        )}

        {g === "desconhecido" && (
          <>
            <circle cx="12" cy="12" r="8" strokeDasharray="2 3" />
            <path d="M9 12h6" />
          </>
        )}
      </g>
    </svg>
  );
}
