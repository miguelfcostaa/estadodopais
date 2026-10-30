import Link from "next/link";
import type { Aviso } from "@/lib/data";
import { RISCO_INCENDIO } from "@/lib/data";
import type { Previsao } from "@/lib/ipma";
import { direcaoExtenso } from "@/lib/ipma";
import { dataLonga, graus, hora, horaDe, num, nivelUV } from "@/lib/format";
import { DayList } from "./DayList";
import { LocalPicker } from "./LocalPicker";
import { Meteogram } from "./Meteogram";
import { WarningsGrid } from "./WarningsGrid";
import { WarningsLead } from "./WarningsLead";

export function ForecastView({ p, avisos }: { p: Previsao; avisos: Aviso[] }) {
  const { local, resumo, atual, mar } = p;
  const factos: { label: string; valor: string; unidade: string }[] = [
    { label: `Às ${hora(p.agora)}h`, valor: graus(atual.temp), unidade: "previsto" },
    atual.humidade !== null ? { label: "Humidade", valor: String(Math.round(atual.humidade)), unidade: "%" } : null,
    atual.vento !== null ? { label: "Vento", valor: String(Math.round(atual.vento)), unidade: `km/h · ${atual.dirVento}` } : null,
    p.uv !== null ? { label: "Índice UV", valor: num(p.uv), unidade: nivelUV(p.uv) } : null,
    mar ? { label: "Ondas", valor: num(mar.onda), unidade: `m · ${mar.dirOnda}` } : atual.sensacao !== null ? { label: "Sensação", valor: graus(atual.sensacao), unidade: "térmica" } : null,
    mar?.agua != null ? { label: "Água do mar", valor: graus(mar.agua), unidade: "" } : p.probChuvaHoje !== null ? { label: "Chuva hoje", valor: String(Math.round(p.probChuvaHoje)), unidade: "%" } : null,
  ].filter((f): f is { label: string; valor: string; unidade: string } => f !== null);

  return (
    <>
      <div className="lead">
        <div>
          <div className="place">
            <span className="label">{dataLonga(p.agora)}</span>
            <LocalPicker atual={local.slug} />
          </div>
          <h1>
            {resumo.titulo} <em className="num">{resumo.destaque}</em>.
          </h1>
          <p className="summary">{resumo.texto}</p>
          <p className="source mono">Previsão do IPMA atualizada às {horaDe(p.atualizado)}</p>
        </div>
        <dl className="facts">
          {factos.map((f) => (
            <div key={f.label}>
              <dt className="label">{f.label}</dt>
              <dd className="num">
                {f.valor}
                {f.unidade && <small>{f.unidade}</small>}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="section" aria-labelledby="h-48">
        <div className="sec-head">
          <h2 id="h-48">Próximas 48 horas</h2>
          <span className="label">{local.nome} · hora a hora</span>
        </div>
        <Meteogram horas={p.horas} agora={p.agora} fuso={p.fuso} />
        <p className="caption">
          <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 8c3 0 3-6 6-6s3 8 6 8 3-4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          Um meteograma: a linha é a temperatura prevista, as barras a probabilidade de chuva e as setas mostram para onde sopra o vento. O ponto marca a hora atual.
        </p>
      </section>

      <section className="section" aria-labelledby="h-10">
        <div className="sec-head">
          <h2 id="h-10">Próximos {p.dias.length} dias</h2>
          <span className="label">mínima · máxima · chuva</span>
        </div>
        <DayList dias={p.dias} />
      </section>

      <section className="section" aria-labelledby="h-av">
        <div className="sec-head">
          <h2 id="h-av">Avisos</h2>
          <Link className="more" href="/avisos">Ver todos os avisos →</Link>
        </div>
        <WarningsLead avisos={avisos} />
        <WarningsGrid avisos={avisos} />
      </section>

      {(mar || p.uv !== null || p.riscoIncendio !== null) && (
        <section className="section" aria-labelledby="h-mar">
          <div className="sec-head">
            <h2 id="h-mar">Mar, sol e fogo</h2>
            <Link className="more" href="/mar">Toda a costa →</Link>
          </div>
          <div className="trio">
            {mar && (
              <div>
                <span className="label">Estado do mar</span>
                <h3>Costa de {local.nome}</h3>
                <div className="big num">{num(mar.onda)}<small>m</small></div>
                <p>
                  Ondulação de {direcaoExtenso(mar.dirOnda)}
                  {mar.periodo !== null && ` com período de ${num(mar.periodo)} segundos`}.
                  {mar.agua !== null && ` Água a ${num(mar.agua)}°.`}
                </p>
              </div>
            )}
            {p.uv !== null && (
              <div>
                <span className="label">Radiação ultravioleta</span>
                <h3>Índice UV</h3>
                <div className="big num">{num(p.uv)}<small>{nivelUV(p.uv)}</small></div>
                <Steps n={Math.min(5, Math.max(1, Math.ceil(p.uv / 2.2)))} />
                <div className="steps-l mono"><span>baixo</span><span>extremo</span></div>
              </div>
            )}
            {p.riscoIncendio !== null && (
              <div>
                <span className="label">Risco de incêndio</span>
                <h3>Concelho de {local.nome}</h3>
                <div className="big">{RISCO_INCENDIO[p.riscoIncendio - 1]}</div>
                <Steps n={p.riscoIncendio} />
                <div className="steps-l mono"><span>reduzido</span><span>máximo</span></div>
                <p>Nível {p.riscoIncendio} em 5 na escala do IPMA.</p>
              </div>
            )}
          </div>
        </section>
      )}
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
