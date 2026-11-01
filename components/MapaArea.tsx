import type { NivelAviso } from "@/lib/data";
import { AREAS_AVISO } from "@/lib/data";
import { AREAS_MAPA } from "@/lib/mapa-avisos";

// Nos Açores, os grupos aproximam-se uns dos outros (só encurta o mar entre eles), para as ilhas ficarem maiores
const DESLOCAR: Record<string, [number, number]> = { AOC: [85, 25], AOR: [-40, -45] };

// Caixa à volta de todas as formas do painel, com uma margem (corta o mar que sobra)
function caixa(formas: { d: string; id: string }[], margem: number): [number, number, number, number] {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const f of formas) {
    const [dx, dy] = DESLOCAR[f.id] ?? [0, 0];
    const n = f.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    for (let i = 0; i + 1 < n.length; i += 2) {
      x0 = Math.min(x0, n[i] + dx); x1 = Math.max(x1, n[i] + dx);
      y0 = Math.min(y0, n[i + 1] + dy); y1 = Math.max(y1, n[i + 1] + dy);
    }
  }
  return [x0 - margem, x1 + margem, y0 - margem, y1 + margem];
}

// A ilha da Madeira é uma só forma; as três zonas dela marcam-se com um ponto por cima
const ZONAS_MADEIRA = ["MCN", "MCS", "MRM"];

// Silhueta da região com a área de aviso destacada (na cor do aviso, ou azul se não houver)
export function MapaArea({ id, nivel }: { id: string; nivel: NivelAviso }) {
  const area = AREAS_MAPA.find((a) => a.id === id);
  if (!area) return null;
  const nome = area.painel;
  const formas = AREAS_MAPA.filter((a) => a.painel === nome && a.d);
  const [x0, x1, y0, y1] = caixa(formas, nome === "continente" ? 4 : 8);
  const w = x1 - x0, h = y1 - y0;
  const zonaMadeira = ZONAS_MADEIRA.includes(id);
  const destacada = zonaMadeira ? "MADEIRA" : id;
  const cor = nivel === "green" ? "sel" : nivel;

  return (
    <figure className={`area-mapa area-mapa-${nome}`}>
      <svg preserveAspectRatio={nome === "continente" ? "xMidYMid meet" : "xMaxYMid meet"} viewBox={`${x0} ${y0} ${w} ${h}`} role="img" aria-label={`Localização: ${AREAS_AVISO[id]?.nome ?? id}`}>
        {formas.map((a) => (
          <path key={a.id} d={a.d} transform={DESLOCAR[a.id] ? `translate(${DESLOCAR[a.id].join(" ")})` : undefined} className={a.id === destacada ? `am-forma ${cor}` : "am-forma"} />
        ))}
        {zonaMadeira && <circle cx={area.c[0]} cy={area.c[1]} r={6} className="am-ponto" />}
      </svg>
    </figure>
  );
}
