"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Guarda, neste separador, qual foi a página anterior dentro do site.
// O botão "Voltar" usa isto para saber se pode recuar no histórico.
export function NavHistory() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const aqui = window.location.pathname + window.location.search;
      const atual = sessionStorage.getItem("nav:atual");
      if (atual !== aqui) {
        if (atual) sessionStorage.setItem("nav:anterior", atual);
        sessionStorage.setItem("nav:atual", aqui);
      }
    } catch {}
  }, [pathname]);
  return null;
}
