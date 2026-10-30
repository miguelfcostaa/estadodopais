"use client";

import { useEffect, useState } from "react";
import type { Hora } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { dataCurta, diaSemana, hora, horaAtual } from "@/lib/format";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Previsão hora a hora em cartões, agrupados por dia.
// Por omissão começa na hora atual de quem vê e mostra 48 horas.
export function HourlyTable({ horas: todas, agora: agoraServidor, fuso, aPartirDeAgora = true }: { horas: Hora[]; agora: string; fuso: string; aPartirDeAgora?: boolean }) {
  const [agora, setAgora] = useState(agoraServidor);
  useEffect(() => setAgora(horaAtual(fuso)), [fuso]);
  const seguintes = todas.filter((h) => h.hora >= agora);
  const horas = aPartirDeAgora ? (seguintes.length >= 12 ? seguintes : todas.slice(-48)).slice(0, 48) : todas;

  const dias: { data: string; horas: Hora[] }[] = [];
  for (const h of horas) {
    const d = h.hora.slice(0, 10);
    if (dias.at(-1)?.data !== d) dias.push({ data: d, horas: [] });
    dias.at(-1)!.horas.push(h);
  }
  const nomeDia = (iso: string) => (iso === agora.slice(0, 10) ? "Hoje" : diaSemana(iso).charAt(0).toUpperCase() + diaSemana(iso).slice(1));

  return (
    <div className="hours">
      {dias.map((d) => (
        <section key={d.data} className="hours-day" aria-label={`${nomeDia(d.data)}, ${dataCurta(d.data)}`}>
          {aPartirDeAgora && (
            <h3 className="hours-title">
              {nomeDia(d.data)} <span className="mono">{dataCurta(d.data)}</span>
            </h3>
          )}
          <ol className="hours-grid">
            {d.horas.map((h) => {
              const desc = TIPOS_TEMPO[h.tipoTempo] ?? "";
              const molhado = h.probChuva !== null && h.probChuva >= 20;
              return (
                <li key={h.hora} className={`hour${h.hora === agora ? " now" : ""}`}>
                  <span className="hour-time mono">{h.hora === agora ? "Agora" : `${String(hora(h.hora)).padStart(2, "0")}h`}</span>
                  <span className="hour-icon" title={desc}>
                    <WeatherIcon tipo={h.tipoTempo} size={30} />
                    <span className="sr-only">{desc}</span>
                  </span>
                  <span className="hour-temp num">{Math.round(h.temp)}°</span>
                  <span className={`hour-rain num${molhado ? " wet" : ""}`}>
                    {h.probChuva === null ? (
                      <span className="hour-empty" aria-label="sem valor de chuva">·</span>
                    ) : (
                      <>
                        <span className="hour-bar" aria-hidden="true"><i style={{ width: `${Math.max(h.probChuva, 3)}%` }} /></span>
                        {Math.round(h.probChuva)}%
                      </>
                    )}
                  </span>
                  <span className="hour-wind num" aria-label={`vento ${Math.round(h.vento)} km/h de ${h.dirVento}`}>
                    <svg width="11" height="11" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${((DIRS[h.dirVento] ?? 0) + 180) % 360}deg)` }}>
                      <path d="M0 -6 L0 6 M-3 2.5 L0 6 L3 2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    {Math.round(h.vento)} <small>km/h</small>
                  </span>
                  {h.humidade !== null && <span className="hour-hum num">{Math.round(h.humidade)}% <small>hum.</small></span>}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
