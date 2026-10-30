import type { Dia } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { dataCurta, diaSemana, graus, num } from "@/lib/format";
import { WeatherIcon } from "./WeatherIcon";

export function DayList({ dias }: { dias: Dia[] }) {
  const lo = Math.floor(Math.min(...dias.map((d) => d.tMin))) - 1;
  const hi = Math.ceil(Math.max(...dias.map((d) => d.tMax))) + 1;
  const pct = (t: number) => ((t - lo) / (hi - lo)) * 100;

  return (
    <div>
      {dias.map((d, i) => {
        const nome = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : diaSemana(d.data, true);
        return (
          <div className="drow" key={d.data}>
            <div className="d">
              {nome.charAt(0).toUpperCase() + nome.slice(1)}
              <span className="mono num">{dataCurta(d.data)}</span>
            </div>
            <WeatherIcon tipo={d.tipoTempo} />
            <div className="desc">{TIPOS_TEMPO[d.tipoTempo]}</div>
            <div className="tmin num">{graus(d.tMin)}</div>
            <div className="range" role="img" aria-label={`de ${num(d.tMin)} a ${num(d.tMax)} graus`}>
              <i style={{ left: `${pct(d.tMin)}%`, width: `${pct(d.tMax) - pct(d.tMin)}%` }} />
            </div>
            <div className="num">{graus(d.tMax)}</div>
            <div className={`pp mono num${d.probChuva >= 20 ? " wet" : ""}`} aria-label={`probabilidade de chuva ${d.probChuva}%`}>
              <span className="bar-p"><i style={{ width: `${d.probChuva}%` }} /></span>
              {d.probChuva}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
