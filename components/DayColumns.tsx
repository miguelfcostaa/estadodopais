import Link from "next/link";
import type { Dia, Hora } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { INTENSIDADE_VENTO } from "@/lib/ipma";
import { diaSemana, graus, num } from "@/lib/format";
import { Carousel } from "./Carousel";
import { corDe, ESCALA, gradiente } from "@/lib/temperatura";
import { FactIcon } from "./FactIcon";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// Curva da temperatura ao longo de um dia (00h a 23h), na escala comum a todos os dias mostrados,
// pintada com as cores da temperatura (o gradiente vai do frio, em baixo, ao calor, em cima)
function CurvaDia({ id, pts, lo, hi }: { id: string; pts: Hora[]; lo: number; hi: number }) {
  const W = 100, H = 40, T = 4, B = 36;
  const y = (t: number) => B - ((t - lo) / Math.max(hi - lo, 1)) * (B - T);
  const x = (h: Hora) => (Number(h.hora.slice(11, 13)) / 23) * W;
  const linha = pts.map((h, i) => `${i ? "L" : "M"}${x(h).toFixed(1)} ${y(h.temp).toFixed(1)}`).join(" ");
  const area = `${linha} L${x(pts[pts.length - 1]).toFixed(1)} ${H} L${x(pts[0]).toFixed(1)} ${H} Z`;
  const stops = [lo, ...ESCALA.map(([t]) => t).filter((t) => t > lo && t < hi), hi];
  return (
    <svg className="day-curva" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={B} y2={T}>
          {stops.map((t) => (
            <stop key={t} offset={`${(((t - lo) / Math.max(hi - lo, 1)) * 100).toFixed(1)}%`} stopColor={corDe(t)} />
          ))}
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} opacity={0.14} />
      <path d={linha} fill="none" stroke={`url(#${id})`} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Dias em colunas. Cada coluna abre a página desse dia.
// A barra de temperatura usa a mesma escala em todos os dias mostrados.
export function DayColumns({ dias, slug, atual, carrossel = false, pontos = [] }: { dias: Dia[]; slug: string; atual?: string; carrossel?: boolean; pontos?: Hora[] }) {
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
            <Link className="day-link" style={{ "--brilho": corDe(d.tMax) } as React.CSSProperties} href={`/local/${slug}/dia/${d.data}`} aria-label={`${nome}, ${dia} de ${MESES[mes - 1]}: ver detalhes`}>
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
                <WeatherIcon tipo={d.tipoTempo} size={46} />
                <span className="day-desc">{TIPOS_TEMPO[d.tipoTempo]}</span>
              </div>

              <div className="day-temps">
                <span className="tmax num">{graus(d.tMax)}</span>
                <span className="tmin num">{graus(d.tMin)}</span>
              </div>
              {(() => {
                const pts = pontos.filter((h) => h.hora.startsWith(d.data));
                // Com valores ao longo do dia, a curva; sem eles (dias mais à frente), a barra da mínima à máxima
                return pts.length >= 6 ? (
                  <div className="day-curva-box" role="img" aria-label={`Temperatura ao longo do dia, de ${num(d.tMin)} a ${num(d.tMax)} graus`}>
                    <CurvaDia id={`cv-${d.data}`} pts={pts} lo={lo} hi={hi} />
                  </div>
                ) : (
                  <div className="day-range" role="img" aria-label={`Mínima ${num(d.tMin)} graus, máxima ${num(d.tMax)} graus`}>
                    <i style={{ left: `${pct(d.tMin)}%`, width: `${pct(d.tMax) - pct(d.tMin)}%`, background: gradiente(d.tMin, d.tMax) }} />
                  </div>
                );
              })()}

              {/* Chuva, vento e UV em pastilhas no fundo do cartão */}
              <ul className="day-pills">
                <li className={d.probChuva >= 20 ? "pill wet" : "pill"}>
                  <FactIcon nome="chuva" />
                  <span className="sr-only">Chuva </span>
                  <span className="num">{d.probChuva}%</span>
                </li>
                {d.dirVento && (
                  <li className="pill day-wind">
                    <span className="sr-only">Vento </span>
                    <svg className="day-seta" width="12" height="12" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${((DIRS[d.dirVento] ?? 0) + 180) % 360}deg)` }}>
                      <path d="M0 -6 L0 6 M-3 2.5 L0 6 L3 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <span>{d.ventoClasse ? INTENSIDADE_VENTO[d.ventoClasse] : ""}</span>
                  </li>
                )}
                {d.uv != null && (
                  <li className="pill day-uv">
                    <FactIcon nome="uv" />
                    <span className="sr-only">Índice UV </span>
                    <span className="num">{num(d.uv)}</span>
                  </li>
                )}
              </ul>
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
