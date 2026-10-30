import { resumoAvisos } from "@/lib/avisos";

export function WarningsLead() {
  const frases = resumoAvisos();
  return (
    <p className="warn-lead">
      {frases.map((f, i) => {
        const destaque = f.startsWith("Aviso ");
        return (
          <span key={i}>
            {i > 0 && " "}
            {destaque ? <b>{f}</b> : f}
          </span>
        );
      })}
    </p>
  );
}
