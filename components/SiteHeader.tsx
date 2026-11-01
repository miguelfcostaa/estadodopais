"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Hoje" },
  { href: "/avisos", label: "Avisos" },
  { href: "/mar", label: "Mar" },
];

export function SiteHeader({ atualizado }: { atualizado: string }) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => setAberto(false), [pathname]);

  function ativo(href: string) {
    if (href === "/") return pathname === "/" || pathname.startsWith("/local/");
    return pathname.startsWith(href);
  }

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link className="brand" href="/">
          <span>estadodopais<b>.pt</b></span>
        </Link>
        <span className="status mono">
          <span className="dot" />
          <span>atualizado {atualizado}</span>
        </span>
        <button
          className="icon-btn menu-btn"
          type="button"
          aria-expanded={aberto}
          aria-controls="site-nav"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d={aberto ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <nav id="site-nav" className="site-nav" aria-label="Principal" data-open={aberto}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={ativo(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
