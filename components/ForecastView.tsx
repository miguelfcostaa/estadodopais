import Link from "next/link";
import type { Aviso } from "@/lib/data";
import { RISCO_INCENDIO } from "@/lib/data";
import type { Previsao } from "@/lib/ipma";
import { direcaoExtenso } from "@/lib/ipma";
import { dataLonga, graus, hora, num, nivelUV } from "@/lib/format";
import { DayColumns } from "./DayColumns";
import { FactIcon, type NomeIcone } from "./FactIcon";
import { LocalPicker } from "./LocalPicker";
import { WarningsGrid } from "./WarningsGrid";

export function ForecastView({ p, avisos, distancia }: { p: Previsao; avisos: Aviso[]; distancia?: number }) {
  const { local, resumo, atual, mar } = p;
  type Facto = { icone: NomeIcone; label: string; valor: string; unidade: string };
  const factos: (Facto | null)[] = [
    { icone: "temperatura", label: `Às ${hora(p.agora)}h`, valor: graus(atual.temp), unidade: "previsto" },
    atual.humidade !== null ? { icone: "humidade", label: "Humidade", valor: String(Math.round(atual.humidade)), unidade: "%" } : null,
    atual.vento !== null ? { icone: "vento", label: "Vento", valor: String(Math.round(atual.vento)), unidade: `km/h · ${atual.dirVento}` } : null,
    p.uv !== null ? { icone: "uv", label: "Índice UV", valor: num(p.uv), unidade: nivelUV(p.uv) } : null,
    mar ? { icone: "ondas", label: "Ondas", valor: num(mar.onda), unidade: `m · ${mar.dirOnda}` } : atual.sensacao !== null ? { icone: "sensacao", label: "Sensação", valor: graus(atual.sensacao), unidade: "térmica" } : null,
    mar?.agua != null ? { icone: "agua", label: "Água do mar", valor: graus(mar.agua), unidade: "" } : p.probChuvaHoje !== null ? { icone: "chuva", label: "Chuva hoje", valor: String(Math.round(p.probChuvaHoje)), unidade: "%" } : null,
  ];
  const visiveis = factos.filter((f): f is Facto => f !== null);

  return (
    <>
      <div className="place place-top">
        <span className="label">{dataLonga(p.agora)}</span>
        <LocalPicker atual={local.slug} />
        {distancia !== undefined && <span className="perto mono">Local mais próximo de si, a {distancia} km</span>}
      </div>
      <div className="lead">
        <div>
          <h1>
            {resumo.titulo} <em className="num">{resumo.destaque}</em>.
          </h1>
          <p className="summary">{resumo.texto}</p>
        </div>
        <dl className="facts">
          {visiveis.map((f) => (
            <div key={f.label}>
              <dt className="label">
                <FactIcon nome={f.icone} />
                {f.label}
              </dt>
              <dd className="num">
                {f.valor}
                {f.unidade && <small>{f.unidade}</small>}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="section" aria-labelledby="h-10">
        <div className="sec-head">
          <h2 id="h-10">Próximos dias</h2>
          <span className="label">próximos {p.dias.length} dias</span>
        </div>
        <DayColumns dias={p.dias} slug={local.slug} carrossel />
        <div className="after-days">
          <Link className="more" href={`/local/${local.slug}/horas`}>Ver previsão das próximas 48 horas →</Link>
        </div>
      </section>

      <section className="section" aria-labelledby="h-av">
        <div className="sec-head">
          <h2 id="h-av">Avisos</h2>
          <Link className="more" href="/avisos">Ver todos os avisos →</Link>
        </div>
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
