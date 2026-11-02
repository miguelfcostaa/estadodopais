"use client";

import { useEffect, useRef, useState } from "react";
import type { Hora } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { dataCurta, diaSemana, hora, horaAtual, num } from "@/lib/format";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Faixas do gráfico (em píxeis reais, sem escalar como uma imagem)
const Y_DIA = 14;
const Y_HORA = 36;
const Y_ICONE = 48;
const TAM_ICONE = 26;
const T_TOPO = 108; // topo da curva (deixa espaço para os rótulos)
const T_BASE = 196;
const C_TOPO = 214; // faixa da chuva
const C_BASE = 262;
const Y_VENTO = 284;
const ALTURA = 312;

// Curva suave que não inventa máximos nem mínimos entre pontos (Fritsch-Carlson)
function curva(pts: [number, number][]): string {
  const n = pts.length;
  if (n < 2) return "";
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) m.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (pts[i + 1][0] - pts[i][0]) / 3;
    d += ` C${(pts[i][0] + dx).toFixed(1)} ${(pts[i][1] + t[i] * dx).toFixed(1)} ${(pts[i + 1][0] - dx).toFixed(1)} ${(pts[i + 1][1] - t[i + 1] * dx).toFixed(1)} ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
  }
  return d;
}

export function Meteogram({ horas: todas, agora: agoraServidor, fuso, aPartirDeAgora = true }: { horas: Hora[]; agora: string; fuso: string; aPartirDeAgora?: boolean }) {
  const caixa = useRef<HTMLDivElement>(null);
  const faixa = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(1000);
  const [agora, setAgora] = useState(agoraServidor);
  const [sel, setSel] = useState<number | null>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  useEffect(() => setAgora(horaAtual(fuso)), [fuso]);
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setLargura(el.clientWidth));
    ro.observe(el);
    setLargura(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const seguintes = todas.filter((h) => h.hora >= agora);
  const horas = aPartirDeAgora ? (seguintes.length >= 12 ? seguintes : todas.slice(-48)).slice(0, 48) : todas;
  const n = horas.length;
  const iAgora = horas.findIndex((h) => h.hora === agora);

  // Largura de cada coluna: ocupa o espaço todo, com um mínimo para caber cada hora (o resto desliza)
  const minimo = largura < 600 ? 46 : 44;
  const col = Math.max(minimo, largura / Math.max(n, 1));
  const W = Math.round(col * n);
  const cx = (i: number) => col * i + col / 2;
  const passo = (px: number) => Math.max(1, Math.ceil(px / col));
  const pRotulo = passo(36);
  const pIcone = passo(32);
  // Mostra um rótulo de p em p horas; a hora atual tem sempre o seu e afasta os vizinhos
  const mostra = (i: number, p: number) =>
    i === iAgora || ((p === 1 || hora(horas[i].hora) % p === 0) && (iAgora < 0 || Math.abs(i - iAgora) >= p));
  // Alinhamento junto às margens, para os rótulos não ficarem cortados
  const ancora = (i: number): "start" | "middle" | "end" => (cx(i) < 18 ? "start" : cx(i) > W - 18 ? "end" : "middle");
  const xr = (i: number) => (ancora(i) === "start" ? col * i + 2 : ancora(i) === "end" ? col * (i + 1) - 2 : cx(i));

  // No telemóvel, abrir já na hora atual
  useEffect(() => {
    const f = faixa.current;
    if (f && iAgora > 0) f.scrollLeft = Math.max(0, cx(iAgora) - 60);
    atualizar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iAgora, col]);

  function atualizar() {
    const f = faixa.current;
    if (!f) return;
    setPodeVoltar(f.scrollLeft > 1);
    setPodeAvancar(f.scrollLeft + f.clientWidth < f.scrollWidth - 1);
  }

  function mover(sentido: 1 | -1) {
    const f = faixa.current;
    if (!f) return;
    // Se o que sobra for menos do que um passo, vai até à ponta (evita parar a poucos píxeis do fim)
    const max = f.scrollWidth - f.clientWidth;
    let alvo = f.scrollLeft + sentido * f.clientWidth * 0.8;
    if (alvo > max - 8) alvo = max;
    if (alvo < 8) alvo = 0;
    f.scrollTo({ left: alvo, behavior: "smooth" });
  }

  if (n === 0) return null;

  const temps = horas.map((h) => h.temp);
  const tMin = Math.min(...temps), tMax = Math.max(...temps);
  const amplitude = Math.max(tMax - tMin, 4);
  const y = (t: number) => T_BASE - ((t - tMin) / amplitude) * (T_BASE - T_TOPO);
  const pts = horas.map((h, i) => [cx(i), y(h.temp)] as [number, number]);
  const linha = curva(pts);
  const iMax = temps.indexOf(tMax), iMin = temps.indexOf(tMin);
  // Rótulo de temperatura: os extremos têm sempre; os outros saem se ficarem colados a um extremo
  const rotuloTemp = (i: number) =>
    i === iMax || i === iMin || (mostra(i, pRotulo) && Math.abs(i - iMax) >= pRotulo && Math.abs(i - iMin) >= pRotulo) || i === iAgora;
  const semChuva = horas.every((h) => !h.probChuva);

  const escolhido = sel ?? (iAgora >= 0 ? iAgora : 0);
  const h = horas[escolhido];
  const quando = escolhido === iAgora ? `Agora · ${String(hora(h.hora)).padStart(2, "0")}h` : `${diaSemana(h.hora, true)} ${dataCurta(h.hora)} · ${String(hora(h.hora)).padStart(2, "0")}h`;

  return (
    <div className="mg" ref={caixa}>
      <div className="mg-panel" aria-live="polite">
        <div className="mg-panel-main">
          <WeatherIcon tipo={h.tipoTempo} size={44} noite={h.noite} />
          <div>
            <span className="mg-when mono">{quando}</span>
            <span className="mg-temp num">{num(h.temp)}°</span>
          </div>
        </div>
        <dl className="mg-panel-facts">
          <div><dt className="label">Tempo</dt><dd>{TIPOS_TEMPO[h.tipoTempo] ?? "–"}</dd></div>
          <div><dt className="label">Chuva</dt><dd className="num">{h.probChuva === null ? "–" : `${Math.round(h.probChuva)}%`}</dd></div>
          <div><dt className="label">Vento</dt><dd className="num">{Math.round(h.vento)} km/h {h.dirVento}</dd></div>
          {h.humidade !== null && <div><dt className="label">Humidade</dt><dd className="num">{Math.round(h.humidade)}%</dd></div>}
        </dl>
      </div>

      <div className={`mg-wrap${podeVoltar ? " fade-l" : ""}${podeAvancar ? " fade-r" : ""}`}>
      <div className="mg-scroll" ref={faixa} onScroll={atualizar}>
        <svg className="mg-svg" width={W} height={ALTURA} role="img" aria-label="Gráfico hora a hora: temperatura, chuva e vento" onMouseLeave={() => setSel(null)}>
          <defs>
            <linearGradient id="mg-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* coluna escolhida e coluna de agora */}
          {iAgora >= 0 && <rect x={col * iAgora} y={0} width={col} height={ALTURA} className="mg-now" />}
          {sel !== null && <rect x={col * sel} y={0} width={col} height={ALTURA} className="mg-sel" />}

          {/* faixas de fundo */}
          <line x1={0} x2={W} y1={T_BASE + 6} y2={T_BASE + 6} className="mg-rule" />
          <line x1={0} x2={W} y1={C_BASE} y2={C_BASE} className="mg-rule" />

          {horas.map((hh, i) => {
            const novoDia = i === 0 || hh.hora.slice(0, 10) !== horas[i - 1].hora.slice(0, 10);
            const x = cx(i);
            return (
              <g key={hh.hora}>
                {novoDia && (
                  <>
                    {i > 0 && <line x1={col * i} x2={col * i} y1={0} y2={ALTURA} className="mg-daysep" />}
                    <text x={col * i + 6} y={Y_DIA} className="mg-day">
                      {hh.hora.slice(0, 10) === agora.slice(0, 10) ? "Hoje" : `${diaSemana(hh.hora, true)} ${dataCurta(hh.hora)}`}
                    </text>
                  </>
                )}
                {mostra(i, pRotulo) && (
                  <text x={xr(i)} y={Y_HORA} textAnchor={ancora(i)} className={i === iAgora ? "mg-hour now" : "mg-hour"}>
                    {i === iAgora ? "Agora" : `${String(hora(hh.hora)).padStart(2, "0")}h`}
                  </text>
                )}
                {mostra(i, pIcone) && (
                  <svg x={Math.min(Math.max(x - TAM_ICONE / 2, 0), W - TAM_ICONE)} y={Y_ICONE} width={TAM_ICONE} height={TAM_ICONE} className="mg-icon">
                    <WeatherIcon tipo={hh.tipoTempo} size={TAM_ICONE} noite={hh.noite} />
                  </svg>
                )}
                {/* chuva */}
                {hh.probChuva !== null && hh.probChuva > 0 && (
                  <rect x={x - Math.min(col * 0.32, 9)} width={Math.min(col * 0.64, 18)} y={C_BASE - (hh.probChuva / 100) * (C_BASE - C_TOPO)} height={(hh.probChuva / 100) * (C_BASE - C_TOPO)} rx={2} className="mg-rain" />
                )}
                {hh.probChuva !== null && hh.probChuva >= 10 && mostra(i, pRotulo) && (
                  <text x={x} y={C_BASE - (hh.probChuva / 100) * (C_BASE - C_TOPO) - 4} textAnchor="middle" className="mg-rain-label">{Math.round(hh.probChuva)}%</text>
                )}
                {/* vento */}
                {mostra(i, pRotulo) && (
                  <g>
                    <g transform={`translate(${x},${Y_VENTO - 6}) rotate(${((DIRS[hh.dirVento] ?? 0) + 180) % 360})`}>
                      <path d="M0 -6 L0 6 M-3.5 2.5 L0 6 L3.5 2.5" className="mg-arrow" />
                    </g>
                    <text x={xr(i)} y={Y_VENTO + 18} textAnchor={ancora(i)} className="mg-wind">{Math.round(hh.vento)}</text>
                  </g>
                )}
              </g>
            );
          })}

          {semChuva && <text x={Math.min(W, largura) / 2} y={C_BASE - 12} textAnchor="middle" className="mg-norain">sem chuva prevista</text>}

          {/* temperatura */}
          <path d={`${linha} L${pts[n - 1][0]} ${T_BASE + 6} L${pts[0][0]} ${T_BASE + 6} Z`} fill="url(#mg-fill)" />
          <path d={linha} className="mg-line" />
          {horas.map((hh, i) =>
            rotuloTemp(i) ? (
              <g key={`t${hh.hora}`}>
                <circle cx={pts[i][0]} cy={pts[i][1]} r={i === iAgora ? 4.5 : 2.5} className={i === iAgora ? "mg-dot now" : "mg-dot"} />
                <text x={xr(i)} y={pts[i][1] - 10} textAnchor={ancora(i)} className={i === iMax || i === iMin ? "mg-tlabel strong" : "mg-tlabel"}>
                  {Math.round(hh.temp)}°
                </text>
              </g>
            ) : null,
          )}

          {/* zonas de toque, uma por coluna */}
          {horas.map((hh, i) => (
            <rect key={`hit${hh.hora}`} x={col * i} y={0} width={col} height={ALTURA} className="mg-hit" onMouseEnter={() => setSel(i)} onClick={() => setSel(i)} />
          ))}
        </svg>
      </div>
      </div>
      <div className="mg-foot">
        <p className="mg-hint mono">Passe o rato ou toque numa hora para ver os detalhes. Chuva em %, vento em km/h.</p>
        {(podeVoltar || podeAvancar) && (
          <div className="carousel-nav">
            <button type="button" className="carousel-btn" onClick={() => mover(-1)} disabled={!podeVoltar} aria-label="Horas anteriores">‹</button>
            <button type="button" className="carousel-btn" onClick={() => mover(1)} disabled={!podeAvancar} aria-label="Horas seguintes">›</button>
          </div>
        )}
      </div>
    </div>
  );
}
