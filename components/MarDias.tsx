"use client";

import { useState } from "react";

// Escolha do dia na página do mar: mostra só o conteúdo do dia escolhido (o mapa e a tabela de cada dia vêm já prontos do servidor)
export function MarDias({ rotulos, children }: { rotulos: string[]; children: React.ReactNode[] }) {
  const [dia, setDia] = useState(0);
  return (
    <>
      <div className="dias-tabs" role="tablist" aria-label="Dia da previsão do mar">
        {rotulos.map((r, i) => (
          <button key={r} type="button" role="tab" aria-selected={dia === i} className={dia === i ? "on" : undefined} onClick={() => setDia(i)}>
            {r}
          </button>
        ))}
      </div>
      {children.map((c, i) => (
        <div key={i} role="tabpanel" hidden={dia !== i}>
          {c}
        </div>
      ))}
    </>
  );
}
