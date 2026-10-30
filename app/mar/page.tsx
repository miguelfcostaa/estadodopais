import type { Metadata } from "next";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { MAR_COSTA } from "@/lib/data";
import { num } from "@/lib/format";

export const metadata: Metadata = { title: "Mar" };

export default function MarPage() {
  return (
    <div className="wrap">
      <PrototypeBanner />
      <div className="page-head">
        <span className="label">Hoje</span>
        <h1>Estado do mar</h1>
        <p>Altura das ondas e temperatura da água ao longo da costa, do Minho aos Açores.</p>
      </div>
      <section className="section" aria-labelledby="h-costa">
        <div className="sec-head"><h2 id="h-costa">Ao longo da costa</h2><span className="label">ondas em metros · água em °C</span></div>
        <div className="table-scroll">
          <table className="data">
            <thead>
              <tr>
                <th className="label">Zona</th>
                <th className="label r">Ondas</th>
                <th className="label">Direção</th>
                <th className="label r">Água</th>
              </tr>
            </thead>
            <tbody>
              {MAR_COSTA.map((z) => (
                <tr key={z.zona}>
                  <td>{z.zona}</td>
                  <td className="r">{num(z.ondaMin)}–{num(z.ondaMax)} m</td>
                  <td className="mono">{z.dir}</td>
                  <td className="r">{num(z.aguaMin)}–{num(z.aguaMax)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
