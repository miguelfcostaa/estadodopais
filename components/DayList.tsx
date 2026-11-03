import Link from "next/link";
import type { Dia } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { INTENSIDADE_VENTO } from "@/lib/ipma";
import { diaSemana, graus, nivelUV, num } from "@/lib/format";
import { gradiente } from "@/lib/temperatura";
import { FactIcon } from "./FactIcon";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// Os 10 dias numa lista, uma linha por dia. O centro de cada linha é a barra de temperatura,
// numa escala comum a todos os dias: vê-se logo que dias são mais quentes e quanto varia cada um.
export function DayList({ dias, slug }: { dias: Dia[]; slug: string }) {
  const lo = Math.floor(Math.min(...dias.map((d) => d.tMin)));
  const hi = Math.ceil(Math.max(...dias.map((d) => d.tMax)));
  const pct = (t: number) => ((t - lo) / Math.max(hi - lo, 1)) * 100;
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

  return (
    <ol className="dlist">
      {dias.map((d, i) => {
        const nome = cap(i === 0 ? "Hoje" : i === 1 ? "Amanhã" : diaSemana(d.data));
        const curto = cap(i === 0 ? "Hoje" : diaSemana(d.data, true));
        const [, mes, dia] = d.data.split("-").map(Number);
        const chuva = d.probChuva >= 20;
        return (
          <li key={d.data} className={i === 0 ? "dl-hoje" : undefined}>
            <Link className="dl-linha" href={`/local/${slug}/dia/${d.data}`} aria-label={`${nome}, ${dia} de ${MESES[mes - 1]}: ver detalhes`}>
              <span className="dl-dia">
                <b>
                  <span className="nome-longo">{nome}</span>
                  <span className="nome-curto" aria-hidden="true">{curto}</span>
                </b>
                <span className="mono">{dia} {MESES[mes - 1]}</span>
              </span>

              <WeatherIcon tipo={d.tipoTempo} size={32} />
              <span className="dl-desc">{TIPOS_TEMPO[d.tipoTempo]}</span>

              <span className={chuva ? "dl-chuva on" : "dl-chuva"}>
                <FactIcon nome="chuva" />
                <span className="sr-only">Chuva </span>
                <span className="num">{d.probChuva}%</span>
              </span>

              <span className="dl-temp">
                <span className="dl-min num">{graus(d.tMin)}</span>
                <span className="dl-barra" role="img" aria-label={`Mínima ${num(d.tMin)} graus, máxima ${num(d.tMax)} graus`}>
                  <i style={{ left: `${pct(d.tMin)}%`, width: `${Math.max(pct(d.tMax) - pct(d.tMin), 2)}%`, background: gradiente(d.tMin, d.tMax) }} />
                </span>
                <span className="dl-max num">{graus(d.tMax)}</span>
              </span>

              <span className="dl-vento">
                {d.dirVento && (
                  <>
                    <span className="sr-only">Vento </span>
                    <svg width="12" height="12" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${((DIRS[d.dirVento] ?? 0) + 180) % 360}deg)` }}>
                      <path d="M0 -6 L0 6 M-3 2.5 L0 6 L3 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    {d.ventoClasse ? INTENSIDADE_VENTO[d.ventoClasse] : ""} {d.dirVento}
                  </>
                )}
              </span>

              <span className="dl-uv">
                <span className="sr-only">Índice UV </span>
                {d.uv != null ? (
                  <>
                    <span className="mono">UV</span> <span className="num">{num(d.uv)}</span> <span className="dl-uv-nivel">{nivelUV(d.uv)}</span>
                  </>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
