"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Mostra cada secção com uma subida curta quando entra no ecrã, uma só vez.
// Sem JavaScript, ou com as animações desligadas no sistema, tudo aparece logo.
export function Revelar() {
  const caminho = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const raiz = document.documentElement;
    const secoes = [...document.querySelectorAll<HTMLElement>("main .section")];
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("visivel");
          obs.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const s of secoes) {
      // o que já está à vista não se esconde
      if (s.getBoundingClientRect().top < window.innerHeight) s.classList.add("visivel");
      else obs.observe(s);
    }
    raiz.classList.add("revelar");
    return () => obs.disconnect();
  }, [caminho]);

  return null;
}
