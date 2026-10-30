export type NomeIcone = "temperatura" | "humidade" | "vento" | "uv" | "ondas" | "agua" | "sensacao" | "chuva";

// Ícones de traço simples, na cor de destaque, para os números principais
export function FactIcon({ nome }: { nome: NomeIcone }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="fact-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      {nome === "temperatura" && (
        <g {...s}>
          <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z" />
          <path d="M12 9v6.5" />
        </g>
      )}
      {nome === "humidade" && <path {...s} d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5Z" />}
      {nome === "vento" && (
        <g {...s}>
          <path d="M3 8h10.5a2.5 2.5 0 1 0-2.5-2.5" />
          <path d="M3 12h15a3 3 0 1 1-3 3" />
          <path d="M3 16h7" />
        </g>
      )}
      {nome === "uv" && (
        <g {...s}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </g>
      )}
      {nome === "ondas" && (
        <g {...s}>
          <path d="M2.5 9c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 3-1.5" />
          <path d="M2.5 14c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 3-1.5" />
          <path d="M2.5 19c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 3-1.5" />
        </g>
      )}
      {nome === "agua" && (
        <g {...s}>
          <path d="M8 11V4.5a1.75 1.75 0 1 1 3.5 0V11a3.5 3.5 0 1 1-3.5 0Z" />
          <path d="M14 15.5c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2M14 19.5c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2" />
        </g>
      )}
      {nome === "sensacao" && (
        <g {...s}>
          <circle cx="12" cy="5" r="2" />
          <path d="M12 8v6M12 14l-3 6.5M12 14l3 6.5M7.5 10.5h9" />
        </g>
      )}
      {nome === "chuva" && (
        <g {...s}>
          <path d="M3.5 12a8.5 8.5 0 0 1 17 0Z" />
          <path d="M12 12v6.5a2 2 0 0 1-4 0" />
        </g>
      )}
    </svg>
  );
}
