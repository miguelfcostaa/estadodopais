import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DayColumns } from "@/components/DayColumns";
import { getLocal, LOCAIS } from "@/lib/data";
import { horaDe } from "@/lib/format";
import { getPrevisao } from "@/lib/ipma";

export const revalidate = 43200; // 12 horas

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCAIS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const local = getLocal(slug);
  return { title: local ? `10 dias em ${local.nome}` : "Local não encontrado" };
}

export default async function DiasPage({ params }: Props) {
  const { slug } = await params;
  const local = getLocal(slug);
  if (!local) notFound();
  const p = await getPrevisao(slug);
  if (!p) notFound();

  return (
    <div className="wrap">
      <div className="page-head">
        <Link className="back mono" href={`/local/${local.slug}`}>← Voltar para {local.nome}</Link>
        <h1>{p.dias.length} dias em {local.nome}</h1>
        <p>Previsão dia a dia: tempo, temperaturas mínima e máxima, chuva e vento.</p>
        <p className="source mono">Previsão do IPMA atualizada às {horaDe(p.atualizado)}</p>
      </div>

      <section className="section" aria-labelledby="h-dias">
        <div className="sec-head">
          <h2 id="h-dias">Dia a dia</h2>
          <span className="label">a mesma escala de temperatura em todos os dias</span>
        </div>
        <DayColumns dias={p.dias} />
        <div className="after-days">
          <Link className="more" href={`/local/${local.slug}/horas`}>Ver previsão das próximas 48 horas →</Link>
        </div>
      </section>
    </div>
  );
}
