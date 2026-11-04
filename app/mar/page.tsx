import type { Metadata } from "next";
import { MapaMar } from "@/components/MapaMar";
import { MarDias } from "@/components/MarDias";
import { getMar, type ZonaMar } from "@/lib/ipma";
import { dataCurta, dataLonga, diaSemana, num } from "@/lib/format";

export const metadata: Metadata = {
  title: "Estado do mar em Portugal",
  description: "Altura e direção das ondas e temperatura da água em toda a costa de Portugal, Madeira e Açores, hoje e nos próximos dois dias. Dados do IPMA.",
  alternates: { canonical: "/mar" },
};
export const revalidate = 3600; // 1 hora (mar)

// Uma das duas metades da tabela (lado a lado no computador, seguidas no telemóvel)
function TabelaMar({ zonas }: { zonas: ZonaMar[] }) {
  return (
    <div className="table-scroll">
      <table className="data">
        <thead>
          <tr>
            <th className="label c-zona">Zona</th>
            <th className="label col-wide c-reg">Região</th>
            <th className="label r c-ondas">Ondas</th>
            <th className="label col-wide col-dir">Direção</th>
            <th className="label r c-agua">Temperatura da água</th>
          </tr>
        </thead>
        <tbody>
          {zonas.map((z) => (
            <tr key={z.zona}>
              <td>{z.zona}</td>
              <td className="mono col-wide">{z.regiao}</td>
              <td className="r">{num(z.ondaMin)}–{num(z.ondaMax)}<span className="unit-m"> m</span> <span className="mono dir-inline">{z.dir}</span></td>
              <td className="mono col-wide col-dir">{z.dir}</td>
              <td className="r">{z.aguaMin !== null && z.aguaMax !== null ? `${num(z.aguaMin)}–${num(z.aguaMax)}°` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Mapa e tabela de um dia
function DiaMar({ zonas, quando }: { zonas: ZonaMar[]; quando: string }) {
  const metade = Math.ceil(zonas.length / 2);
  return (
    <>
      <section className="section" aria-label={`Mapa do mar, ${quando}`}>
        <div className="sec-head"><h2>No mapa</h2><span className="label">ondas em metros · água em °C</span></div>
        <MapaMar zonas={zonas} />
      </section>
      <section className="section" aria-label={`Tabela do mar, ${quando}`}>
        <div className="sec-head"><h2>Em detalhe</h2><span className="label">ondas em metros · água em °C</span></div>
        <div className="mar-tabelas">
          <TabelaMar zonas={zonas.slice(0, metade)} />
          <TabelaMar zonas={zonas.slice(metade)} />
        </div>
      </section>
    </>
  );
}

export default async function MarPage() {
  // Hoje, amanhã e depois de amanhã (se algum dia falhar no IPMA, fica de fora)
  const dias = (await Promise.all(([0, 1, 2] as const).map((d) => getMar(d).catch(() => null)))).filter((d) => d !== null);
  const rotulo = (data: string, i: number) => (i === 0 ? "Hoje" : i === 1 ? "Amanhã" : `${diaSemana(data).charAt(0).toUpperCase()}${diaSemana(data).slice(1)}, ${dataCurta(data)}`);
  const quando = (i: number) => (i === 0 ? "hoje" : i === 1 ? "amanhã" : diaSemana(dias[i].data).toLowerCase());
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="label">{dataLonga(dias[0].data)}</span>
        <h1>Estado do mar</h1>
        <p>Altura das ondas e temperatura da água ao longo da costa, do continente aos Açores, hoje e nos próximos dois dias.</p>
      </div>
      <MarDias rotulos={dias.map((d, i) => rotulo(d.data, i))}>
        {dias.map((d, i) => (
          <DiaMar key={d.data} zonas={d.zonas} quando={quando(i)} />
        ))}
      </MarDias>
    </div>
  );
}
