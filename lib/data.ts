// Tipos, listas fixas e tabelas de códigos da API de dados abertos do IPMA.

export type Local = {
  nome: string;
  slug: string;
  globalIdLocal: number;
  idAreaAviso: string;
  lat: number;
  lon: number;
  regiao: "Continente" | "Madeira" | "Açores";
};

export type Hora = {
  hora: string; // ISO local, ex. "2026-10-30T10:00"
  temp: number;
  probChuva: number | null; // null quando o IPMA envia -99
  vento: number; // km/h
  dirVento: string;
  tipoTempo: number;
  humidade: number | null;
  noite?: boolean; // entre o pôr e o nascer do sol
  passo?: 1 | 3; // horas entre este valor e o seguinte
  sensacao?: number | null;
  onda?: number | null;
  dirOnda?: string;
  periodoOnda?: number | null;
  agua?: number | null;
};

export type Dia = {
  data: string; // "2026-10-30"
  tMin: number;
  tMax: number;
  probChuva: number;
  tipoTempo: number;
  dirVento: string;
  ventoClasse: number | null; // 1 fraco a 4 muito forte
  uv?: number | null;
  intensidade?: number | null; // 0 sem precipitação a 3 forte
  riscoIncendio?: number | null; // 1 a 5, só hoje e amanhã no continente
};

export type NivelAviso = "green" | "yellow" | "orange" | "red";

export type Aviso = {
  idAreaAviso: string;
  tipo: string;
  nivel: NivelAviso;
  inicio: string;
  fim: string;
  texto: string;
};

export function slugify(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Lista de distrits-islands.json: nome, globalIdLocal, área de aviso, latitude, longitude
const LOCAIS_RAW: [string, number, string, number, number][] = [
  ["Aveiro", 1010500, "AVR", 40.6413, -8.6535],
  ["Beja", 1020500, "BJA", 38.02, -7.87],
  ["Braga", 1030300, "BRG", 41.5475, -8.4227],
  ["Guimarães", 1030800, "BRG", 41.4434, -8.2938],
  ["Bragança", 1040200, "BGC", 41.8076, -6.7606],
  ["Castelo Branco", 1050200, "CBO", 39.8217, -7.4957],
  ["Coimbra", 1060300, "CBR", 40.2081, -8.4194],
  ["Évora", 1070500, "EVR", 38.5701, -7.9104],
  ["Faro", 1080500, "FAR", 37.0146, -7.9331],
  ["Sagres", 1081505, "FAR", 37.0168, -8.9403],
  ["Portimão", 1081100, "FAR", 37.15, -8.52],
  ["Loulé", 1080800, "FAR", 37.1397, -8.0202],
  ["Guarda", 1090700, "GDA", 40.5379, -7.2647],
  ["Penhas Douradas", 1090821, "GDA", 40.4075, -7.5665],
  ["Leiria", 1100900, "LRA", 39.7473, -8.8069],
  ["Lisboa", 1110600, "LSB", 38.766, -9.1286],
  ["Portalegre", 1121400, "PTG", 39.29, -7.42],
  ["Porto", 1131200, "PTO", 41.158, -8.6294],
  ["Santarém", 1141600, "STM", 39.2, -8.74],
  ["Setúbal", 1151200, "STB", 38.5246, -8.8856],
  ["Sines", 1151300, "STB", 37.956, -8.8643],
  ["Viana do Castelo", 1160900, "VCT", 41.6952, -8.8365],
  ["Vila Real", 1171400, "VRL", 41.3053, -7.744],
  ["Viseu", 1182300, "VIS", 40.6585, -7.912],
  ["Funchal", 2310300, "MCS", 32.6485, -16.9084],
  ["Porto Santo", 2320100, "MPS", 33.07, -16.34],
  ["Vila do Porto", 3410100, "AOR", 36.9563, -25.1409],
  ["Ponta Delgada", 3420300, "AOR", 37.7415, -25.6677],
  ["Angra do Heroísmo", 3430100, "ACE", 38.67, -27.22],
  ["Santa Cruz da Graciosa", 3440100, "ACE", 39.08, -28.0],
  ["Velas", 3450200, "ACE", 38.6842, -28.2133],
  ["Madalena", 3460200, "ACE", 38.5325, -28.5237],
  ["Horta", 3470100, "ACE", 38.5363, -28.6315],
  ["Santa Cruz das Flores", 3480200, "AOC", 39.45, -31.13],
  ["Vila do Corvo", 3490100, "AOC", 39.67, -31.12],
];

export const LOCAIS: Local[] = LOCAIS_RAW.map(([nome, globalIdLocal, idAreaAviso, lat, lon]) => ({
  nome,
  lat,
  lon,
  slug: slugify(nome),
  globalIdLocal,
  idAreaAviso,
  regiao: globalIdLocal >= 3000000 ? "Açores" : globalIdLocal >= 2000000 ? "Madeira" : "Continente",
}));

export const LOCAL_PADRAO = "lisboa";

export function getLocal(slug: string): Local | undefined {
  return LOCAIS.find((l) => l.slug === slug);
}

// weather-type-classe.json (descrições abreviadas onde o original é longo)
export const TIPOS_TEMPO: Record<number, string> = {
  1: "Céu limpo", 2: "Céu pouco nublado", 3: "Céu parcialmente nublado", 4: "Céu muito nublado",
  5: "Nuvens altas", 6: "Aguaceiros/chuva", 7: "Aguaceiros fracos", 8: "Aguaceiros fortes",
  9: "Chuva/aguaceiros", 10: "Chuva fraca ou chuvisco", 11: "Chuva forte", 12: "Períodos de chuva",
  13: "Períodos de chuva fraca", 14: "Períodos de chuva forte", 15: "Chuvisco", 16: "Neblina",
  17: "Nevoeiro ou nuvens baixas", 18: "Neve", 19: "Trovoada", 20: "Aguaceiros e trovoada",
  21: "Granizo", 22: "Geada", 23: "Chuva e trovoada", 24: "Nebulosidade convectiva",
  25: "Períodos de muito nublado", 26: "Nevoeiro", 27: "Céu nublado",
};

export const AREAS_AVISO: Record<string, { nome: string; regiao: Local["regiao"] }> = {
  AVR: { nome: "Aveiro", regiao: "Continente" }, BJA: { nome: "Beja", regiao: "Continente" },
  BRG: { nome: "Braga", regiao: "Continente" }, BGC: { nome: "Bragança", regiao: "Continente" },
  CBO: { nome: "Castelo Branco", regiao: "Continente" }, CBR: { nome: "Coimbra", regiao: "Continente" },
  EVR: { nome: "Évora", regiao: "Continente" }, FAR: { nome: "Faro", regiao: "Continente" },
  GDA: { nome: "Guarda", regiao: "Continente" }, LRA: { nome: "Leiria", regiao: "Continente" },
  LSB: { nome: "Lisboa", regiao: "Continente" }, PTG: { nome: "Portalegre", regiao: "Continente" },
  PTO: { nome: "Porto", regiao: "Continente" }, STM: { nome: "Santarém", regiao: "Continente" },
  STB: { nome: "Setúbal", regiao: "Continente" }, VCT: { nome: "Viana do Castelo", regiao: "Continente" },
  VRL: { nome: "Vila Real", regiao: "Continente" }, VIS: { nome: "Viseu", regiao: "Continente" },
  MCN: { nome: "Costa Norte", regiao: "Madeira" }, MCS: { nome: "Costa Sul", regiao: "Madeira" },
  MRM: { nome: "Regiões montanhosas", regiao: "Madeira" }, MPS: { nome: "Porto Santo", regiao: "Madeira" },
  AOC: { nome: "Grupo Ocidental", regiao: "Açores" }, ACE: { nome: "Grupo Central", regiao: "Açores" },
  AOR: { nome: "Grupo Oriental", regiao: "Açores" },
};

export const NIVEIS: { id: NivelAviso; nome: string; sentido: string }[] = [
  { id: "green", nome: "Verde", sentido: "sem risco" },
  { id: "yellow", nome: "Amarelo", sentido: "atenção" },
  { id: "orange", nome: "Laranja", sentido: "risco moderado a elevado" },
  { id: "red", nome: "Vermelho", sentido: "risco extremo" },
];

export const RISCO_INCENDIO = ["Reduzido", "Moderado", "Elevado", "Muito elevado", "Máximo"];

// Local do IPMA mais próximo de umas coordenadas (distância em linha reta, em km)
export function localMaisProximo(lat: number, lon: number): { local: Local; km: number } {
  const rad = Math.PI / 180;
  const dist = (l: Local) => {
    const dLat = (l.lat - lat) * rad, dLon = (l.lon - lon) * rad;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * rad) * Math.cos(l.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(a));
  };
  let melhor = LOCAIS[0], km = dist(melhor);
  for (const l of LOCAIS) {
    const d = dist(l);
    if (d < km) { melhor = l; km = d; }
  }
  return { local: melhor, km };
}

// Artigo dos locais que o pedem ("no Porto", "na Horta", "nas Velas"); os outros não levam ("em Lisboa")
const ARTIGO: Record<string, "o" | "a" | "os" | "as"> = {
  porto: "o", funchal: "o", "porto-santo": "o", horta: "a", guarda: "a", madalena: "a", velas: "as", "penhas-douradas": "as",
};
const EM: Record<string, string> = { o: "no", a: "na", os: "nos", as: "nas" };

// "em Lisboa", "no Porto"
export function emLocal(l: Local): string {
  const a = ARTIGO[l.slug];
  return a ? `${EM[a]} ${l.nome}` : `em ${l.nome}`;
}

// "para Lisboa", "para o Porto"
export function paraLocal(l: Local): string {
  const a = ARTIGO[l.slug];
  return a ? `para ${a} ${l.nome}` : `para ${l.nome}`;
}
