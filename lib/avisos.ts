import { AREAS_AVISO, type Aviso, type Local, type NivelAviso } from "./data";
import { diaSemana, hora, horaAtual } from "./format";

const ORDEM: NivelAviso[] = ["green", "yellow", "orange", "red"];
const NOME_NIVEL: Record<NivelAviso, string> = { green: "verde", yellow: "amarelo", orange: "laranja", red: "vermelho" };

export function avisosDaArea(avisos: Aviso[], id: string): Aviso[] {
  return avisos.filter((a) => a.idAreaAviso === id && a.nivel !== "green");
}

export function nivelDaArea(avisos: Aviso[], id: string): NivelAviso {
  return avisosDaArea(avisos, id).reduce<NivelAviso>((max, a) => (ORDEM.indexOf(a.nivel) > ORDEM.indexOf(max) ? a.nivel : max), "green");
}

export function nomeNivel(n: NivelAviso): string {
  return NOME_NIVEL[n];
}

export function areasPorRegiao(regiao: Local["regiao"]): string[] {
  return Object.keys(AREAS_AVISO).filter((id) => AREAS_AVISO[id].regiao === regiao);
}

function quando(iso: string): string {
  return `${diaSemana(iso)} às ${hora(iso)}h`;
}

export function intervalo(a: Aviso): string {
  return a.inicio <= horaAtual() ? `até ${quando(a.fim)}` : `de ${quando(a.inicio)} a ${quando(a.fim)}`;
}
