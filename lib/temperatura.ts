// Cor de cada temperatura (°C), para o gradiente da barra: do frio (azul) ao calor (vermelho)
const ESCALA: [number, string][] = [
  [0, "#7aa6d6"], [8, "#6fb3b8"], [14, "#8cb88c"], [20, "#b5bd5a"], [26, "#d9a62b"], [32, "#e07b39"], [38, "#d6453d"],
];

function corDe(t: number): string {
  if (t <= ESCALA[0][0]) return ESCALA[0][1];
  for (let i = 1; i < ESCALA.length; i++) {
    const [t1, c1] = ESCALA[i];
    if (t <= t1) {
      const [t0, c0] = ESCALA[i - 1];
      const k = (t - t0) / (t1 - t0);
      const a = parseInt(c0.slice(1), 16), b = parseInt(c1.slice(1), 16);
      const canal = (s: number) => Math.round(((a >> s) & 255) + (((b >> s) & 255) - ((a >> s) & 255)) * k);
      return `rgb(${canal(16)}, ${canal(8)}, ${canal(0)})`;
    }
  }
  return ESCALA[ESCALA.length - 1][1];
}

// Gradiente da mínima à máxima, com as cores da escala que ficam pelo meio
export function gradiente(tMin: number, tMax: number): string {
  if (tMax - tMin < 0.5) return corDe(tMax);
  const pontos = [tMin, ...ESCALA.map(([t]) => t).filter((t) => t > tMin && t < tMax), tMax];
  return `linear-gradient(90deg, ${pontos.map((t) => `${corDe(t)} ${(((t - tMin) / (tMax - tMin)) * 100).toFixed(1)}%`).join(", ")})`;
}
