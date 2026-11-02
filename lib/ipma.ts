// Leitura da API de dados abertos do IPMA (api.ipma.pt).
// Os pedidos são feitos no servidor e guardados em cache, para não sobrecarregar o IPMA.

import { getLocal, TIPOS_TEMPO, type Aviso, type Dia, type Hora, type Local, type NivelAviso } from "./data";
import { diaSemana, hora, horaAtual, quandoDia } from "./format";
import { criarNoite } from "./sol";

const OPEN = "https://api.ipma.pt/open-data";
const PUBLIC = "https://api.ipma.pt/public-data";

// De quanto em quanto tempo se voltam a pedir os dados ao IPMA (em segundos)
export const CACHE = {
  avisos: 30 * 60, // podem mudar a qualquer hora
  previsao: 60 * 60,
  mar: 60 * 60,
  incendio: 6 * 60 * 60, // o IPMA publica-o uma vez por dia
  fixo: 24 * 60 * 60, // lista das zonas de mar
};

async function obter<T>(url: string, segundos: number): Promise<T> {
  const res = await fetch(url, { next: { revalidate: segundos } });
  if (!res.ok) throw new Error(`IPMA respondeu ${res.status} para ${url}`);
  return res.json() as Promise<T>;
}

// A API usa -99 para "sem valor" e envia números como texto.
function n(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const x = Number(v);
  return Number.isFinite(x) && x > -90 ? x : null;
}

export function fuso(local: Local): string {
  return local.regiao === "Açores" ? "Atlantic/Azores" : local.regiao === "Madeira" ? "Atlantic/Madeira" : "Europe/Lisbon";
}

type Agregado = {
  idPeriodo: number;
  dataPrev: string;
  dataUpdate: string;
  tMed?: string;
  tMin?: string;
  tMax?: string;
  hR?: string;
  utci?: string;
  ffVento?: string;
  ddVento?: string;
  idFfxVento?: number;
  idIntensidadePrecipita?: number;
  idTipoTempo?: number;
  probabilidadePrecipita?: string;
  iUv?: string;
  ondulacao?: string;
  dirOndulacao?: string;
  periodOndulacao?: string;
  tempAguaMar?: string;
};

export type Previsao = {
  local: Local;
  atualizado: string; // dataUpdate do IPMA
  agora: string;
  fuso: string;
  resumo: { titulo: string; destaque: string; texto: string };
  atual: { temp: number; humidade: number | null; vento: number | null; dirVento: string; sensacao: number | null };
  uv: number | null;
  probChuvaHoje: number | null;
  // Ondas do próprio local; nos da costa sem ondas próprias, da zona de mar mais próxima (zona e ondaMin preenchidos)
  mar: { onda: number; dirOnda: string; periodo: number | null; agua: number | null; zona?: string; ondaMin?: number } | null;
  riscoIncendio: number | null; // 1 a 5
  horas: Hora[];
  pontos: Hora[]; // horas e, depois delas, valores de 3 em 3 horas
  dias: Dia[];
};

const DIRECOES: Record<string, string> = {
  N: "norte", NE: "nordeste", E: "leste", SE: "sudeste", S: "sul", SW: "sudoeste", W: "oeste", NW: "noroeste",
};
export const INTENSIDADE_VENTO: Record<number, string> = { 1: "fraco", 2: "moderado", 3: "forte", 4: "muito forte" };

export function direcaoExtenso(d: string): string {
  return DIRECOES[d] ?? d;
}

function montarResumo(dias: Dia[], horas: Hora[], vento: { dir: string; classe: number | null }) {
  const hoje = dias[0];
  const desc = TIPOS_TEMPO[hoje.tipoTempo] ?? "Previsão para hoje";
  const frases: string[] = [];

  const deHoje = horas.filter((h) => h.hora.slice(0, 10) === hoje.data);
  const pico = deHoje.length > 3 ? deHoje.reduce((a, b) => (b.temp > a.temp ? b : a)) : null;
  frases.push(`Mínima de ${Math.round(hoje.tMin)}°${pico ? `, com a temperatura mais alta por volta das ${hora(pico.hora)}h` : ""}.`);

  if (hoje.probChuva >= 40) {
    frases.push(`Probabilidade de chuva de ${hoje.probChuva}% hoje.`);
  } else {
    const i = dias.findIndex((d, k) => k > 0 && d.probChuva >= 40);
    if (i === 1) frases.push("Sem chuva hoje, mas deve chover amanhã.");
    else if (i > 1) frases.push(`Sem chuva até ${diaSemana(dias[i - 1].data)}. A chuva deve chegar ${quandoDia(dias[i].data)}.`);
    else frases.push(`Sem chuva prevista nos próximos ${dias.length} dias.`);
  }

  if (vento.dir) {
    const forca = vento.classe ? INTENSIDADE_VENTO[vento.classe] : null;
    frases.push(`Vento${forca ? ` ${forca}` : ""} de ${direcaoExtenso(vento.dir)}.`);
  }

  return { titulo: `${desc}, máxima de`, destaque: `${Math.round(hoje.tMax)}°`, texto: frases.join(" ") };
}

export async function getPrevisao(slug: string): Promise<Previsao | null> {
  const local = getLocal(slug);
  if (!local) return null;

  type Rcm = { dataPrev: string; local: Record<string, { data: { rcm: number } }> };
  const rcmDia = (d: 0 | 1) =>
    local.regiao === "Continente" ? obter<Rcm>(`${OPEN}/forecast/meteorology/rcm/rcm-d${d}.json`, CACHE.incendio).catch(() => null) : Promise.resolve(null);
  const [agregado, rcm, rcm1] = await Promise.all([
    obter<Agregado[]>(`${PUBLIC}/forecast/aggregate/${local.globalIdLocal}.json`, CACHE.previsao),
    rcmDia(0),
    rcmDia(1),
  ]);
  if (!agregado.length) return null;

  const agora = horaAtual(fuso(local));
  const horarias = agregado.filter((a) => a.idPeriodo === 1);
  // Todas as horas disponíveis: o gráfico escolhe as 48 seguintes no navegador.
  const eNoite = criarNoite(local.lat, local.lon, fuso(local));
  const ponto = (a: Agregado, passo: 1 | 3): Hora => ({
    hora: a.dataPrev.slice(0, 16),
    temp: n(a.tMed) ?? 0,
    probChuva: n(a.probabilidadePrecipita),
    vento: n(a.ffVento) ?? 0,
    dirVento: a.ddVento ?? "",
    tipoTempo: a.idTipoTempo ?? 0,
    humidade: n(a.hR),
    noite: eNoite(a.dataPrev.slice(0, 16)),
    passo,
    sensacao: n(a.utci),
    onda: n(a.ondulacao),
    dirOnda: a.dirOndulacao ?? "",
    periodoOnda: n(a.periodOndulacao),
    agua: n(a.tempAguaMar),
  });
  const horas: Hora[] = horarias.map((a) => ponto(a, 1));
  const ultimaHora = horas.at(-1)?.hora ?? "";
  const pontos: Hora[] = [
    ...horas,
    ...agregado.filter((a) => a.idPeriodo === 3 && a.dataPrev.slice(0, 16) > ultimaHora).map((a) => ponto(a, 3)),
  ];

  const diarias = agregado.filter((a) => a.idPeriodo === 24);
  const dico = String(local.globalIdLocal).slice(1, 5);
  const risco = new Map<string, number>();
  for (const r of [rcm, rcm1]) {
    const v = r?.local[dico]?.data.rcm;
    if (r && v) risco.set(r.dataPrev.slice(0, 10), v);
  }
  const dias: Dia[] = diarias.map((a) => ({
    data: a.dataPrev.slice(0, 10),
    tMin: n(a.tMin) ?? 0,
    tMax: n(a.tMax) ?? 0,
    probChuva: Math.round(n(a.probabilidadePrecipita) ?? 0),
    tipoTempo: a.idTipoTempo ?? 0,
    dirVento: a.ddVento ?? "",
    ventoClasse: a.idFfxVento ?? null,
    uv: n(a.iUv),
    intensidade: a.idIntensidadePrecipita ?? null,
    riscoIncendio: risco.get(a.dataPrev.slice(0, 10)) ?? null,
  }));
  if (!dias.length) return null;

  const atualH = horarias.find((a) => a.dataPrev.slice(0, 16) === agora) ?? horarias.find((a) => a.dataPrev.slice(0, 16) > agora) ?? horarias[horarias.length - 1];
  const hojeD = diarias[0];
  const onda = n(atualH?.ondulacao);

  return {
    local,
    atualizado: agregado[0].dataUpdate,
    agora: atualH?.dataPrev.slice(0, 16) ?? agora,
    fuso: fuso(local),
    resumo: montarResumo(dias, horas, { dir: hojeD.ddVento ?? "", classe: hojeD.idFfxVento ?? null }),
    atual: {
      temp: n(atualH?.tMed) ?? 0,
      humidade: n(atualH?.hR),
      vento: n(atualH?.ffVento),
      dirVento: atualH?.ddVento ?? "",
      sensacao: n(atualH?.utci),
    },
    uv: n(hojeD.iUv),
    probChuvaHoje: n(hojeD.probabilidadePrecipita),
    mar: onda !== null ? { onda, dirOnda: atualH?.dirOndulacao ?? "", periodo: n(atualH?.periodOndulacao), agua: n(atualH?.tempAguaMar) } : await marMaisProximo(local),
    riscoIncendio: rcm?.local[dico]?.data.rcm ?? null,
    horas,
    pontos,
    dias,
  };
}

type AvisoRaw = { idAreaAviso: string; awarenessTypeName: string; awarenessLevelID: NivelAviso; startTime: string; endTime: string; text: string };

// Todos os avisos ainda válidos, incluindo os verdes (um por tipo e área)
export async function getTodosAvisos(): Promise<Aviso[]> {
  const raw = await obter<AvisoRaw[]>(`${OPEN}/forecast/warnings/warnings_www.json`, CACHE.avisos);
  const agora = horaAtual();
  return raw
    .filter((a) => a.endTime.slice(0, 16) > agora)
    .map((a) => ({
      idAreaAviso: a.idAreaAviso,
      tipo: a.awarenessTypeName,
      nivel: a.awarenessLevelID,
      inicio: a.startTime.slice(0, 16),
      fim: a.endTime.slice(0, 16),
      texto: a.text,
    }))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

// Só os avisos amarelos, laranja e vermelhos
export async function getAvisos(): Promise<Aviso[]> {
  return (await getTodosAvisos()).filter((a) => a.nivel !== "green");
}

const ORDEM_REGIOES: Local["regiao"][] = ["Continente", "Madeira", "Açores"];

export type ZonaMar = { id: number; zona: string; regiao: Local["regiao"]; lon: number; ondaMin: number; ondaMax: number; dir: string; aguaMin: number | null; aguaMax: number | null; lat: number };

// Locais na costa para os quais o IPMA não dá ondas na previsão do local (os do interior ficam sem mar)
const COSTA_SEM_ONDAS = ["porto", "faro", "aveiro", "portimao"];

// Zona de mar mais próxima de um local da costa sem ondas próprias, a partir da previsão diária do mar
async function marMaisProximo(local: Local): Promise<Previsao["mar"]> {
  if (!COSTA_SEM_ONDAS.includes(local.slug)) return null;
  const zonas = (await getMar().catch(() => null))?.zonas.filter((z) => z.regiao === local.regiao) ?? [];
  if (zonas.length === 0) return null;
  const cos = Math.cos((local.lat * Math.PI) / 180);
  const dist = (z: ZonaMar) => (z.lat - local.lat) ** 2 + ((z.lon - local.lon) * cos) ** 2;
  const z = zonas.reduce((m, x) => (dist(x) < dist(m) ? x : m));
  return { onda: z.ondaMax, ondaMin: z.ondaMin, dirOnda: z.dir, periodo: null, agua: z.aguaMax, zona: z.zona };
}

export async function getMar(): Promise<{ data: string; zonas: ZonaMar[] }> {
  type Loc = { globalIdLocal: number; local: string; latitude: string; longitude: string; idRegiao: number };
  type Prev = { globalIdLocal: number; waveHighMin: string; waveHighMax: string; predWaveDir: string; sstMin: string; sstMax: string };
  const [locs, prev] = await Promise.all([
    obter<Loc[]>(`${OPEN}/sea-locations.json`, CACHE.fixo),
    obter<{ forecastDate: string; data: Prev[] }>(`${OPEN}/forecast/oceanography/daily/hp-daily-sea-forecast-day0.json`, CACHE.mar),
  ]);
  const regiao = (id: number): Local["regiao"] => (id >= 3000000 ? "Açores" : id >= 2000000 ? "Madeira" : "Continente");
  const zonas = prev.data
    .map((p) => {
      const l = locs.find((x) => x.globalIdLocal === p.globalIdLocal);
      return {
        id: p.globalIdLocal,
        lon: Number(l?.longitude ?? 0),
        zona: (l?.local ?? String(p.globalIdLocal)).replace(/,\s*costa$/i, ""),
        regiao: regiao(p.globalIdLocal),
        ondaMin: n(p.waveHighMin) ?? 0,
        ondaMax: n(p.waveHighMax) ?? 0,
        dir: p.predWaveDir,
        aguaMin: n(p.sstMin),
        aguaMax: n(p.sstMax),
        lat: Number(l?.latitude ?? 0),
      };
    })
    .sort((a, b) => ORDEM_REGIOES.indexOf(a.regiao) - ORDEM_REGIOES.indexOf(b.regiao) || b.lat - a.lat);
  return { data: prev.forecastDate, zonas };
}
