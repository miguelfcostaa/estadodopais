import Link from "next/link";
import type { Dia } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { INTENSIDADE_VENTO } from "@/lib/ipma";
import { diaSemana, graus, nivelUV, num } from "@/lib/format";
import { Carousel } from "./Carousel";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// Cor de cada temperatura (°C), para o gradiente da barra: do frio (azul) ao calor (vermelho)
const ESCALA: [number, string][] = [
  [0, "#7aa6d6"], [8, "#6fb3b8"], [14, "#8cb88c"], [20, "#b5bd5a"], [26, "#d9a62b"], [32, "#e07b39"], [38, "#d6453d"],
];

function corDe(t: number): string {
  if (t <= ESCALA[0][0]) return ESCALA[0][1];
  for (let i = 1; i < ESCALA.length; i++) {
    const [t1, c1] = ESCALA[i];
    if (t <= t1) {
      const [t0, c0] = ESCALA[i - 1];
      const k = (t - t0) / (t1 - t0);
      const a = parseInt(c0.slice(1), 16), b = parseInt(c1.slice(1), 16);
      const canal = (s: number) => Math.round(((a >> s) & 255) + (((b >> s) & 255) - ((a >> s) & 255)) * k);
      return `rgb(${canal(16)}, ${canal(8)}, ${canal(0)})`;
    }
  }
  return ESCALA[ESCALA.length - 1][1];
}

// Gradiente da mínima à máxima, com as cores da escala que ficam pelo meio
function gradiente(tMin: number, tMax: number): string {
  if (tMax - tMin < 0.5) return corDe(tMax);
  const pontos = [tMin, ...ESCALA.map(([t]) => t).filter((t) => t > tMin && t < tMax), tMax];
  return `linear-gradient(90deg, ${pontos.map((t) => `${corDe(t)} ${(((t - tMin) / (tMax - tMin)) * 100).toFixed(1)}%`).join(", ")})`;
}

// Dias em colunas. Cada coluna abre a página desse dia.
// A barra de temperatura usa a mesma escala em todos os dias mostrados.
export function DayColumns({ dias, slug, atual, carrossel = false }: { dias: Dia[]; slug: string; atual?: string; carrossel?: boolean }) {
  const lo = Math.floor(Math.min(...dias.map((d) => d.tMin))) - 1;
  const hi = Math.ceil(Math.max(...dias.map((d) => d.tMax))) + 1;
  const pct = (t: number) => ((t - lo) / (hi - lo)) * 100;
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

  const lista = (
    <ol className={carrossel ? "days5 days-track" : "days5"}>
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
                <i style={{ left: `${pct(d.tMin)}%`, width: `${pct(d.tMax) - pct(d.tMin)}%`, background: gradiente(d.tMin, d.tMax) }} />
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
                {/* O IPMA só prevê o índice UV para os primeiros 5 dias; nos outros fica um traço, para os cartões ficarem alinhados */}
                <div>
                  <dt className="label">UV</dt>
                  <dd className="num">
                    {d.uv != null ? (
                      <>
                        <span className="uv-pre">UV </span>
                        {num(d.uv)}
                        <span className="uv-nivel"> {nivelUV(d.uv)}</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>
            </Link>
          </li>
        );
      })}
    </ol>
  );
  return carrossel ? (
    <Carousel label="Previsão dia a dia" inicio=".day.today">
      {lista}
    </Carousel>
  ) : (
    lista
  );
}
