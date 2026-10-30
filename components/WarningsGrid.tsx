import type { Aviso } from "@/lib/data";
import { AREAS_AVISO, NIVEIS } from "@/lib/data";
import { areasPorRegiao, avisosDaArea, nivelDaArea } from "@/lib/avisos";

const REGIOES = ["Continente", "Madeira", "Açores"] as const;

export function WarningsGrid({ avisos }: { avisos: Aviso[] }) {
  return (
    <>
      <div className="regions">
        {REGIOES.map((r) => (
          <div key={r}>
            <span className="label">{r}</span>
            <div className="areas">
              {areasPorRegiao(r).map((id) => {
                const nivel = nivelDaArea(avisos, id);
                const tipos = [...new Set(avisosDaArea(avisos, id).map((a) => a.tipo.toLowerCase()))];
                return (
                  <div key={id} className={`area${nivel !== "green" ? " alert" : ""}`}>
                    <span className={`lvl ${nivel}`} />
                    <span>{AREAS_AVISO[id].nome}</span>
                    {tipos.length > 0 && <span className={`why mono ${nivel}`}>{tipos.length > 1 ? `${tipos[0]} +${tipos.length - 1}` : tipos[0]}</span>}
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
