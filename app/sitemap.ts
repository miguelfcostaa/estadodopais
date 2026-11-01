import type { MetadataRoute } from "next";
import { AREAS_AVISO, LOCAIS } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

// Lista de páginas para os motores de busca (as páginas de cada dia ficam de fora: mudam todos os dias)
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  const pagina = (caminho: string, prioridade: number, frequencia: "hourly" | "daily" | "monthly") => ({
    url: `${SITE_URL}${caminho}`,
    lastModified: agora,
    changeFrequency: frequencia,
    priority: prioridade,
  });
  return [
    pagina("/", 1, "hourly"),
    pagina("/avisos", 0.9, "hourly"),
    pagina("/mar", 0.8, "daily"),
    pagina("/sobre", 0.3, "monthly"),
    ...LOCAIS.flatMap((l) => [pagina(`/local/${l.slug}`, 0.8, "hourly"), pagina(`/local/${l.slug}/horas`, 0.6, "hourly")]),
    ...Object.keys(AREAS_AVISO).map((id) => pagina(`/avisos/${id.toLowerCase()}`, 0.6, "hourly")),
  ];
}
