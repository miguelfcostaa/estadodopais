"use client";

import { useEffect, useState } from "react";
import type { Hora } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { dataCurta, diaSemana, hora, horaAtual } from "@/lib/format";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Tabela hora a hora. Por omissão começa na hora atual de quem vê e mostra 48 horas.
export function HourlyTable({ horas: todas, agora: agoraServidor, fuso, aPartirDeAgora = true }: { horas: Hora[]; agora: string; fuso: string; aPartirDeAgora?: boolean }) {
  const [agora, setAgora] = useState(agoraServidor);
  useEffect(() => setAgora(horaAtual(fuso)), [fuso]);
  const seguintes = todas.filter((h) => h.hora >= agora);
  const horas = aPartirDeAgora ? (seguintes.length >= 12 ? seguintes : todas.slice(-48)).slice(0, 48) : todas;
  const nomeDia = (iso: string) => (iso.slice(0, 10) === agora.slice(0, 10) ? "Hoje" : diaSemana(iso).charAt(0).toUpperCase() + diaSemana(iso).slice(1));

  return (
    <div className="hourly">
      <div className="hr-row hr-head" aria-hidden="true">
        <span className="label">Hora</span>
        <span className="label">Tempo</span>
        <span className="label r">Temp.</span>
        <span className="label r">Chuva</span>
        <span className="label">Vento</span>
        <span className="label r hr-hum">Humidade</span>
      </div>
      <ol className="hr-list">
        {horas.map((h, i) => {
          const novoDia = aPartirDeAgora && (i === 0 || hora(h.hora) === 0);
          const mudouTempo = i === 0 || horas[i - 1].tipoTempo !== h.tipoTempo || novoDia;
          const descricao = TIPOS_TEMPO[h.tipoTempo] ?? "";
          return (
            <li key={h.hora}>
              {novoDia && (
                <div className="hr-day">
                  {nomeDia(h.hora)} <span className="mono">{dataCurta(h.hora)}</span>
                </div>
              )}
              <div className={`hr-row${h.hora === agora ? " now" : ""}`}>
                <span className="hr-hour mono">{h.hora === agora ? "agora" : `${String(hora(h.hora)).padStart(2, "0")}h`}</span>
                <span className="hr-wx" title={descricao}>
                  <WeatherIcon tipo={h.tipoTempo} size={22} />
                  <span className="hr-desc">{mudouTempo ? descricao : ""}</span>
                  <span className="sr-only">{descricao}</span>
                </span>
                <span className="hr-temp r num">{Math.round(h.temp)}°</span>
                <span className={`hr-rain r num${h.probChuva && h.probChuva >= 20 ? " wet" : ""}`}>
                  {h.probChuva !== null && (
                    <>
                      <span className="hr-bar" aria-hidden="true"><i style={{ width: `${Math.max(h.probChuva, 2)}%` }} /></span>
                      {Math.round(h.probChuva)}%
                    </>
                  )}
                </span>
                <span className="hr-wind num">
                  <svg width="12" height="12" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${((DIRS[h.dirVento] ?? 0) + 180) % 360}deg)` }}>
                    <path d="M0 -6 L0 6 M-3 2.5 L0 6 L3 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  {Math.round(h.vento)} <small>km/h</small> <span className="mono">{h.dirVento}</span>
                </span>
                <span className="hr-hum r num">{h.humidade === null ? "" : `${Math.round(h.humidade)}%`}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
