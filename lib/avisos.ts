import { AREAS_AVISO, type Aviso, type Local, type NivelAviso } from "./data";
import { diaSemana, hora, horaAtual } from "./format";

const ORDEM: NivelAviso[] = ["green", "yellow", "orange", "red"];
const NOME_NIVEL: Record<NivelAviso, string> = { green: "verde", yellow: "amarelo", orange: "laranja", red: "vermelho" };
const NA_REGIAO: Record<Local["regiao"], string> = { Continente: "no continente", Madeira: "na Madeira", Açores: "nos Açores" };

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

// Frase-resumo em português simples, gerada a partir dos avisos ativos.
export function resumoAvisos(avisos: Aviso[]): { texto: string; nivel?: NivelAviso }[] {
  const regioes: Local["regiao"][] = ["Continente", "Madeira", "Açores"];
  const comAviso = regioes.filter((r) => areasPorRegiao(r).some((id) => nivelDaArea(avisos, id) !== "green"));
  const semAviso = regioes.filter((r) => !comAviso.includes(r));

  if (comAviso.length === 0) return [{ texto: "Sem avisos meteorológicos em todo o território." }];
  const frases: { texto: string; nivel?: NivelAviso }[] = [];
  if (semAviso.length) frases.push({ texto: `Sem avisos ${semAviso.map((r) => NA_REGIAO[r]).join(" nem ")}.` });
  for (const r of comAviso) {
    const lista = areasPorRegiao(r).flatMap((id) => avisosDaArea(avisos, id));
    const pior = lista.reduce((a, b) => (ORDEM.indexOf(b.nivel) > ORDEM.indexOf(a.nivel) ? b : a));
    const tipos = [...new Set(lista.map((a) => a.tipo.toLowerCase()))];
    const porque = tipos.length > 2 ? `${tipos.slice(0, -1).join(", ")} e ${tipos.at(-1)}` : tipos.join(" e ");
    frases.push({ texto: `Aviso ${NOME_NIVEL[pior.nivel]} ${NA_REGIAO[r]} por ${porque}, ${intervalo(pior)}.`, nivel: pior.nivel });
  }
  return frases;
}
