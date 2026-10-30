import Link from "next/link";
import type { Dia } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { INTENSIDADE_VENTO } from "@/lib/ipma";
import { diaSemana, graus, num } from "@/lib/format";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// Dias em colunas. Cada coluna abre a página desse dia.
// A barra de temperatura usa a mesma escala em todos os dias mostrados.
export function DayColumns({ dias, slug, atual }: { dias: Dia[]; slug: string; atual?: string }) {
  const lo = Math.floor(Math.min(...dias.map((d) => d.tMin))) - 1;
  const hi = Math.ceil(Math.max(...dias.map((d) => d.tMax))) + 1;
  const pct = (t: number) => ((t - lo) / (hi - lo)) * 100;
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

  return (
    <ol className="days5">
      {dias.map((d, i) => {
        const nome = cap(i === 0 ? "Hoje" : i === 1 ? "Amanhã" : diaSemana(d.data));
        const curto = cap(i === 0 ? "Hoje" : diaSemana(d.data, true));
        const [, mes, dia] = d.data.split("-").map(Number);
        return (
          <li key={d.data} className={`day${(atual ? atual === d.data : i === 0) ? " today" : ""}`} aria-current={atual === d.data ? "page" : undefined}>
            <Link className="day-link" href={`/local/${slug}/dia/${d.data}`} aria-label={`${nome}, ${dia} de ${MESES[mes - 1]}: ver detalhes`}>
              <div className="day-head">
                <span className="day-name">
                  <span className="nome-longo">{nome}</span>
                  <span className="nome-curto" aria-hidden="true">{curto}</span>
                </span>
                <span className="day-date">
                  <b className="num">{dia}</b>
                  <span className="mono">{MESES[mes - 1]}</span>
                </span>
              </div>

              <div className="day-wx">
                <WeatherIcon tipo={d.tipoTempo} size={34} />
                <span className="day-desc">{TIPOS_TEMPO[d.tipoTempo]}</span>
              </div>

              <div className="day-temps">
                <span className="tmax num">{graus(d.tMax)}</span>
                <span className="tmin num">{graus(d.tMin)}</span>
              </div>
              <div className="day-range" role="img" aria-label={`Mínima ${num(d.tMin)} graus, máxima ${num(d.tMax)} graus`}>
                <i style={{ left: `${pct(d.tMin)}%`, width: `${pct(d.tMax) - pct(d.tMin)}%` }} />
              </div>

              <dl className="day-meta">
                <div className={d.probChuva >= 20 ? "wet" : undefined}>
                  <dt className="label">Chuva</dt>
                  <dd className="num">{d.probChuva}%</dd>
                </div>
                {d.dirVento && (
                  <div className="day-wind">
                    <dt className="label">Vento</dt>
                    <dd>
                      <svg width="12" height="12" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${((DIRS[d.dirVento] ?? 0) + 180) % 360}deg)` }}>
                        <path d="M0 -6 L0 6 M-3 2.5 L0 6 L3 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      {d.ventoClasse ? INTENSIDADE_VENTO[d.ventoClasse] : ""} {d.dirVento}
                    </dd>
                  </div>
                )}
              </dl>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
