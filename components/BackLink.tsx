"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// "← Voltar" quando se chegou a partir da página inicial (?de=inicio);
// "← Voltar para <cidade>" quando se navega nas páginas de uma cidade.
function Conteudo({ slug, nome }: { slug: string; nome: string }) {
  const vemDoInicio = useSearchParams().get("de") === "inicio";
  return vemDoInicio ? (
    <Link className="back mono" href="/">← Voltar</Link>
  ) : (
    <Link className="back mono" href={`/local/${slug}`}>← Voltar para {nome}</Link>
  );
}

export function BackLink({ slug, nome }: { slug: string; nome: string }) {
  return (
    <Suspense fallback={<Link className="back mono" href={`/local/${slug}`}>← Voltar para {nome}</Link>}>
      <Conteudo slug={slug} nome={nome} />
    </Suspense>
  );
}
