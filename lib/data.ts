// Tipos, listas fixas e tabelas de códigos da API de dados abertos do IPMA.

export type Local = {
  nome: string;
  slug: string;
  globalIdLocal: number;
  idAreaAviso: string;
  regiao: "Continente" | "Madeira" | "Açores";
};

export type Hora = {
  hora: string; // ISO local, ex. "2026-10-30T10:00"
  temp: number;
  probChuva: number | null; // null quando o IPMA envia -99
  vento: number; // km/h
  dirVento: string;
  tipoTempo: number;
};

export type Dia = {
  data: string; // "2026-10-30"
  tMin: number;
  tMax: number;
  probChuva: number;
  tipoTempo: number;
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

// Lista real de distrits-islands.json
const LOCAIS_RAW: [string, number, string][] = [
  ["Aveiro", 1010500, "AVR"], ["Beja", 1020500, "BJA"], ["Braga", 1030300, "BRG"],
  ["Guimarães", 1030800, "BRG"], ["Bragança", 1040200, "BGC"], ["Castelo Branco", 1050200, "CBO"],
  ["Coimbra", 1060300, "CBR"], ["Évora", 1070500, "EVR"], ["Faro", 1080500, "FAR"],
  ["Sagres", 1081505, "FAR"], ["Portimão", 1081100, "FAR"], ["Loulé", 1080800, "FAR"],
  ["Guarda", 1090700, "GDA"], ["Penhas Douradas", 1090821, "GDA"], ["Leiria", 1100900, "LRA"],
  ["Lisboa", 1110600, "LSB"], ["Portalegre", 1121400, "PTG"], ["Porto", 1131200, "PTO"],
  ["Santarém", 1141600, "STM"], ["Setúbal", 1151200, "STB"], ["Sines", 1151300, "STB"],
  ["Viana do Castelo", 1160900, "VCT"], ["Vila Real", 1171400, "VRL"], ["Viseu", 1182300, "VIS"],
  ["Funchal", 2310300, "MCS"], ["Porto Santo", 2320100, "MPS"], ["Vila do Porto", 3410100, "AOR"],
  ["Ponta Delgada", 3420300, "AOR"], ["Angra do Heroísmo", 3430100, "ACE"],
  ["Santa Cruz da Graciosa", 3440100, "ACE"], ["Velas", 3450200, "ACE"], ["Madalena", 3460200, "ACE"],
  ["Horta", 3470100, "ACE"], ["Santa Cruz das Flores", 3480200, "AOC"], ["Vila do Corvo", 3490100, "AOC"],
];

export const LOCAIS: Local[] = LOCAIS_RAW.map(([nome, globalIdLocal, idAreaAviso]) => ({
  nome,
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
