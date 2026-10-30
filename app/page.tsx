import { ForecastView } from "@/components/ForecastView";
import { getPrevisao, LOCAL_PADRAO } from "@/lib/data";

export default function HomePage() {
  const p = getPrevisao(LOCAL_PADRAO)!;
  return (
    <div className="wrap">
      <ForecastView p={p} />
    </div>
  );
}
