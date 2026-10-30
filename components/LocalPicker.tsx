"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCAIS, type Local } from "@/lib/data";
import { guardarLocal } from "@/lib/preferencias";

type Regiao = Local["regiao"];
const REGIOES: Regiao[] = ["Continente", "Madeira", "Açores"];

function porNome(a: Local, b: Local) {
  return a.nome.localeCompare(b.nome, "pt");
}

export function LocalPicker({ atual }: { atual: string }) {
  const [aberto, setAberto] = useState<Regiao | null>(null);
  const [filtro, setFiltro] = useState("");
  const raiz = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const localAtual = LOCAIS.find((l) => l.slug === atual);

  useEffect(() => setAberto(null), [pathname]);

  // Fecha ao clicar fora ou com Esc
  useEffect(() => {
    if (!aberto) return;
    function fora(e: MouseEvent) {
      if (!raiz.current?.contains(e.target as Node)) setAberto(null);
    }
    function tecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        raiz.current?.querySelector<HTMLButtonElement>(`[data-regiao="${aberto}"]`)?.focus();
        setAberto(null);
      }
    }
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  function alternar(r: Regiao) {
    setFiltro("");
    setAberto((v) => (v === r ? null : r));
  }

  // Setas para cima e para baixo entre as opções
  function navegar(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const itens = [...e.currentTarget.querySelectorAll<HTMLElement>("input, a")];
    const i = itens.indexOf(document.activeElement as HTMLElement);
    const prox = e.key === "ArrowDown" ? Math.min(i + 1, itens.length - 1) : Math.max(i - 1, 0);
    itens[prox]?.focus();
    e.preventDefault();
  }

  return (
    <div className="picker-row" ref={raiz}>
      {REGIOES.map((r) => {
        const ativa = localAtual?.regiao === r;
        const termo = filtro.trim().toLowerCase();
        const locais = LOCAIS.filter((l) => l.regiao === r && (!termo || l.nome.toLowerCase().includes(termo))).sort(porNome);
        return (
          <div className="picker" key={r}>
            <button
              type="button"
              className={`pk-btn${ativa ? " on" : ""}`}
              data-regiao={r}
              aria-expanded={aberto === r}
              aria-controls={`pk-${r}`}
              onClick={() => alternar(r)}
            >
              {ativa && localAtual ? localAtual.nome : r}
            </button>
            {aberto === r && (
              <div id={`pk-${r}`} className={`pk-pop${r === "Continente" ? " wide" : ""}`} onKeyDown={navegar}>
                {r === "Continente" && (
                  <input
                    id="pk-procurar"
                    className="pk-search"
                    type="search"
                    placeholder="Procurar…"
                    aria-label="Procurar local no continente"
                    autoFocus
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                )}
                <ul className="pk-list" aria-label={`Locais ${r === "Continente" ? "do continente" : r === "Madeira" ? "da Madeira" : "dos Açores"}`}>
                  {locais.map((l, i) => (
                    <li key={l.slug}>
                      <Link
                        className="pk-item"
                        href={`/local/${l.slug}`}
                        aria-current={l.slug === atual ? "page" : undefined}
                        onClick={() => guardarLocal(l.slug)}
                        autoFocus={r !== "Continente" && i === 0}
                      >
                        {l.nome}
                      </Link>
                    </li>
                  ))}
                  {locais.length === 0 && <li className="pk-empty">Nenhum local com esse nome.</li>}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
