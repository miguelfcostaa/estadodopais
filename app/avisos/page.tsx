import type { Metadata } from "next";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { WarningsGrid } from "@/components/WarningsGrid";
import { WarningsLead } from "@/components/WarningsLead";
import { AREAS_AVISO, AVISOS } from "@/lib/data";
import { intervalo, nomeNivel } from "@/lib/avisos";

export const metadata: Metadata = { title: "Avisos" };

export default function AvisosPage() {
  const ativos = AVISOS.filter((a) => a.nivel !== "green");
  return (
    <div className="wrap">
      <PrototypeBanner />
      <div className="page-head">
        <span className="label">Próximos 3 dias</span>
        <h1>Avisos meteorológicos</h1>
        <p>O IPMA emite avisos por distrito no continente e por zona nas ilhas. A cor diz o grau de risco; o tipo diz porquê.</p>
      </div>
      <section className="section" aria-labelledby="h-mapa">
        <div className="sec-head"><h2 id="h-mapa">Agora</h2></div>
        <WarningsLead />
        <WarningsGrid />
      </section>
      <section className="section" aria-labelledby="h-det">
        <div className="sec-head"><h2 id="h-det">Em detalhe</h2><span className="label">{ativos.length} avisos ativos</span></div>
        <div className="warn-list">
          {ativos.map((a, i) => (
            <div key={i} className={`warn-item ${a.nivel}`}>
              <span className="label">
                {AREAS_AVISO[a.idAreaAviso].regiao} · {AREAS_AVISO[a.idAreaAviso].nome} · {a.tipo} · {nomeNivel(a.nivel)}
              </span>
              <p>{a.texto}</p>
              <p className="mono">{intervalo(a)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
