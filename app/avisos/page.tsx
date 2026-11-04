import type { Metadata } from "next";
import Link from "next/link";
import { MapaAvisos } from "@/components/MapaAvisos";
import { WarningsGrid } from "@/components/WarningsGrid";
import { AREAS_AVISO } from "@/lib/data";
import { intervalo, nomeNivel } from "@/lib/avisos";
import { getAvisos } from "@/lib/ipma";
import type { Aviso, NivelAviso } from "@/lib/data";

const GRAVIDADE: NivelAviso[] = ["green", "yellow", "orange", "red"];
const ORDEM_AREAS = Object.keys(AREAS_AVISO);
const REGIOES_ORDEM = ["Continente", "Madeira", "Açores"] as const;

const nAvisos = (n: number) => (n === 1 ? "1 aviso" : `${n} avisos`);
const piorNivel = (l: Aviso[]) => GRAVIDADE[Math.max(...l.map((a) => GRAVIDADE.indexOf(a.nivel)))];

// Avisos agrupados por área: primeiro as áreas com o aviso mais grave; dentro de cada uma, por ordem de início
function porArea(avisos: Aviso[]) {
  const grupos = new Map<string, Aviso[]>();
  for (const a of avisos) grupos.set(a.idAreaAviso, [...(grupos.get(a.idAreaAviso) ?? []), a]);
  return [...grupos.entries()]
    .map(([id, lista]) => ({ id, lista: [...lista].sort((x, y) => x.inicio.localeCompare(y.inicio)) }))
    .sort((x, y) => GRAVIDADE.indexOf(piorNivel(y.lista)) - GRAVIDADE.indexOf(piorNivel(x.lista)) || ORDEM_AREAS.indexOf(x.id) - ORDEM_AREAS.indexOf(y.id));
}

export const metadata: Metadata = {
  title: "Avisos meteorológicos em Portugal",
  description: "Mapa e lista dos avisos meteorológicos do IPMA para o continente, a Madeira e os Açores nos próximos 3 dias.",
  alternates: { canonical: "/avisos" },
};
export const revalidate = 300; // 5 minutos (avisos)

export default async function AvisosPage() {
  const avisos = await getAvisos();
  return (
    <div className="wrap">
      <div className="page-head ajustado">
        <span className="label">Próximos 3 dias</span>
        <h1>Avisos meteorológicos</h1>
        <p>O IPMA emite avisos por distrito no continente e por zona nas ilhas. A cor diz o grau de risco; o tipo diz porquê.</p>
      </div>
      <section className="section" aria-labelledby="h-mapa">
        <div className="sec-head"><h2 id="h-mapa">No mapa</h2><span className="label">toque numa área para ver os avisos</span></div>
        <MapaAvisos avisos={avisos} />
      </section>
      <section className="section" aria-labelledby="h-areas">
        <div className="sec-head"><h2 id="h-areas">Por área</h2></div>
        <WarningsGrid avisos={avisos} legenda={false} />
      </section>
      <section className="section" aria-labelledby="h-det">
        <div className="sec-head">
          <h2 id="h-det">Em detalhe</h2>
          <span className="label">{nAvisos(avisos.length)} {avisos.length === 1 ? "ativo" : "ativos"}</span>
        </div>
        {avisos.length === 0 ? (
          <p className="summary">Não há avisos amarelos, laranja ou vermelhos neste momento.</p>
        ) : (
          <div className="warn-regioes">
            {REGIOES_ORDEM.map((regiao) => {
              const grupos = porArea(avisos.filter((a) => AREAS_AVISO[a.idAreaAviso]?.regiao === regiao));
              if (grupos.length === 0) return null;
              return (
                <details key={regiao} className="calm warn-regiao">
                  <summary>
                    <span className={`lvl ${piorNivel(grupos.flatMap((g) => g.lista))}`} />
                    <h3 className="calm-text">{regiao}</h3>
                    <span className="label">{nAvisos(grupos.reduce((n, g) => n + g.lista.length, 0))}</span>
                    <span className="calm-more mono">
                      <span className="calm-ver">ver</span>
                      <span className="calm-fechar">fechar</span>
                    </span>
                  </summary>
                  <div className="warn-grupos">
                    {grupos.map(({ id, lista }) => (
                      <article key={id} className="warn-grupo">
                        <h4><Link prefetch={false} href={`/avisos/${id.toLowerCase()}`}>{AREAS_AVISO[id]?.nome ?? id}</Link></h4>
                        <div className="warn-list">
                          {lista.map((a, i) => (
                            <div key={i} className={`warn-item ${a.nivel}`}>
                              <span className="label">{a.tipo} · {nomeNivel(a.nivel)}</span>
                              {a.texto && <p>{a.texto}</p>}
                              <p className="mono">{intervalo(a)}</p>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
