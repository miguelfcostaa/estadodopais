import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvisoIcon } from "@/components/AvisoIcon";
import { BackLink } from "@/components/BackLink";
import { MapaArea } from "@/components/MapaArea";
import { AREAS_AVISO, LOCAIS, type NivelAviso } from "@/lib/data";
import { intervalo, nomeNivel } from "@/lib/avisos";
import { getTodosAvisos } from "@/lib/ipma";

export const revalidate = 43200; // 12 horas

type Props = { params: Promise<{ area: string }> };

const TIPOS = ["Precipitação", "Vento", "Trovoada", "Nevoeiro", "Agitação Marítima", "Neve", "Tempo Quente", "Tempo Frio"];
const ORDEM: NivelAviso[] = ["green", "yellow", "orange", "red"];

export function generateStaticParams() {
  return Object.keys(AREAS_AVISO).map((id) => ({ area: id.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const a = AREAS_AVISO[area.toUpperCase()];
  return { title: a ? `Avisos - ${a.nome}` : "Área não encontrada" };
}

export default async function AreaPage({ params }: Props) {
  const { area } = await params;
  const id = area.toUpperCase();
  const info = AREAS_AVISO[id];
  if (!info) notFound();

  const todos = (await getTodosAvisos()).filter((a) => a.idAreaAviso === id);
  const ativos = todos.filter((a) => a.nivel !== "green");
  const pior = ativos.reduce<NivelAviso>((m, a) => (ORDEM.indexOf(a.nivel) > ORDEM.indexOf(m) ? a.nivel : m), "green");
  const locais = LOCAIS.filter((l) => l.idAreaAviso === id);

  return (
    <div className="wrap">
      <div className="page-head area-head">
        <div>
        <BackLink href="/avisos" label="Voltar para avisos" />
        <span className="label"><i className={`lvl ${pior}`} /> {info.regiao}</span>
        <h1>{info.nome}</h1>
        <p className="warn-lead">
          {ativos.length === 0 ? (
            "Sem avisos nos próximos 3 dias."
          ) : (
            <>
              {ativos.map((a, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  <b className={a.nivel}>Aviso {nomeNivel(a.nivel)} por {a.tipo.toLowerCase()}, {intervalo(a)}.</b>
                </span>
              ))}
            </>
          )}
        </p>
        </div>
        <MapaArea id={id} nivel={pior} />
      </div>

      <section className="section" aria-labelledby="h-tipos">
        <div className="sec-head"><h2 id="h-tipos">Por tipo de aviso</h2><span className="label">próximos 3 dias</span></div>
        <ul className="types">
          {TIPOS.map((t) => {
            const deste = todos.filter((a) => a.tipo === t);
            const comAviso = deste.filter((a) => a.nivel !== "green");
            return (
              <li key={t} className={comAviso.length ? "alert" : undefined}>
                <span className="type-name"><AvisoIcon tipo={t} />{t}</span>
                {comAviso.length === 0 ? (
                  <span className="type-state"><i className="lvl green" /> sem aviso</span>
                ) : (
                  <div className="type-alerts">
                    {comAviso.map((a, i) => (
                      <div key={i} className={`warn-item ${a.nivel}`}>
                        <span className="label">{intervalo(a)}</span>
                        {a.texto && <p>{a.texto}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {locais.length > 0 && (
        <section className="section" aria-labelledby="h-locais">
          <div className="sec-head"><h2 id="h-locais">Previsão nesta zona</h2></div>
          <div className="chips">
            {locais.map((l) => (
              <Link key={l.slug} className="chip chip-link" href={`/local/${l.slug}`}>{l.nome} →</Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
