"use client";

import { useEffect, useState } from "react";
import type { Hora } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { diaSemana, dataCurta, hora, horaAtual, num } from "@/lib/format";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Geometria do desenho (viewBox 1000 x 300)
const L = 40, R = 990, TOP = 34, T_BOT = 178, P_TOP = 196, P_BOT = 236, W_Y = 266;

export function Meteogram({ horas: todas, agora: agoraServidor, fuso, aPartirDeAgora = true }: { horas: Hora[]; agora: string; fuso: string; aPartirDeAgora?: boolean }) {
  const [sel, setSel] = useState<number | null>(null);
  const [agora, setAgora] = useState(agoraServidor);
  useEffect(() => setAgora(horaAtual(fuso)), [fuso]);
  const seguintes = todas.filter((h) => h.hora >= agora);
  const horas = aPartirDeAgora ? (seguintes.length >= 12 ? seguintes : todas.slice(-48)).slice(0, 48) : todas;
  const n = horas.length;
  const step = (R - L) / (n - 1);
  const temps = horas.map((h) => h.temp);
  const tMin = Math.floor(Math.min(...temps) / 2) * 2 - 1;
  const tMax = Math.ceil(Math.max(...temps) / 2) * 2 + 1;
  const x = (i: number) => L + i * step;
  const y = (t: number) => T_BOT - ((t - tMin) / (tMax - tMin)) * (T_BOT - TOP);

  const grelha: number[] = [];
  for (let t = Math.ceil(tMin / 4) * 4; t <= tMax; t += 4) grelha.push(t);

  const pontos = horas.map((h, i) => [x(i), y(h.temp)] as const);
  const linha = pontos.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const iAgora = horas.findIndex((h) => h.hora === agora);
  const semChuva = horas.every((h) => !h.probChuva);

  // Máximos e mínimos locais de cada dia
  const extremos: number[] = [];
  const porDia = new Map<string, number[]>();
  horas.forEach((h, i) => {
    const d = h.hora.slice(0, 10);
    porDia.set(d, [...(porDia.get(d) ?? []), i]);
  });
  // Só marca máximos e mínimos de dias com horas suficientes para serem reais
  porDia.forEach((idx) => {
    const max = idx.reduce((a, b) => (horas[b].temp > horas[a].temp ? b : a));
    const min = idx.reduce((a, b) => (horas[b].temp < horas[a].temp ? b : a));
    const temPico = hora(horas[max].hora) >= 11 && hora(horas[max].hora) <= 18;
    if (idx.length >= 6 && temPico && max !== idx[0] && max !== idx[idx.length - 1]) extremos.push(max);
    if (idx.length >= 20) extremos.push(min);
  });

  const h = sel !== null ? horas[sel] : null;

  return (
    <>
      <div className="chart-scroll">
        <div className="meteo-wrap">
        <svg className="meteo" viewBox="0 0 1000 300" role="img" aria-label="Meteograma: temperatura, probabilidade de chuva e vento hora a hora" onMouseLeave={() => setSel(null)}>
          {grelha.map((t) => (
            <g key={t}>
              <line x1={L} x2={R} y1={y(t)} y2={y(t)} stroke="var(--line)" />
              <text x={L - 8} y={y(t) + 4} textAnchor="end">{t}°</text>
            </g>
          ))}
          <line x1={L} x2={R} y1={P_BOT} y2={P_BOT} stroke="var(--line)" />
          <text x={L - 8} y={P_TOP + 8} textAnchor="end">100</text>
          <text x={L - 8} y={P_BOT - 2} textAnchor="end">0%</text>

          {horas.map((hh, i) => {
            const hr = hora(hh.hora);
            return (
              <g key={hh.hora}>
                {hr === 0 && (
                  <>
                    <line x1={x(i)} x2={x(i)} y1={10} y2={P_BOT} stroke="var(--faint)" strokeDasharray="2 4" />
                    <text x={x(i) + 6} y={18} className="day">{`${diaSemana(hh.hora, true)} ${dataCurta(hh.hora)}`}</text>
                  </>
                )}
                {hr % 3 === 0 && (
                  <>
                    <text x={x(i)} y={P_BOT + 16} textAnchor="middle">{String(hr).padStart(2, "0")}h</text>
                    <g transform={`translate(${x(i)},${W_Y}) rotate(${((DIRS[hh.dirVento] ?? 0) + 180) % 360})`}>
                      <path d="M0 -7 L0 7 M-3.5 3 L0 7 L3.5 3" fill="none" stroke="var(--muted)" strokeWidth="1.3" strokeLinecap="round" />
                    </g>
                    <text x={x(i)} y={W_Y + 22} textAnchor="middle">{Math.round(hh.vento)}</text>
                  </>
                )}
                {!!hh.probChuva && (
                  <rect x={x(i) - step * 0.35} width={step * 0.7} y={P_BOT - (hh.probChuva / 100) * (P_BOT - P_TOP)} height={(hh.probChuva / 100) * (P_BOT - P_TOP)} fill="var(--rain)" />
                )}
              </g>
            );
          })}
          {semChuva && <text x={(L + R) / 2} y={P_BOT - 12} textAnchor="middle">sem chuva prevista</text>}

          <path d={`${linha} L${R} ${T_BOT} L${L} ${T_BOT} Z`} fill="var(--accent)" opacity={0.1} />
          <path className="t-line" d={linha} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
          {extremos.map((i) => {
            const [px, py] = pontos[i];
            const cima = horas[i].temp > (tMin + tMax) / 2;
            return (
              <g key={`e${i}`}>
                <circle cx={px} cy={py} r="2.5" fill="var(--accent)" />
                <text x={px} y={py + (cima ? -9 : 18)} textAnchor="middle" className="t-label">{num(horas[i].temp)}°</text>
              </g>
            );
          })}
          {iAgora >= 0 && (
            <g>
              <circle cx={pontos[iAgora][0]} cy={pontos[iAgora][1]} r="5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
              <text x={pontos[iAgora][0] + (iAgora === 0 ? 10 : 0)} y={pontos[iAgora][1] + 22} textAnchor={iAgora === 0 ? "start" : "middle"} className="t-label">agora</text>
            </g>
          )}
          {sel !== null && <line x1={x(sel)} x2={x(sel)} y1={TOP - 6} y2={W_Y + 26} stroke="var(--ink)" opacity={0.35} />}
          {horas.map((hh, i) => (
            <rect key={`h${hh.hora}`} className="hit" x={x(i) - step / 2} y={0} width={step} height={300} onMouseEnter={() => setSel(i)} onTouchStart={() => setSel(i)} />
          ))}
        </svg>
        {h && sel !== null && (
          <div
            className={`meteo-tip${x(sel) < 160 ? " left" : x(sel) > 840 ? " right" : ""}`}
            style={{ left: `${(x(sel) / 1000) * 100}%` }}
            aria-live="polite"
          >
            <span className="tip-when mono">{diaSemana(h.hora, true)} · {String(hora(h.hora)).padStart(2, "0")}h</span>
            <span className="tip-temp num">{num(h.temp)}°</span>
            <span className="tip-desc">{TIPOS_TEMPO[h.tipoTempo] ?? ""}</span>
            <span className="tip-meta num">
              <span>Chuva {h.probChuva === null ? "—" : `${Math.round(h.probChuva)}%`}</span>
              <span>Vento {Math.round(h.vento)} km/h {h.dirVento}</span>
            </span>
          </div>
        )}
        </div>
      </div>
      <p className="readout mono">Passe por cima do gráfico, ou toque nele, para ver cada hora.</p>
      <div className="legend mono">
        <span><i className="sw" />temperatura</span>
        <span><i className="sw rain" />probabilidade de chuva</span>
        <span>→ direção do vento, em km/h</span>
      </div>
    </>
  );
}
