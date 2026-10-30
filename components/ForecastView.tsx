import Link from "next/link";
import type { Previsao } from "@/lib/data";
import { AGORA, RISCO_INCENDIO } from "@/lib/data";
import { dataLonga, graus, num, nivelUV } from "@/lib/format";
import { DayList } from "./DayList";
import { LocalPicker } from "./LocalPicker";
import { Meteogram } from "./Meteogram";
import { WarningsGrid } from "./WarningsGrid";
import { WarningsLead } from "./WarningsLead";

export function ForecastView({ p }: { p: Previsao }) {
  const { local, resumo, agora, mar } = p;
  return (
    <>
      <div className="lead">
        <div>
          <div className="place">
            <span className="label">{dataLonga(AGORA)}</span>
            <LocalPicker atual={local.slug} />
          </div>
          <h1>
            {resumo.titulo} <em className="num">{resumo.destaque}</em>.
          </h1>
          <p className="summary">{resumo.texto}</p>
        </div>
        <dl className="facts">
          <div><dt className="label">Às {AGORA.slice(11, 13)}h</dt><dd className="num">{graus(agora.temp)}<small>previsto</small></dd></div>
          <div><dt className="label">Humidade</dt><dd className="num">{agora.humidade}<small>%</small></dd></div>
          <div><dt className="label">Vento</dt><dd className="num">{Math.round(agora.vento)}<small>km/h · {agora.dirVento}</small></dd></div>
          <div><dt className="label">Índice UV</dt><dd className="num">{num(p.uv)}<small>{nivelUV(p.uv)}</small></dd></div>
          <div><dt className="label">Mar</dt><dd className="num">{num(mar.ondaMin)}–{num(mar.ondaMax)}<small>m · {mar.dirOnda}</small></dd></div>
          <div><dt className="label">Água</dt><dd className="num">{graus(mar.aguaMax)}<small>{mar.zona}</small></dd></div>
        </dl>
      </div>

      <section className="section" aria-labelledby="h-48">
        <div className="sec-head">
          <h2 id="h-48">Próximas 48 horas</h2>
          <span className="label">{local.nome} · hora a hora</span>
        </div>
        <Meteogram horas={p.horas} agora={AGORA} />
        <p className="caption">
          <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 8c3 0 3-6 6-6s3 8 6 8 3-4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          Um meteograma: a linha é a temperatura prevista, as barras a probabilidade de chuva e as setas mostram para onde sopra o vento. O ponto marca a hora atual.
        </p>
      </section>

      <section className="section" aria-labelledby="h-10">
        <div className="sec-head">
          <h2 id="h-10">Próximos 10 dias</h2>
          <span className="label">mínima · máxima · chuva</span>
        </div>
        <DayList dias={p.dias} />
      </section>

      <section className="section" aria-labelledby="h-av">
        <div className="sec-head">
          <h2 id="h-av">Avisos</h2>
          <Link className="more" href="/avisos">Ver todos os avisos →</Link>
        </div>
        <WarningsLead />
        <WarningsGrid />
      </section>

      <section className="section" aria-labelledby="h-mar">
        <div className="sec-head">
          <h2 id="h-mar">Mar, sol e fogo</h2>
          <Link className="more" href="/mar">Toda a costa →</Link>
        </div>
        <div className="trio">
          <div>
            <span className="label">Estado do mar</span>
            <h3>{mar.zona}</h3>
            <div className="big num">{num(mar.ondaMin)}–{num(mar.ondaMax)}<small>m</small></div>
            <p>Ondas de {mar.dirOnda === "NW" ? "noroeste" : mar.dirOnda} com período de {num(mar.periodoMin)} a {num(mar.periodoMax)} segundos. Água entre {num(mar.aguaMin)}° e {num(mar.aguaMax)}°.</p>
          </div>
          <div>
            <span className="label">Radiação ultravioleta</span>
            <h3>Índice UV</h3>
            <div className="big num">{num(p.uv)}<small>{nivelUV(p.uv)}</small></div>
            <Steps n={Math.min(5, Math.ceil(p.uv / 2.2))} />
            <div className="steps-l mono"><span>baixo</span><span>extremo</span></div>
          </div>
          <div>
            <span className="label">Risco de incêndio</span>
            <h3>Concelho de {local.nome}</h3>
            <div className="big">{RISCO_INCENDIO[p.riscoIncendio - 1]}</div>
            <Steps n={p.riscoIncendio} />
            <div className="steps-l mono"><span>reduzido</span><span>máximo</span></div>
            <p>Nível {p.riscoIncendio} em 5 na escala do IPMA.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Steps({ n }: { n: number }) {
  return (
    <div className="steps" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= n ? "on" : undefined} />
      ))}
    </div>
  );
}
