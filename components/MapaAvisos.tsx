import Link from "next/link";
import type { Aviso, NivelAviso } from "@/lib/data";
import { AREAS_AVISO, NIVEIS } from "@/lib/data";
import { avisosDaArea, nivelDaArea } from "@/lib/avisos";
import { PAINEIS, type Painel } from "@/lib/mapa";
import { AREAS_MAPA, type AreaMapa } from "@/lib/mapa-avisos";

const ORDEM: NivelAviso[] = ["green", "yellow", "orange", "red"];
const pior = (ns: NivelAviso[]) => ns.reduce((m, n) => (ORDEM.indexOf(n) > ORDEM.indexOf(m) ? n : m), "green" as NivelAviso);

function tipos(avisos: Aviso[], id: string) {
  return [...new Set(avisosDaArea(avisos, id).map((a) => a.tipo.toLowerCase()))];
}

// Nível com que se pinta cada forma (a ilha da Madeira junta as três zonas que tem)
function nivelForma(avisos: Aviso[], id: string): NivelAviso {
  return id === "MADEIRA" ? pior(["MCN", "MCS", "MRM"].map((z) => nivelDaArea(avisos, z))) : nivelDaArea(avisos, id);
}

// Parte do painel a mostrar, em unidades do painel (o mapa do mar precisa do mar à esquerda; este não)
const RECORTE: Record<string, [number, number]> = { continente: [215, 673] };

function Etiqueta({ a, painel, avisos, x0, w }: { a: AreaMapa; painel: Painel; avisos: Aviso[]; x0: number; w: number }) {
  if (a.id === "MADEIRA" || a.id === "DESERTAS") return null;
  const nivel = nivelDaArea(avisos, a.id);
  const t = tipos(avisos, a.id);
  // nos Açores e no Porto Santo o nome fica por baixo das ilhas
  const abaixo = a.painel === "acores" || a.id === "MPS";
  const margem = (a.c[0] - x0) / w < 0.12 ? " margem" : "";
  return (
    <Link
      href={`/avisos/${a.id.toLowerCase()}`}
      className={`av-label ${nivel}${nivel !== "green" ? " ativo" : ""}${abaixo ? " abaixo" : ""}${margem}`}
      style={{ left: `${((a.c[0] - x0) / w) * 100}%`, top: `${(a.c[1] / painel.h) * 100}%` }}
    >
      <b>{AREAS_AVISO[a.id]?.nome ?? a.id}</b>
      {t.length > 0 && <span className="mono">{t.join(", ")}</span>}
    </Link>
  );
}

function Mapa({ nome, titulo, avisos }: { nome: "continente" | "acores" | "madeira"; titulo?: string; avisos: Aviso[] }) {
  const painel = PAINEIS[nome];
  const areas = AREAS_MAPA.filter((a) => a.painel === nome);
  const [x0, x1] = RECORTE[nome] ?? [0, painel.w];
  const w = x1 - x0;
  return (
    <figure className={`mapa-painel mapa-${nome}`}>
      {titulo && <figcaption className="label">{titulo}</figcaption>}
      <div className="mapa-box" style={{ aspectRatio: `${w} / ${painel.h}` }}>
        <svg className="mapa-terra" viewBox={`${x0} 0 ${w} ${painel.h}`} role="img" aria-label={`Mapa de avisos: ${titulo ?? "Portugal continental"}`}>
          {painel.espanha && <path d={painel.espanha} className="mapa-es" />}
          {areas
            .filter((a) => a.d)
            .map((a) => {
              if (a.id === "DESERTAS") return <path key={a.id} d={a.d} className="av-forma neutra" />;
              const nivel = nivelForma(avisos, a.id);
              const destino = a.id === "MADEIRA" ? "mcs" : a.id.toLowerCase();
              return (
                <Link key={a.id} href={`/avisos/${destino}`} className="av-area">
                  <title>{a.id === "MADEIRA" ? "Madeira" : AREAS_AVISO[a.id]?.nome}</title>
                  <path d={a.d} className={`av-forma ${nivel}`} />
                </Link>
              );
            })}
        </svg>
        {areas.map((a) => (
          <Etiqueta key={a.id} a={a} painel={painel} avisos={avisos} x0={x0} w={w} />
        ))}
      </div>
    </figure>
  );
}

export function MapaAvisos({ avisos }: { avisos: Aviso[] }) {
  return (
    <>
      <div className="mapa mapa-avisos">
        <Mapa nome="continente" avisos={avisos} />
        <div className="mapa-ilhas">
          <Mapa nome="acores" titulo="Açores" avisos={avisos} />
          <Mapa nome="madeira" titulo="Madeira" avisos={avisos} />
        </div>
      </div>
      <div className="scale mono">
        {NIVEIS.map((n) => (
          <span key={n.id}>
            <i className={`lvl ${n.id}`} />
            {n.nome.toLowerCase()} · {n.sentido}
          </span>
        ))}
      </div>
    </>
  );
}
