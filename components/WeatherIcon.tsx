type Props = { tipo: number; size?: number };

function grupo(tipo: number): "sol" | "parcial" | "altas" | "chuva" | "trovoada" | "nevoeiro" | "nuvem" {
  if (tipo === 1) return "sol";
  if (tipo === 2 || tipo === 3 || tipo === 25) return "parcial";
  if (tipo === 5) return "altas";
  if (tipo === 19 || tipo === 20 || tipo === 23) return "trovoada";
  if (tipo === 16 || tipo === 17 || tipo === 26) return "nevoeiro";
  if (tipo >= 6 && tipo <= 15) return "chuva";
  return "nuvem";
}

const NUVEM = "M7 14.5h10.5a3.8 3.8 0 0 0 .4-7.6 5.4 5.4 0 0 0-10.4 1.6A3 3 0 0 0 7 14.5Z";

export function WeatherIcon({ tipo, size = 26 }: Props) {
  const g = grupo(tipo);
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {g === "sol" && (
        <g {...s}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </g>
      )}
      {g === "parcial" && (
        <g {...s}>
          <circle cx="9" cy="9" r="3.4" />
          <path d="M9 2.6v1.4M2.6 9h1.4M4.5 4.5l1 1M13.5 4.5l-1 1" />
          <path d="M9.5 19.5h8.2a3.3 3.3 0 0 0 .3-6.6 4.6 4.6 0 0 0-8.8 1.4 2.6 2.6 0 0 0 .3 5.2Z" fill="var(--bg)" />
        </g>
      )}
      {g === "altas" && (
        <g {...s}>
          <circle cx="12" cy="13" r="3.6" />
          <path d="M3 6.5h7M13 6.5h8M6 3.5h11" />
        </g>
      )}
      {g === "nuvem" && <path {...s} d="M7 18.5h10.5a3.8 3.8 0 0 0 .4-7.6 5.4 5.4 0 0 0-10.4 1.6A3 3 0 0 0 7 18.5Z" />}
      {g === "chuva" && (
        <>
          <path {...s} d={NUVEM} />
          <path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {g === "trovoada" && (
        <>
          <path {...s} d={NUVEM} />
          <path d="M12.5 15.5l-2 3.5h3l-2 3.5" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {g === "nevoeiro" && <path {...s} d="M4 9h16M6 13h12M4 17h16" />}
    </svg>
  );
}
