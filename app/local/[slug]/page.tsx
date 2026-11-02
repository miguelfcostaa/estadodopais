import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ForecastView } from "@/components/ForecastView";
import { LocalPicker } from "@/components/LocalPicker";
import { getLocal, LOCAIS, emLocal, paraLocal } from "@/lib/data";
import { getAvisos, getPrevisao } from "@/lib/ipma";

export const revalidate = 1800; // 30 minutos (tem avisos)

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCAIS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const local = getLocal(slug);
  if (!local) return { title: "Local não encontrado" };
  return {
    title: `Tempo ${emLocal(local)}: hoje e próximos 10 dias`,
    description: `Previsão do tempo ${paraLocal(local)} hoje e nos próximos 10 dias: temperatura, chuva, vento, avisos, índice ultravioleta e risco de incêndio. Dados do IPMA.`,
    alternates: { canonical: `/local/${local.slug}` },
  };
}

export default async function LocalPage({ params }: Props) {
  const { slug } = await params;
  const local = getLocal(slug);
  if (!local) notFound();
  const [p, avisos] = await Promise.all([getPrevisao(slug), getAvisos()]);

  return (
    <div className="wrap">
      {p ? (
        <ForecastView p={p} avisos={avisos} />
      ) : (
        <>
          <div className="page-head">
            <div className="place">
              <span className="label">{local.regiao}</span>
              <LocalPicker atual={local.slug} />
            </div>
            <h1>{local.nome}</h1>
          </div>
          <div className="empty">
            <p>O IPMA não tem previsão disponível para {local.nome} neste momento. Volte a consultar mais tarde.</p>
            <Link className="more" href="/">Ver a previsão de Lisboa →</Link>
          </div>
        </>
      )}
    </div>
  );
}
