import Link from "next/link";
import type { Aviso } from "@/lib/data";
import { AREAS_AVISO, NIVEIS } from "@/lib/data";
import { areasPorRegiao, avisosDaArea, nivelDaArea, nomeNivel } from "@/lib/avisos";

const REGIOES = ["Continente", "Madeira", "Açores"] as const;

function tiposDaArea(avisos: Aviso[], id: string): string[] {
  return [...new Set(avisosDaArea(avisos, id).map((a) => a.tipo.toLowerCase()))];
}

export function WarningsGrid({ avisos }: { avisos: Aviso[] }) {
  const comAviso = REGIOES.flatMap((r) => areasPorRegiao(r).filter((id) => nivelDaArea(avisos, id) !== "green"));
  const semAviso = REGIOES.map((r) => ({ regiao: r, areas: areasPorRegiao(r).filter((id) => nivelDaArea(avisos, id) === "green") }));
  const totalSem = semAviso.reduce((n, r) => n + r.areas.length, 0);

  return (
    <>
      {/* Computador: todas as áreas, por região */}
      <div className="regions">
        {REGIOES.map((r) => (
          <div key={r}>
            <span className="label">{r}</span>
            <div className="areas">
              {areasPorRegiao(r).map((id) => {
                const nivel = nivelDaArea(avisos, id);
                const tipos = tiposDaArea(avisos, id);
                return (
                  <Link key={id} href={`/avisos/${id.toLowerCase()}`} className={`area${nivel !== "green" ? " alert" : ""}`}>
                    <span className={`lvl ${nivel}`} />
                    <span>{AREAS_AVISO[id].nome}</span>
                    {tipos.length > 0 && <span className={`why mono ${nivel}`}>{tipos.length > 1 ? `${tipos[0]} +${tipos.length - 1}` : tipos[0]}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Telemóvel: primeiro as áreas com aviso, o resto recolhido */}
      <div className="regions-compact">
        {comAviso.length > 0 && (
          <ul className="alert-list">
            {comAviso.map((id) => {
              const nivel = nivelDaArea(avisos, id);
              return (
                <li key={id} className={nivel}>
                  <Link className="alert-link" href={`/avisos/${id.toLowerCase()}`}>
                  <span className={`lvl ${nivel}`} />
                  <span className="alert-name">
                    {AREAS_AVISO[id].nome}
                    <span className="label">{AREAS_AVISO[id].regiao} · {nomeNivel(nivel)}</span>
                  </span>
                  <span className={`why mono ${nivel}`}>{tiposDaArea(avisos, id).join(", ")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {totalSem > 0 && (
          <details className="calm">
            <summary>
              <span className="lvl green" />
              Sem aviso em {totalSem} {totalSem === 1 ? "área" : "áreas"}
            </summary>
            {semAviso
              .filter((r) => r.areas.length > 0)
              .map((r) => (
                <div key={r.regiao} className="calm-group">
                  <span className="label">{r.regiao}</span>
                  <div className="chips">
                    {r.areas.map((id) => (
                      <Link key={id} className="chip chip-link" href={`/avisos/${id.toLowerCase()}`}>{AREAS_AVISO[id].nome}</Link>
                    ))}
                  </div>
                </div>
              ))}
          </details>
        )}
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
