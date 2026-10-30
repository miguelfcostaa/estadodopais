import { AREAS_AVISO, AVISOS, type Aviso, type Local, type NivelAviso } from "./data";
import { diaSemana, hora } from "./format";

const ORDEM: NivelAviso[] = ["green", "yellow", "orange", "red"];
const NOME_NIVEL: Record<NivelAviso, string> = { green: "verde", yellow: "amarelo", orange: "laranja", red: "vermelho" };
const NA_REGIAO: Record<Local["regiao"], string> = { Continente: "no continente", Madeira: "na Madeira", Açores: "nos Açores" };

export function avisosDaArea(id: string): Aviso[] {
  return AVISOS.filter((a) => a.idAreaAviso === id && a.nivel !== "green");
}

export function nivelDaArea(id: string): NivelAviso {
  return avisosDaArea(id).reduce<NivelAviso>((max, a) => (ORDEM.indexOf(a.nivel) > ORDEM.indexOf(max) ? a.nivel : max), "green");
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
  return `de ${quando(a.inicio)} a ${quando(a.fim)}`;
}

// Frase-resumo em português simples, gerada a partir dos avisos ativos.
export function resumoAvisos(): string[] {
  const regioes: Local["regiao"][] = ["Continente", "Madeira", "Açores"];
  const comAviso = regioes.filter((r) => areasPorRegiao(r).some((id) => nivelDaArea(id) !== "green"));
  const semAviso = regioes.filter((r) => !comAviso.includes(r));
  const frases: string[] = [];

  if (comAviso.length === 0) return ["Sem avisos meteorológicos em todo o território."];
  if (semAviso.length) {
    frases.push(`Sem avisos ${semAviso.map((r) => NA_REGIAO[r]).join(" nem ")}.`);
  }
  for (const r of comAviso) {
    const avisos = areasPorRegiao(r).flatMap(avisosDaArea);
    const pior = avisos.reduce((a, b) => (ORDEM.indexOf(b.nivel) > ORDEM.indexOf(a.nivel) ? b : a));
    frases.push(`Aviso ${NOME_NIVEL[pior.nivel]} ${NA_REGIAO[r]} por ${pior.tipo.toLowerCase()}, ${intervalo(pior)}.`);
  }
  return frases;
}
