const DIAS_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// As datas da API vêm em hora local sem fuso; tratamos como data "de parede".
function partes(iso: string) {
  const [d, t = "00:00"] = iso.split("T");
  const [ano, mes, dia] = d.split("-").map(Number);
  const hora = Number(t.slice(0, 2));
  const semana = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
  return { ano, mes, dia, hora, semana };
}

export function num(n: number, casas = 1): string {
  const v = Number.isInteger(n) ? String(n) : n.toFixed(casas);
  return v.replace(".", ",");
}

export function graus(n: number): string {
  return `${Math.round(n)}°`;
}

export function diaSemana(iso: string, curto = false): string {
  const nome = DIAS_SEMANA[partes(iso).semana];
  return curto ? nome.slice(0, 3) : nome;
}

export function dataCurta(iso: string): string {
  const p = partes(iso);
  return `${p.dia}/${p.mes}`;
}

export function dataLonga(iso: string): string {
  const p = partes(iso);
  const nome = DIAS_SEMANA[p.semana];
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)}, ${p.dia} ${MESES[p.mes - 1]}`;
}

export function hora(iso: string): number {
  return partes(iso).hora;
}

export function horaMinuto(iso: string): string {
  return iso.split("T")[1]?.slice(0, 5) ?? "";
}

export function nivelUV(uv: number): string {
  if (uv < 3) return "baixo";
  if (uv < 6) return "moderado";
  if (uv < 8) return "alto";
  if (uv < 11) return "muito alto";
  return "extremo";
}
