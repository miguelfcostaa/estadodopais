// Contas para a página de um dia: momentos do dia, intervalos e frase-resumo.
import { TIPOS_TEMPO, type Dia, type Hora } from "./data";
import { hora } from "./format";
import { direcaoExtenso, INTENSIDADE_VENTO } from "./ipma";

export const INTENSIDADE_CHUVA: Record<number, string> = { 1: "fraca", 2: "moderada", 3: "forte" };

export type Momento = {
  nome: string;
  inicio: number; // hora
  fim: number;
  tipoTempo: number;
  tMin: number;
  tMax: number;
  probChuva: number | null;
  vento: number;
  dirVento: string;
};

const MOMENTOS = [
  { nome: "Madrugada", inicio: 0, fim: 6 },
  { nome: "Manhã", inicio: 6, fim: 12 },
  { nome: "Tarde", inicio: 12, fim: 18 },
  { nome: "Noite", inicio: 18, fim: 24 },
];

function intervalo(valores: (number | null | undefined)[]): [number, number] | null {
  const v = valores.filter((x): x is number => typeof x === "number");
  return v.length ? [Math.min(...v), Math.max(...v)] : null;
}

// O tipo de tempo mais frequente; em empate fica o mais "severo" (código maior)
function tipoDominante(pontos: Hora[]): number {
  const conta = new Map<number, number>();
  for (const p of pontos) conta.set(p.tipoTempo, (conta.get(p.tipoTempo) ?? 0) + 1);
  return [...conta.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0] ?? 0;
}

export function pontosDoDia(pontos: Hora[], data: string): Hora[] {
  return pontos.filter((p) => p.hora.slice(0, 10) === data);
}

export function momentosDoDia(pontos: Hora[]): Momento[] {
  return MOMENTOS.flatMap((m) => {
    const ps = pontos.filter((p) => hora(p.hora) >= m.inicio && hora(p.hora) < m.fim);
    if (!ps.length) return [];
    const t = intervalo(ps.map((p) => p.temp))!;
    const chuva = intervalo(ps.map((p) => p.probChuva));
    const vento = ps.reduce((s, p) => s + p.vento, 0) / ps.length;
    const dir = ps.reduce((a, b) => (b.vento > a.vento ? b : a)).dirVento;
    return [{ ...m, tipoTempo: tipoDominante(ps), tMin: t[0], tMax: t[1], probChuva: chuva ? chuva[1] : null, vento, dirVento: dir }];
  });
}

export function estatisticas(pontos: Hora[]) {
  const ventoMax = pontos.length ? pontos.reduce((a, b) => (b.vento > a.vento ? b : a)) : null;
  return {
    humidade: intervalo(pontos.map((p) => p.humidade)),
    sensacao: intervalo(pontos.map((p) => p.sensacao)),
    ventoMax: ventoMax ? { valor: ventoMax.vento, dir: ventoMax.dirVento, hora: hora(ventoMax.hora) } : null,
    onda: intervalo(pontos.map((p) => p.onda)),
    dirOnda: pontos.find((p) => p.dirOnda)?.dirOnda ?? "",
    periodoOnda: intervalo(pontos.map((p) => p.periodoOnda)),
    agua: intervalo(pontos.map((p) => p.agua)),
  };
}

export function resumoDia(d: Dia, pontos: Hora[], momentos: Momento[]): string {
  const frases: string[] = [];
  frases.push(`${TIPOS_TEMPO[d.tipoTempo] ?? "Previsão do dia"}.`);

  const pico = pontos.length >= 6 ? pontos.reduce((a, b) => (b.temp > a.temp ? b : a)) : null;
  frases.push(`Temperatura entre ${Math.round(d.tMin)}° e ${Math.round(d.tMax)}°${pico ? `, mais quente por volta das ${hora(pico.hora)}h` : ""}.`);

  if (d.probChuva < 10) {
    frases.push("Sem chuva prevista.");
  } else {
    const forca = d.intensidade ? INTENSIDADE_CHUVA[d.intensidade] : null;
    const pior = momentos.filter((m) => m.probChuva !== null).sort((a, b) => (b.probChuva ?? 0) - (a.probChuva ?? 0))[0];
    const quando = pior && (pior.probChuva ?? 0) >= 20 ? `, sobretudo ${pior.nome === "Madrugada" ? "de madrugada" : pior.nome === "Manhã" ? "de manhã" : pior.nome === "Tarde" ? "à tarde" : "à noite"}` : "";
    frases.push(`Probabilidade de chuva de ${d.probChuva}%${forca ? `, ${forca}` : ""}${quando}.`);
  }

  if (d.dirVento) {
    const forca = d.ventoClasse ? INTENSIDADE_VENTO[d.ventoClasse] : null;
    const max = estatisticas(pontos).ventoMax;
    frases.push(`Vento${forca ? ` ${forca}` : ""} de ${direcaoExtenso(d.dirVento)}${max ? `, até ${Math.round(max.valor)} km/h` : ""}.`);
  }
  return frases.join(" ");
}
