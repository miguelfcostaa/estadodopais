// Nascer e pôr do sol por local e por dia (algoritmo do Almanac for Computers, precisão de 1 a 2 minutos).

const RAD = Math.PI / 180;
const ZENITE = 90.833; // inclui a refração e o raio do disco solar

function diaDoAno(ano: number, mes: number, dia: number): number {
  return Math.round((Date.UTC(ano, mes - 1, dia) - Date.UTC(ano, 0, 0)) / 86400000);
}

// Hora UTC (em horas decimais) do nascer ou do pôr do sol; null se não acontece nesse dia
function horaUTC(ano: number, mes: number, dia: number, lat: number, lon: number, nascer: boolean): number | null {
  const N = diaDoAno(ano, mes, dia);
  const lngHora = lon / 15;
  const t = N + ((nascer ? 6 : 18) - lngHora) / 24;
  const M = 0.9856 * t - 3.289;
  let L = M + 1.916 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 282.634;
  L = ((L % 360) + 360) % 360;
  let RA = Math.atan(0.91764 * Math.tan(L * RAD)) / RAD;
  RA = ((RA % 360) + 360) % 360;
  RA = (RA + (Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90)) / 15;
  const sinDec = 0.39782 * Math.sin(L * RAD);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(ZENITE * RAD) - sinDec * Math.sin(lat * RAD)) / (cosDec * Math.cos(lat * RAD));
  if (cosH > 1 || cosH < -1) return null;
  const H = (nascer ? 360 - Math.acos(cosH) / RAD : Math.acos(cosH) / RAD) / 15;
  const T = H + RA - 0.06571 * t - 6.622;
  return (((T - lngHora) % 24) + 24) % 24;
}

// Minutos desde a meia-noite, na hora local do fuso indicado
function minutosLocais(ano: number, mes: number, dia: number, utc: number, timeZone: string): number {
  const d = new Date(Date.UTC(ano, mes - 1, dia) + utc * 3600000);
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d).map((x) => [x.type, x.value]),
  );
  return Number(p.hour) * 60 + Number(p.minute);
}

export type Sol = { nascer: number; por: number }; // minutos desde a meia-noite, hora local

export function solDoDia(data: string, lat: number, lon: number, timeZone: string): Sol | null {
  const [ano, mes, dia] = data.split("-").map(Number);
  const n = horaUTC(ano, mes, dia, lat, lon, true);
  const p = horaUTC(ano, mes, dia, lat, lon, false);
  if (n === null || p === null) return null;
  return { nascer: minutosLocais(ano, mes, dia, n, timeZone), por: minutosLocais(ano, mes, dia, p, timeZone) };
}

// "2026-10-30T19:00" é de noite? Usa o nascer e o pôr do sol desse dia nesse local.
export function criarNoite(lat: number, lon: number, timeZone: string) {
  const cache = new Map<string, Sol | null>();
  return (iso: string): boolean => {
    const data = iso.slice(0, 10);
    if (!cache.has(data)) cache.set(data, solDoDia(data, lat, lon, timeZone));
    const sol = cache.get(data);
    if (!sol) return false;
    const m = Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16));
    return m < sol.nascer || m >= sol.por;
  };
}
