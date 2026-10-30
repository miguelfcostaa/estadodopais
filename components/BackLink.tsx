"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Volta à página anterior quando se chegou a partir de outra página do site.
// Se a página foi aberta diretamente, leva ao destino de recurso (por exemplo, a cidade).
export function BackLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const [anterior, setAnterior] = useState<string | null>(null);

  useEffect(() => {
    try {
      const a = sessionStorage.getItem("nav:anterior");
      const aqui = window.location.pathname + window.location.search;
      if (a && a !== aqui) setAnterior(a);
    } catch {}
  }, []);

  if (anterior) {
    return (
      <Link
        className="back mono"
        href={anterior}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          router.back();
        }}
      >
        ← Voltar
      </Link>
    );
  }
  return (
    <Link className="back mono" href={href}>
      ← {label}
    </Link>
  );
}
