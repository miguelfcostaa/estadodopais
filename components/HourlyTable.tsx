"use client";

import { useEffect, useState } from "react";
import type { Hora } from "@/lib/data";
import { TIPOS_TEMPO } from "@/lib/data";
import { dataCurta, diaSemana, hora, horaAtual, num } from "@/lib/format";
import { WeatherIcon } from "./WeatherIcon";

const DIRS: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

// Tabela hora a hora das próximas 48 horas, a partir da hora atual de quem vê
export function HourlyTable({ horas: todas, agora: agoraServidor, fuso }: { horas: Hora[]; agora: string; fuso: string }) {
  const [agora, setAgora] = useState(agoraServidor);
  useEffect(() => setAgora(horaAtual(fuso)), [fuso]);
  const seguintes = todas.filter((h) => h.hora >= agora);
  const horas = (seguintes.length >= 12 ? seguintes : todas.slice(-48)).slice(0, 48);

  return (
    <div className="table-scroll">
      <table className="data hourly">
        <thead>
          <tr>
            <th className="label">Hora</th>
            <th className="label" colSpan={2}>Tempo</th>
            <th className="label r">Temp.</th>
            <th className="label r">Chuva</th>
            <th className="label">Vento</th>
            <th className="label r">Humidade</th>
          </tr>
        </thead>
        <tbody>
          {horas.map((h, i) => {
            const novoDia = i === 0 || hora(h.hora) === 0;
            return [
              novoDia && (
                <tr key={`d${h.hora}`} className="day-row">
                  <td colSpan={7}>
                    {i === 0 ? "Hoje" : diaSemana(h.hora).charAt(0).toUpperCase() + diaSemana(h.hora).slice(1)}
                    <span className="mono">{dataCurta(h.hora)}</span>
                  </td>
                </tr>
              ),
              <tr key={h.hora} className={i === 0 ? "now" : undefined}>
                <td className="mono">{i === 0 ? "agora" : `${String(hora(h.hora)).padStart(2, "0")}h`}</td>
                <td className="wx-cell"><WeatherIcon tipo={h.tipoTempo} size={22} /></td>
                <td className="wx-desc">{TIPOS_TEMPO[h.tipoTempo] ?? ""}</td>
                <td className="r temp">{num(Math.round(h.temp))}°</td>
                <td className={`r${h.probChuva && h.probChuva >= 20 ? " wet" : ""}`}>{h.probChuva === null ? "—" : `${Math.round(h.probChuva)}%`}</td>
                <td className="wind-cell">
                  <svg width="12" height="12" viewBox="-8 -8 16 16" aria-hidden="true" style={{ transform: `rotate(${((DIRS[h.dirVento] ?? 0) + 180) % 360}deg)` }}>
                    <path d="M0 -6 L0 6 M-3 2.5 L0 6 L3 2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  {Math.round(h.vento)} km/h <span className="mono">{h.dirVento}</span>
                </td>
                <td className="r">{h.humidade === null ? "—" : `${Math.round(h.humidade)}%`}</td>
              </tr>,
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
