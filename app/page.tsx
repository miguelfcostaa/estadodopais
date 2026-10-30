import { ForecastView } from "@/components/ForecastView";
import { LOCAL_PADRAO } from "@/lib/data";
import { getAvisos, getPrevisao } from "@/lib/ipma";

export const revalidate = 43200; // 12 horas

export default async function HomePage() {
  const [p, avisos] = await Promise.all([getPrevisao(LOCAL_PADRAO), getAvisos()]);
  if (!p) throw new Error("Sem previsão para o local por defeito");
  return (
    <div className="wrap">
      <ForecastView p={p} avisos={avisos} naInicio />
    </div>
  );
}
