import type { Metadata } from "next";
import { MapaMar } from "@/components/MapaMar";
import { getMar } from "@/lib/ipma";
import { dataLonga, num } from "@/lib/format";

export const metadata: Metadata = {
  title: "Estado do mar em Portugal",
  description: "Altura e direção das ondas e temperatura da água em toda a costa de Portugal, Madeira e Açores. Dados do IPMA.",
  alternates: { canonical: "/mar" },
};
export const revalidate = 43200; // 12 horas

export default async function MarPage() {
  const { data, zonas } = await getMar();
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="label">{dataLonga(data)}</span>
        <h1>Estado do mar</h1>
        <p>Altura das ondas e temperatura da água ao longo da costa, do continente aos Açores.</p>
      </div>
      <section className="section" aria-labelledby="h-mapa">
        <div className="sec-head"><h2 id="h-mapa">No mapa</h2><span className="label">ondas em metros · água em °C</span></div>
        <MapaMar zonas={zonas} />
        <p className="mapa-nota mono">A seta mostra para onde seguem as ondas. Valores previstos pelo IPMA para hoje. Contornos: Natural Earth.</p>
      </section>
      <section className="section" aria-labelledby="h-costa">
        <div className="sec-head"><h2 id="h-costa">Em detalhe</h2><span className="label">ondas em metros · água em °C</span></div>
        <div className="table-scroll">
          <table className="data">
            <thead>
              <tr>
                <th className="label">Zona</th>
                <th className="label col-wide">Região</th>
                <th className="label r">Ondas</th>
                <th className="label col-wide">Direção</th>
                <th className="label r">Água</th>
              </tr>
            </thead>
            <tbody>
              {zonas.map((z) => (
                <tr key={z.zona}>
                  <td>{z.zona}</td>
                  <td className="mono col-wide">{z.regiao}</td>
                  <td className="r">{num(z.ondaMin)}–{num(z.ondaMax)}<span className="unit-m"> m</span> <span className="mono dir-inline">{z.dir}</span></td>
                  <td className="mono col-wide">{z.dir}</td>
                  <td className="r">{z.aguaMin !== null && z.aguaMax !== null ? `${num(z.aguaMin)}–${num(z.aguaMax)}°` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
