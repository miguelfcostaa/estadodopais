import Link from "next/link";
import { LegendaNiveis } from "./LegendaNiveis";
import type { Aviso, NivelAviso } from "@/lib/data";
import { AREAS_AVISO } from "@/lib/data";
import { nivelDaArea } from "@/lib/avisos";
import { PAINEIS } from "@/lib/mapa";
import { AREAS_MAPA, type AreaMapa } from "@/lib/mapa-avisos";

const ORDEM: NivelAviso[] = ["green", "yellow", "orange", "red"];
const pior = (ns: NivelAviso[]) => ns.reduce((m, n) => (ORDEM.indexOf(n) > ORDEM.indexOf(m) ? n : m), "green" as NivelAviso);

// Nível com que se pinta cada forma (a ilha da Madeira junta as três zonas que tem)
function nivelForma(avisos: Aviso[], id: string): NivelAviso {
  return id === "MADEIRA" ? pior(["MCN", "MCS", "MRM"].map((z) => nivelDaArea(avisos, z))) : nivelDaArea(avisos, id);
}

// Parte do painel a mostrar, em unidades do painel (o mapa do mar precisa do mar à esquerda; este não)
const RECORTE: Record<string, [number, number, number, number]> = { continente: [215, 673, 0, 825] }; // x0, x1, y0, y1

// Um ponto em cada área de aviso, na cor do seu nível (na ilha da Madeira, um por cada uma das três zonas)
function PontoZona({ a, avisos, caixa }: { a: AreaMapa; avisos: Aviso[]; caixa: [number, number, number, number] }) {
  const [x0, y0, w, h] = caixa;
  const nivel = nivelDaArea(avisos, a.id);
  const nome = AREAS_AVISO[a.id]?.nome;
  return (
    <Link
      prefetch={false} href={`/avisos/${a.id.toLowerCase()}`}
      className={`av-ponto ${nivel}`}
      style={{ left: `${((a.c[0] - x0) / w) * 100}%`, top: `${((a.c[1] - y0) / h) * 100}%` }}
      title={nome}
      aria-label={nome}
    />
  );
}

// A ilha da Madeira é uma só forma: ao clicar abre a zona com o aviso mais grave (ou a Costa Sul, se não houver)
function zonaMadeira(avisos: Aviso[]): string {
  return ["MCS", "MRM", "MCN"].reduce((m, z) => (ORDEM.indexOf(nivelDaArea(avisos, z)) > ORDEM.indexOf(nivelDaArea(avisos, m)) ? z : m), "MCS");
}

function Mapa({ nome, titulo, avisos }: { nome: "continente" | "acores" | "madeira"; titulo?: string; avisos: Aviso[] }) {
  const painel = PAINEIS[nome];
  const areas = AREAS_MAPA.filter((a) => a.painel === nome);
  const [x0, x1, y0, y1] = RECORTE[nome] ?? [0, painel.w, 0, painel.h];
  const w = x1 - x0, h = y1 - y0;
  return (
    <figure className={`mapa-painel mapa-${nome}`}>
      {titulo && <figcaption className="label">{titulo}</figcaption>}
      <div className="mapa-box" style={{ aspectRatio: `${w} / ${h}` }}>
        <svg className="mapa-terra" viewBox={`${x0} ${y0} ${w} ${h}`} role="img" aria-label={`Mapa de avisos: ${titulo ?? "Portugal continental"}`}>
          {painel.espanha && <path d={painel.espanha} className="mapa-es" />}
          {areas
            .filter((a) => a.d)
            .map((a) => {
              if (a.id === "DESERTAS") return <path key={a.id} d={a.d} className="av-forma neutra" />;
              const nivel = nivelForma(avisos, a.id);
              const destino = (a.id === "MADEIRA" ? zonaMadeira(avisos) : a.id).toLowerCase();
              return (
                <Link key={a.id} prefetch={false} href={`/avisos/${destino}`} className="av-area">
                  <title>{a.id === "MADEIRA" ? "Madeira" : AREAS_AVISO[a.id]?.nome}</title>
                  <path d={a.d} className={`av-forma ${nivel}`} />
                </Link>
              );
            })}
        </svg>
        {areas
          .filter((a) => a.id !== "MADEIRA" && a.id !== "DESERTAS")
          .map((a) => (
            <PontoZona key={a.id} a={a} avisos={avisos} caixa={[x0, y0, w, h]} />
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
      <LegendaNiveis id="legenda-mapa" />
    </>
  );
}
