import { AREAS_AVISO, NIVEIS } from "@/lib/data";
import { areasPorRegiao, avisosDaArea, nivelDaArea } from "@/lib/avisos";

const REGIOES = ["Continente", "Madeira", "Açores"] as const;

export function WarningsGrid() {
  return (
    <>
      <div className="regions">
        {REGIOES.map((r) => (
          <div key={r}>
            <span className="label">{r}</span>
            <div className="areas">
              {areasPorRegiao(r).map((id) => {
                const nivel = nivelDaArea(id);
                const tipo = avisosDaArea(id)[0]?.tipo;
                return (
                  <div key={id} className={`area${nivel !== "green" ? " alert" : ""}`}>
                    <span className={`lvl ${nivel}`} />
                    <span>{AREAS_AVISO[id].nome}</span>
                    {tipo && <span className={`why mono ${nivel}`}>{tipo.toLowerCase()}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
