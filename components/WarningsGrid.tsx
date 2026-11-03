import Link from "next/link";
import { LegendaNiveis } from "./LegendaNiveis";
import type { Aviso, NivelAviso } from "@/lib/data";
import { AREAS_AVISO } from "@/lib/data";
import { areasPorRegiao, avisosDaArea, nivelDaArea, nomeNivel } from "@/lib/avisos";

const REGIOES = ["Continente", "Madeira", "Açores"] as const;
// Ordem dos grupos no telemóvel: do mais grave para o menos grave
const GRUPOS: NivelAviso[] = ["red", "orange", "yellow"];

function tiposDaArea(avisos: Aviso[], id: string): string[] {
  return [...new Set(avisosDaArea(avisos, id).map((a) => a.tipo.toLowerCase()))];
}

export function WarningsGrid({ avisos, legenda = true }: { avisos: Aviso[]; legenda?: boolean }) {
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

      {/* Telemóvel: as áreas agrupadas por cor do aviso, cada grupo numa lista que abre e fecha.
          Cada grupo só aparece quando há avisos dessa cor; o vermelho abre logo, por ser o mais grave. */}
      <div className="regions-compact">
        {GRUPOS.map((nivel) => {
          const areas = comAviso.filter((id) => nivelDaArea(avisos, id) === nivel);
          if (areas.length === 0) return null;
          const nome = nomeNivel(nivel);
          return (
            <details key={nivel} className={`calm grupo-aviso ${nivel}`} open={nivel === "red"}>
              <summary>
                <span className={`lvl ${nivel}`} />
                <span className="calm-text">
                  {nome.charAt(0).toUpperCase() + nome.slice(1)} em {areas.length} {areas.length === 1 ? "área" : "áreas"}
                </span>
                <span className="calm-more mono">
                  <span className="calm-ver">ver</span>
                  <span className="calm-fechar">fechar</span>
                </span>
              </summary>
              <ul className="alert-list">
                {areas.map((id) => (
                  <li key={id} className={nivel}>
                    <Link className="alert-link" href={`/avisos/${id.toLowerCase()}`}>
                      <span className="alert-name">
                        {AREAS_AVISO[id].nome}
                        <span className="label">{AREAS_AVISO[id].regiao}</span>
                      </span>
                      <span className={`why mono ${nivel}`}>{tiposDaArea(avisos, id).join(", ")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
        {totalSem > 0 && (
          <details className="calm">
            <summary>
              <span className="lvl green" />
              <span className="calm-text">Sem aviso em {totalSem} {totalSem === 1 ? "área" : "áreas"}</span>
              <span className="calm-more mono">
                <span className="calm-ver">ver todas</span>
                <span className="calm-fechar">fechar</span>
              </span>
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

      {legenda && (
      <LegendaNiveis id="legenda-avisos" />
      )}
    </>
  );
}
