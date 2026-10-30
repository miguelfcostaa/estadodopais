import { cookies } from "next/headers";
import { ForecastView } from "@/components/ForecastView";
import { GeoLocal } from "@/components/GeoLocal";
import { getLocal, LOCAL_PADRAO } from "@/lib/data";
import { getAvisos, getPrevisao } from "@/lib/ipma";
import { COOKIE_DIST, COOKIE_LOCAL } from "@/lib/preferencias";

// A página inicial mostra o local guardado no navegador (ou Lisboa).
// Os dados do IPMA continuam em cache durante 12 horas (ver lib/ipma.ts).
export default async function HomePage() {
  const c = await cookies();
  const guardado = c.get(COOKIE_LOCAL)?.value;
  const slug = guardado && getLocal(guardado) ? guardado : LOCAL_PADRAO;
  const dist = Number(c.get(COOKIE_DIST)?.value);

  const [p, avisos] = await Promise.all([getPrevisao(slug), getAvisos()]);
  if (!p) throw new Error("Sem previsão para o local escolhido");
  return (
    <div className="wrap">
      <ForecastView p={p} avisos={avisos} distancia={guardado === slug && Number.isFinite(dist) && dist > 0 ? dist : undefined} />
      <GeoLocal temLocal={!!guardado} />
    </div>
  );
}
