import type { Dia } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { INTENSIDADE_VENTO } from "@/lib/ipma";
import { dataCurta, diaSemana, graus, num } from "@/lib/format";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Hoje e os 4 dias seguintes, em colunas. A barra vertical usa a mesma escala nos 5 dias.
export function DayColumns({ dias }: { dias: Dia[] }) {
  const lo = Math.floor(Math.min(...dias.map((d) => d.tMin))) - 1;
  const hi = Math.ceil(Math.max(...dias.map((d) => d.tMax))) + 1;
  const pct = (t: number) => ((t - lo) / (hi - lo)) * 100;

  return (
    <ol className="days5">
      {dias.map((d, i) => {
        const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
        const nome = cap(i === 0 ? "Hoje" : i === 1 ? "Amanhã" : diaSemana(d.data));
        const curto = cap(i === 0 ? "Hoje" : diaSemana(d.data, true));
        return (
          <li key={d.data} className={`day${i === 0 ? " today" : ""}`}>
            <div className="day-head">
              <span className="day-name">
                <span className="nome-longo">{nome}</span>
                <span className="nome-curto" aria-hidden="true">{curto}</span>
              </span>
              <span className="mono num">{dataCurta(d.data)}</span>
            </div>
            <div className="day-wx">
              <WeatherIcon tipo={d.tipoTempo} size={40} />
              <span className="day-desc">{TIPOS_TEMPO[d.tipoTempo]}</span>
            </div>
            <div className="day-temp" role="img" aria-label={`Mínima ${num(d.tMin)} graus, máxima ${num(d.tMax)} graus`}>
              <div className="day-track">
                <i style={{ bottom: `${pct(d.tMin)}%`, height: `${pct(d.tMax) - pct(d.tMin)}%` }}>
                  <b className="tmax num">{graus(d.tMax)}</b>
                  <b className="tmin num">{graus(d.tMin)}</b>
                </i>
              </div>
            </div>
            <dl className="day-meta">
              <div className={d.probChuva >= 20 ? "wet" : undefined}>
                <dt className="label">Chuva</dt>
                <dd className="num">
                  {d.probChuva}%
                  <span className="rain-bar" aria-hidden="true"><i style={{ width: `${d.probChuva}%` }} /></span>
                </dd>
              </div>
              {d.dirVento && (
                <div className="day-wind">
                  <dt className="label">Vento</dt>
                  <dd>
                    <svg width="14" height="14" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${((DIRS[d.dirVento] ?? 0) + 180) % 360}deg)` }}>
                      <path d="M0 -6 L0 6 M-3 2.5 L0 6 L3 2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {d.ventoClasse ? INTENSIDADE_VENTO[d.ventoClasse] : ""} {d.dirVento}
                  </dd>
                </div>
              )}
            </dl>
          </li>
        );
      })}
    </ol>
  );
}
