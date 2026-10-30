import type { Aviso } from "@/lib/data";
import { resumoAvisos } from "@/lib/avisos";

export function WarningsLead({ avisos }: { avisos: Aviso[] }) {
  const frases = resumoAvisos(avisos);
  return (
    <p className="warn-lead">
      {frases.map((f, i) => (
        <span key={i}>
          {i > 0 && " "}
          {f.nivel ? <b className={f.nivel}>{f.texto}</b> : f.texto}
        </span>
      ))}
    </p>
  );
}
