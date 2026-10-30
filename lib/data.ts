// Dados de exemplo enquanto o site não está ligado à API do IPMA.
// Amostra real recolhida a 30/10/2026 em api.ipma.pt para Lisboa (globalIdLocal 1110600).

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

export const ATUALIZADO = "2026-10-30T09:31";
export const AGORA = "2026-10-30T10:00";

// [hora, temperatura, prob. chuva (-99 = sem valor), vento km/h, direção, tipo de tempo]
const H: [string, number, number, number, string, number][] = [
  ["30T02", 17.9, -99, 7.6, "NE", 5], ["30T03", 17.2, 0, 7.2, "NE", 2], ["30T04", 16.4, -99, 7.2, "NE", 5],
  ["30T05", 16.3, -99, 7.2, "NE", 5], ["30T06", 16.2, 0, 7.9, "NE", 5], ["30T07", 15.7, -99, 8.3, "NE", 5],
  ["30T08", 16.2, -99, 8.3, "NE", 5], ["30T09", 18.3, 0, 7.6, "NE", 5], ["30T10", 20.3, -99, 7.2, "NE", 5],
  ["30T11", 22.1, -99, 8.3, "E", 5], ["30T12", 23.2, 0, 8.6, "E", 5], ["30T13", 24.9, -99, 8.3, "E", 5],
  ["30T14", 25.8, -99, 7.2, "E", 5], ["30T15", 26.6, 0, 5.8, "NE", 5], ["30T16", 27.1, -99, 7.2, "NE", 5],
  ["30T17", 24.8, -99, 9.7, "N", 5], ["30T18", 23.2, 0, 9.0, "N", 5], ["30T19", 22.0, -99, 8.6, "N", 5],
  ["30T20", 21.4, -99, 9.4, "N", 5], ["30T21", 20.4, 0, 9.4, "N", 5], ["30T22", 19.6, -99, 8.3, "N", 5],
  ["30T23", 19.1, -99, 7.2, "N", 2], ["31T00", 18.2, 0, 6.5, "N", 1], ["31T01", 16.9, -99, 5.8, "N", 1],
  ["31T02", 16.1, -99, 5.0, "N", 1], ["31T03", 15.1, 0, 6.1, "N", 1], ["31T04", 14.5, -99, 6.5, "N", 1],
  ["31T05", 13.8, -99, 5.8, "N", 1], ["31T06", 13.4, 0, 6.5, "N", 1], ["31T07", 13.1, -99, 6.8, "N", 1],
  ["31T08", 14.3, -99, 7.6, "N", 1], ["31T09", 17.3, 0, 6.5, "NE", 1], ["31T10", 19.5, -99, 6.1, "NE", 1],
  ["31T11", 21.3, -99, 6.8, "E", 1], ["31T12", 22.3, 0, 7.2, "E", 1], ["31T13", 24.1, -99, 7.2, "SE", 1],
  ["31T14", 24.8, -99, 5.4, "SE", 1], ["31T15", 26.3, 0, 2.9, "SW", 2], ["31T16", 25.1, -99, 6.1, "NW", 1],
  ["31T17", 23.1, -99, 10.1, "NW", 1], ["31T18", 20.7, 0, 11.5, "NW", 1], ["31T19", 19.4, -99, 11.5, "NW", 1],
  ["31T20", 19.1, -99, 11.5, "NW", 1], ["31T21", 18.9, 0, 9.4, "N", 1], ["31T22", 18.0, -99, 7.6, "N", 1],
  ["31T23", 17.3, -99, 6.5, "N", 1], ["01T00", 16.8, 0, 5.4, "N", 1], ["01T01", 16.6, -99, 6.5, "NE", 1],
];

function isoDe(chave: string): string {
  const dia = chave.slice(0, 2);
  const mes = dia === "01" ? "11" : "10";
  return `2026-${mes}-${dia}T${chave.slice(3)}:00`;
}

const HORAS_LISBOA: Hora[] = H.map(([k, temp, p, vento, dirVento, tipoTempo]) => ({
  hora: isoDe(k),
  temp,
  probChuva: p < 0 ? null : p,
  vento,
  dirVento,
  tipoTempo,
}));

const DIAS_LISBOA: Dia[] = [
  { data: "2026-10-30", tMin: 15.7, tMax: 27.1, probChuva: 0, tipoTempo: 5 },
  { data: "2026-10-31", tMin: 13.1, tMax: 26.3, probChuva: 0, tipoTempo: 1 },
  { data: "2026-11-01", tMin: 13.6, tMax: 25.7, probChuva: 0, tipoTempo: 1 },
  { data: "2026-11-02", tMin: 13.7, tMax: 25.7, probChuva: 0, tipoTempo: 1 },
  { data: "2026-11-03", tMin: 11.2, tMax: 22.2, probChuva: 0, tipoTempo: 2 },
  { data: "2026-11-04", tMin: 10.7, tMax: 20.5, probChuva: 2, tipoTempo: 1 },
  { data: "2026-11-05", tMin: 10.2, tMax: 19.7, probChuva: 22, tipoTempo: 2 },
  { data: "2026-11-06", tMin: 11.7, tMax: 19.6, probChuva: 55, tipoTempo: 7 },
  { data: "2026-11-07", tMin: 13.4, tMax: 20.1, probChuva: 71, tipoTempo: 6 },
  { data: "2026-11-08", tMin: 14.0, tMax: 19.8, probChuva: 80, tipoTempo: 6 },
];

export type Previsao = {
  local: Local;
  resumo: { titulo: string; destaque: string; texto: string };
  agora: { temp: number; humidade: number; vento: number; dirVento: string };
  uv: number;
  mar: { zona: string; ondaMin: number; ondaMax: number; dirOnda: string; periodoMin: number; periodoMax: number; aguaMin: number; aguaMax: number };
  riscoIncendio: number; // 1 a 5
  horas: Hora[];
  dias: Dia[];
};

const PREVISOES: Record<string, Omit<Previsao, "local">> = {
  lisboa: {
    resumo: {
      titulo: "Céu com nuvens altas, máxima de",
      destaque: "27°",
      texto:
        "Mínima de 16° de madrugada e tarde quente, com o pico às 16h. Sem chuva até quarta. Vento fraco de nordeste, a rodar para norte ao fim da tarde. A chuva deve chegar a partir de sexta, 6 de novembro.",
    },
    agora: { temp: 20.3, humidade: 38, vento: 7.2, dirVento: "NE" },
    uv: 3.5,
    mar: { zona: "Costa de Lisboa", ondaMin: 0.7, ondaMax: 1.0, dirOnda: "NW", periodoMin: 5, periodoMax: 8.5, aguaMin: 15.5, aguaMax: 15.8 },
    riscoIncendio: 2,
    horas: HORAS_LISBOA,
    dias: DIAS_LISBOA,
  },
};

export function getPrevisao(slug: string): Previsao | null {
  const local = getLocal(slug);
  const p = PREVISOES[slug];
  return local && p ? { local, ...p } : null;
}

// warnings_www.json: só os avisos acima de verde nesta amostra
export const AVISOS: Aviso[] = [
  { idAreaAviso: "MRM", tipo: "Precipitação", nivel: "yellow", inicio: "2026-10-31T21:00", fim: "2026-11-01T09:00", texto: "Aguaceiros, por vezes fortes, podendo ser acompanhados de trovoada." },
  { idAreaAviso: "MCS", tipo: "Precipitação", nivel: "yellow", inicio: "2026-10-31T21:00", fim: "2026-11-01T09:00", texto: "Aguaceiros, por vezes fortes, podendo ser acompanhados de trovoada." },
];

export const NIVEIS: { id: NivelAviso; nome: string; sentido: string }[] = [
  { id: "green", nome: "Verde", sentido: "sem risco" },
  { id: "yellow", nome: "Amarelo", sentido: "atenção" },
  { id: "orange", nome: "Laranja", sentido: "risco moderado a elevado" },
  { id: "red", nome: "Vermelho", sentido: "risco extremo" },
];

export const RISCO_INCENDIO = ["Reduzido", "Moderado", "Elevado", "Muito elevado", "Máximo"];

// hp-daily-sea-forecast-day0.json (zonas costeiras)
export const MAR_COSTA = [
  { zona: "Viana do Castelo", ondaMin: 0.9, ondaMax: 1.4, dir: "NW", aguaMin: 15.2, aguaMax: 15.4 },
  { zona: "Porto", ondaMin: 0.9, ondaMax: 1.5, dir: "NW", aguaMin: 15.2, aguaMax: 15.4 },
  { zona: "Figueira da Foz", ondaMin: 0.9, ondaMax: 1.3, dir: "NW", aguaMin: 16.1, aguaMax: 16.2 },
  { zona: "Costa de Lisboa", ondaMin: 0.7, ondaMax: 1.0, dir: "NW", aguaMin: 15.5, aguaMax: 15.8 },
  { zona: "Sines", ondaMin: 0.7, ondaMax: 1.0, dir: "NW", aguaMin: 17.4, aguaMax: 17.7 },
  { zona: "Sagres", ondaMin: 0.9, ondaMax: 1.2, dir: "NW", aguaMin: 17.9, aguaMax: 18.5 },
  { zona: "Faro", ondaMin: 0.5, ondaMax: 0.9, dir: "SE", aguaMin: 19.6, aguaMax: 19.8 },
  { zona: "Funchal", ondaMin: 0.5, ondaMax: 0.7, dir: "E", aguaMin: 22.4, aguaMax: 23.1 },
  { zona: "Porto Santo", ondaMin: 0.6, ondaMax: 0.8, dir: "NE", aguaMin: 22.4, aguaMax: 23.0 },
  { zona: "Ponta Delgada", ondaMin: 1.3, ondaMax: 1.8, dir: "NW", aguaMin: 21.5, aguaMax: 21.6 },
  { zona: "Horta", ondaMin: 2.2, ondaMax: 2.7, dir: "N", aguaMin: 20.8, aguaMax: 20.9 },
  { zona: "Santa Cruz das Flores", ondaMin: 2.4, ondaMax: 2.7, dir: "NW", aguaMin: 20.6, aguaMax: 20.6 },
];
