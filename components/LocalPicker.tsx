"use client";

import { useRouter } from "next/navigation";
import { LOCAIS } from "@/lib/data";

export function LocalPicker({ atual }: { atual: string }) {
  const router = useRouter();
  const regioes = ["Continente", "Madeira", "Açores"] as const;

  return (
    <label className="picker">
      <span className="sr-only">Escolher local</span>
      <select id="local" value={atual} onChange={(e) => router.push(`/local/${e.target.value}`)}>
        {regioes.map((r) => (
          <optgroup key={r} label={r}>
            {LOCAIS.filter((l) => l.regiao === r).map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.nome}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
