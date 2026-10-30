import type { ZonaMar } from "@/lib/ipma";
import { num } from "@/lib/format";
import { PAINEIS, projetar, type Painel } from "@/lib/mapa";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Onde fica a etiqueta de cada zona, em relação ao ponto (para não tapar terra nem outras etiquetas)
type Lado = "esquerda" | "direita" | "baixo" | "baixoEsq" | "baixoDir" | "cima";
const LADO: Record<number, Lado> = {
  1160926: "esquerda", // Viana do Castelo
  1130826: "esquerda", // Porto
  1060526: "esquerda", // Figueira da Foz
  1111026: "esquerda", // Lisboa
  1151326: "esquerda", // Sines
  1081526: "esquerda", // Sagres
  1080526: "baixo", // Faro
  3480226: "baixoDir", // Flores
  3470126: "baixoEsq", // Horta
  3420226: "baixoEsq", // Ponta Delgada
  2310326: "baixo", // Funchal
  2320126: "esquerda", // Porto Santo
};

// Ponto da zona com a etiqueta ao lado; tudo em elementos de página, para ter sempre o mesmo tamanho
function Pino({ z, painel }: { z: ZonaMar; painel: Painel }) {
  const [x, y] = projetar(painel, z.lat, z.lon);
  const lado = LADO[z.id] ?? "esquerda";
  const agua = z.aguaMin !== null && z.aguaMax !== null ? (z.aguaMin + z.aguaMax) / 2 : null;
  return (
    <div className={`mapa-pino ${lado}`} style={{ left: `${(x / painel.w) * 100}%`, top: `${(y / painel.h) * 100}%` }}>
      <span className="mapa-ponto" />
      <div className="mapa-label">
        <b>{z.zona}</b>
        <span className="num">
          <svg width="10" height="10" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${((DIRS[z.dir] ?? 0) + 180) % 360}deg)` }}>
            <path d="M0 -6 L0 6 M-3.5 2.5 L0 6 L3.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {num(z.ondaMin)}–{num(z.ondaMax)} m
          {agua !== null && <em> · {num(Math.round(agua * 10) / 10)}°</em>}
        </span>
      </div>
    </div>
  );
}

function Mapa({ nome, painel, zonas, titulo }: { nome: string; painel: Painel; zonas: ZonaMar[]; titulo?: string }) {
  return (
    <figure className={`mapa-painel mapa-${nome}`}>
      {titulo && <figcaption className="label">{titulo}</figcaption>}
      <div className="mapa-box" style={{ aspectRatio: `${painel.w} / ${painel.h}` }}>
        <svg className="mapa-terra" viewBox={`0 0 ${painel.w} ${painel.h}`} role="img" aria-label={`Mapa de ${titulo ?? "Portugal continental"} com o estado do mar`}>
          {painel.espanha && <path d={painel.espanha} className="mapa-es" />}
          <path d={painel.portugal} className="mapa-pt" />
        </svg>
        {zonas.map((z) => (
          <Pino key={z.id} z={z} painel={painel} />
        ))}
      </div>
    </figure>
  );
}

export function MapaMar({ zonas }: { zonas: ZonaMar[] }) {
  return (
    <div className="mapa">
      <Mapa nome="continente" painel={PAINEIS.continente} zonas={zonas.filter((z) => z.regiao === "Continente")} />
      <div className="mapa-ilhas">
        <Mapa nome="acores" titulo="Açores" painel={PAINEIS.acores} zonas={zonas.filter((z) => z.regiao === "Açores")} />
        <Mapa nome="madeira" titulo="Madeira" painel={PAINEIS.madeira} zonas={zonas.filter((z) => z.regiao === "Madeira")} />
      </div>
    </div>
  );
}
