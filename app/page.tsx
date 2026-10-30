import { ForecastView } from "@/components/ForecastView";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { getPrevisao, LOCAL_PADRAO } from "@/lib/data";

export default function HomePage() {
  const p = getPrevisao(LOCAL_PADRAO)!;
  return (
    <div className="wrap">
      <PrototypeBanner />
      <ForecastView p={p} />
    </div>
  );
}
