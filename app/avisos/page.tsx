import type { Metadata } from "next";
import { MapaAvisos } from "@/components/MapaAvisos";
import { WarningsGrid } from "@/components/WarningsGrid";
import { AREAS_AVISO } from "@/lib/data";
import { intervalo, nomeNivel } from "@/lib/avisos";
import { getAvisos } from "@/lib/ipma";

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
      <div className="page-head">
        <span className="label">Próximos 3 dias</span>
        <h1>Avisos meteorológicos</h1>
        <p>O IPMA emite avisos por distrito no continente e por zona nas ilhas. A cor diz o grau de risco; o tipo diz porquê.</p>
      </div>
      <section className="section" aria-labelledby="h-mapa">
        <div className="sec-head"><h2 id="h-mapa">No mapa</h2><span className="label">toque numa área para ver os avisos</span></div>
        <MapaAvisos avisos={avisos} />
        <p className="mapa-nota mono">A cor de cada área mostra o aviso mais grave nos próximos 3 dias. Limites: Natural Earth.</p>
      </section>
      <section className="section" aria-labelledby="h-areas">
        <div className="sec-head"><h2 id="h-areas">Por área</h2></div>
        <WarningsGrid avisos={avisos} legenda={false} />
      </section>
      <section className="section" aria-labelledby="h-det">
        <div className="sec-head">
          <h2 id="h-det">Em detalhe</h2>
          <span className="label">{avisos.length === 1 ? "1 aviso ativo" : `${avisos.length} avisos ativos`}</span>
        </div>
        {avisos.length === 0 ? (
          <p className="summary">Não há avisos amarelos, laranja ou vermelhos neste momento.</p>
        ) : (
          <div className="warn-list">
            {avisos.map((a, i) => (
              <div key={i} className={`warn-item ${a.nivel}`}>
                <span className="label">
                  {AREAS_AVISO[a.idAreaAviso]?.regiao} · {AREAS_AVISO[a.idAreaAviso]?.nome ?? a.idAreaAviso} · {a.tipo} · {nomeNivel(a.nivel)}
                </span>
                {a.texto && <p>{a.texto}</p>}
                <p className="mono">{intervalo(a)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
