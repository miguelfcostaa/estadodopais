import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ForecastView } from "@/components/ForecastView";
import { LocalPicker } from "@/components/LocalPicker";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { getLocal, getPrevisao, LOCAIS } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCAIS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const local = getLocal(slug);
  return { title: local ? `Tempo em ${local.nome}` : "Local não encontrado" };
}

export default async function LocalPage({ params }: Props) {
  const { slug } = await params;
  const local = getLocal(slug);
  if (!local) notFound();
  const p = getPrevisao(slug);

  return (
    <div className="wrap">
      <PrototypeBanner />
      {p ? (
        <ForecastView p={p} />
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
            <p>No protótipo só Lisboa tem dados. A previsão de {local.nome} aparece aqui quando o site estiver ligado à API do IPMA.</p>
            <Link className="more" href="/local/lisboa">Ver Lisboa →</Link>
          </div>
        </>
      )}
    </div>
  );
}
