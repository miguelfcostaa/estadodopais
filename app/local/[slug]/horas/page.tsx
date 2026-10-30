import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HourlyTable } from "@/components/HourlyTable";
import { Meteogram } from "@/components/Meteogram";
import { getLocal, LOCAIS } from "@/lib/data";
import { getPrevisao } from "@/lib/ipma";

export const revalidate = 43200; // 12 horas

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCAIS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const local = getLocal(slug);
  return { title: local ? `Hora a hora em ${local.nome}` : "Local não encontrado" };
}

export default async function HorasPage({ params }: Props) {
  const { slug } = await params;
  const local = getLocal(slug);
  if (!local) notFound();
  const p = await getPrevisao(slug);
  if (!p) notFound();

  return (
    <div className="wrap">
      <div className="page-head">
        <Link className="back mono" href={`/local/${local.slug}`}>← Voltar para {local.nome}</Link>
        <h1>Hora a hora em {local.nome}</h1>
        <p>Temperatura, chuva, vento e humidade nas próximas 48 horas.</p>
      </div>

      <section className="section" aria-labelledby="h-graf">
        <div className="sec-head">
          <h2 id="h-graf">Próximas 48 horas</h2>
          <span className="label">{local.nome}</span>
        </div>
        <Meteogram horas={p.horas} agora={p.agora} fuso={p.fuso} />
        <p className="caption">
          <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 8c3 0 3-6 6-6s3 8 6 8 3-4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          Um meteograma: a linha é a temperatura prevista, as barras a probabilidade de chuva e as setas mostram para onde sopra o vento. O ponto marca a hora atual.
        </p>
      </section>

      <section className="section" aria-labelledby="h-tab">
        <div className="sec-head">
          <h2 id="h-tab">Em detalhe</h2>
          <span className="label">hora a hora</span>
        </div>
        <HourlyTable horas={p.horas} agora={p.agora} fuso={p.fuso} />
      </section>
    </div>
  );
}
