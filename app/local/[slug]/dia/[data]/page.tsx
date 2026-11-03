import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { DayColumns } from "@/components/DayColumns";
import { FactIcon, type NomeIcone } from "@/components/FactIcon";
import { Meteogram } from "@/components/Meteogram";
import { WeatherIcon } from "@/components/WeatherIcon";
import { AREAS_AVISO, getLocal, RISCO_INCENDIO, TIPOS_TEMPO, emLocal, paraLocal } from "@/lib/data";
import { intervalo as quandoAviso, nomeNivel } from "@/lib/avisos";
import { estatisticas, INTENSIDADE_CHUVA, momentosDoDia, pontosDoDia, resumoDia } from "@/lib/dia";
import { dataExtensa, graus, num, nivelUV } from "@/lib/format";
import { direcaoExtenso, fuso, getAvisos, getPrevisao, INTENSIDADE_VENTO } from "@/lib/ipma";
import { solDoDia } from "@/lib/sol";

export const revalidate = 1800; // 30 minutos (tem avisos)

type Props = { params: Promise<{ slug: string; data: string }> };

// As datas mudam todos os dias: as páginas são geradas no primeiro pedido e guardadas em cache.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, data } = await params;
  const local = getLocal(slug);
  if (!local || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return { title: "Dia não encontrado" };
  return {
    title: `Tempo ${emLocal(local)}, ${dataExtensa(data).toLowerCase()}`,
    description: `Previsão do tempo ${paraLocal(local)}, ${dataExtensa(data).toLowerCase()}: máxima e mínima, chuva, vento, nascer e pôr do sol. Dados do IPMA.`,
    alternates: { canonical: `/local/${local.slug}/dia/${data}` },
  };
}

const intervaloTexto = (v: [number, number] | null, unidade = "") =>
  v ? (Math.round(v[0]) === Math.round(v[1]) ? `${Math.round(v[0])}${unidade}` : `${Math.round(v[0])}–${Math.round(v[1])}${unidade}`) : null;

export default async function DiaPage({ params }: Props) {
  const { slug, data } = await params;
  const local = getLocal(slug);
  if (!local || !/^\d{4}-\d{2}-\d{2}$/.test(data)) notFound();
  const [p, avisos] = await Promise.all([getPrevisao(slug), getAvisos()]);
  const dia = p?.dias.find((d) => d.data === data);
  if (!p || !dia) notFound();

  const pontos = pontosDoDia(p.pontos, data);
  const momentos = momentosDoDia(pontos);
  const est = estatisticas(pontos);
  const passo = pontos[0]?.passo ?? 1;
  const indice = p.dias.indexOf(dia);
  const anterior = p.dias[indice - 1];
  const seguinte = p.dias[indice + 1];
  const avisosDia = avisos.filter((a) => a.idAreaAviso === local.idAreaAviso && a.inicio < `${data}T24:00` && a.fim > `${data}T00:00`);

  const sol = solDoDia(data, local.lat, local.lon, fuso(local));
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const luz = sol ? sol.por - sol.nascer : 0;

  const factos: ({ icone: NomeIcone; label: string; valor: string; unidade?: string; nota?: string } | null)[] = [
    { icone: "temperatura", label: "Máxima", valor: graus(dia.tMax) },
    { icone: "temperatura", label: "Mínima", valor: graus(dia.tMin) },
    { icone: "chuva", label: "Chuva", valor: `${dia.probChuva}`, unidade: "%", nota: dia.intensidade ? `intensidade ${INTENSIDADE_CHUVA[dia.intensidade]}` : undefined },
    dia.dirVento
      ? { icone: "vento", label: "Vento", valor: dia.ventoClasse ? INTENSIDADE_VENTO[dia.ventoClasse] : "—", unidade: dia.dirVento, nota: est.ventoMax ? `até ${Math.round(est.ventoMax.valor)} km/h às ${est.ventoMax.hora}h` : `de ${direcaoExtenso(dia.dirVento)}` }
      : null,
    est.humidade ? { icone: "humidade", label: "Humidade", valor: intervaloTexto(est.humidade)!, unidade: "%" } : null,
    est.sensacao ? { icone: "sensacao", label: "Sensação térmica", valor: intervaloTexto(est.sensacao, "°")! } : null,
    dia.uv != null ? { icone: "uv", label: "Índice UV", valor: num(dia.uv), unidade: nivelUV(dia.uv) } : null,
    est.onda ? { icone: "ondas", label: "Ondas", valor: intervaloTexto([est.onda[0] * 10, est.onda[1] * 10])!.replace(/(\d+)/g, (x) => num(Number(x) / 10)), unidade: `m · ${est.dirOnda}`, nota: est.periodoOnda ? `período de ${intervaloTexto(est.periodoOnda, " s")}` : undefined } : null,
    est.agua ? { icone: "agua", label: "Água do mar", valor: intervaloTexto(est.agua, "°")! } : null,
    sol ? { icone: "nascer", label: "Nascer do sol", valor: hm(sol.nascer) } : null,
    sol ? { icone: "por", label: "Pôr do sol", valor: hm(sol.por), nota: `${Math.floor(luz / 60)}h${String(luz % 60).padStart(2, "0")} de luz` } : null,
    dia.riscoIncendio ? { icone: "fogo", label: "Risco de incêndio", valor: RISCO_INCENDIO[dia.riscoIncendio - 1], nota: `nível ${dia.riscoIncendio} em 5` } : null,
  ];
  const visiveis = factos.filter((f) => f !== null);

  return (
    <div className="wrap">
      <div className="page-head">
        <BackLink href={`/local/${local.slug}`} label={`Voltar para ${local.nome}`} />
        <div className="dia-titulo">
          <div>
            <h1>{dataExtensa(data)}</h1>
            <p className="dia-local">{local.nome} · {TIPOS_TEMPO[dia.tipoTempo]}</p>
          </div>
          <WeatherIcon tipo={dia.tipoTempo} size={112} />
        </div>
        <p>{resumoDia(dia, pontos, momentos)}</p>
        <nav className="dia-nav" aria-label="Outros dias">
          {anterior ? <Link className="more" href={`/local/${local.slug}/dia/${anterior.data}`}>← {dataExtensa(anterior.data).split(",")[0]}</Link> : <span />}
          {seguinte && <Link className="more" href={`/local/${local.slug}/dia/${seguinte.data}`}>{dataExtensa(seguinte.data).split(",")[0]} →</Link>}
        </nav>
      </div>

      <section className="section sem-linha" aria-label="Resumo do dia">
        <dl className="facts facts-wide">
          {visiveis.map((f) => (
            <div key={f.label}>
              <dt className="label"><FactIcon nome={f.icone} />{f.label}</dt>
              <dd className="num">{f.valor}{f.unidade && <small>{f.unidade}</small>}</dd>
              {f.nota && <dd className="fact-note">{f.nota}</dd>}
            </div>
          ))}
        </dl>
      </section>

      {momentos.length > 0 ? (
        <>
          <section className="section" aria-labelledby="h-momentos">
            <div className="sec-head"><h2 id="h-momentos">Ao longo do dia</h2><span className="label">madrugada · manhã · tarde · noite</span></div>
            <ol className="moments">
              {momentos.map((m) => (
                <li key={m.nome}>
                  <span className="label">{m.nome} <span className="mono">{String(m.inicio).padStart(2, "0")}h–{String(m.fim).padStart(2, "0")}h</span></span>
                  <div className="moment-wx"><WeatherIcon tipo={m.tipoTempo} size={36} noite={m.noite} /><span>{TIPOS_TEMPO[m.tipoTempo]}</span></div>
                  <div className="moment-temp num">{intervaloTexto([m.tMin, m.tMax], "°")}</div>
                  <div className="moment-meta">
                    <span className={m.probChuva && m.probChuva >= 20 ? "wet" : undefined}>Chuva {m.probChuva === null ? "—" : `${Math.round(m.probChuva)}%`}</span>
                    <span>Vento {Math.round(m.vento)} km/h {m.dirVento}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="section" aria-labelledby="h-grafico">
            <div className="sec-head"><h2 id="h-grafico">{passo === 3 ? "De 3 em 3 horas" : "Hora a hora"}</h2><span className="label">{local.nome}</span></div>
            <Meteogram horas={pontos} agora={p.agora} fuso={p.fuso} aPartirDeAgora={false} />
          </section>
        </>
      ) : (
        <section className="section">
          <p className="summary">Para este dia o IPMA só publica o resumo diário. Os valores ao longo do dia aparecem quando o dia estiver mais próximo.</p>
        </section>
      )}

      <section className="section" aria-labelledby="h-avisos-dia">
        <div className="sec-head"><h2 id="h-avisos-dia">Avisos</h2><span className="label">{AREAS_AVISO[local.idAreaAviso]?.nome}</span></div>
        {avisosDia.length === 0 ? (
          <p className="summary">Sem avisos para {AREAS_AVISO[local.idAreaAviso]?.nome ?? local.nome} neste dia.</p>
        ) : (
          <div className="warn-list">
            {avisosDia.map((a, i) => (
              <div key={i} className={`warn-item ${a.nivel}`}>
                <span className="label">{a.tipo} · {nomeNivel(a.nivel)}</span>
                {a.texto && <p>{a.texto}</p>}
                <p className="mono">{quandoAviso(a)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="h-outros">
        <div className="sec-head"><h2 id="h-outros">Outros dias</h2></div>
        <DayColumns dias={p.dias} slug={local.slug} atual={data} carrossel />
      </section>
    </div>
  );
}
