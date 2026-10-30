"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Faixa horizontal que desliza com o rato, o dedo ou os botões ‹ ›.
// "inicio" é o seletor de um elemento para onde a faixa deve abrir (por exemplo, a hora atual).
export function Carousel({ children, label, inicio }: { children: React.ReactNode; label: string; inicio?: string }) {
  const faixa = useRef<HTMLDivElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  const atualizar = useCallback(() => {
    const f = faixa.current;
    if (!f) return;
    setPodeVoltar(f.scrollLeft > 4);
    setPodeAvancar(f.scrollLeft + f.clientWidth < f.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const f = faixa.current;
    if (!f) return;
    if (inicio) {
      const alvo = f.querySelector<HTMLElement>(inicio);
      if (alvo) f.scrollLeft = alvo.offsetLeft - f.offsetLeft;
    }
    atualizar();
    const ro = new ResizeObserver(atualizar);
    ro.observe(f);
    return () => ro.disconnect();
  }, [atualizar, inicio]);

  function mover(sentido: 1 | -1) {
    const f = faixa.current;
    if (f) f.scrollBy({ left: sentido * f.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="carousel" role="region" aria-label={label}>
      <div className="carousel-track" ref={faixa} onScroll={atualizar} tabIndex={0}>
        {children}
      </div>
      <div className="carousel-nav">
        <button type="button" className="carousel-btn" onClick={() => mover(-1)} disabled={!podeVoltar} aria-label="Anteriores">‹</button>
        <button type="button" className="carousel-btn" onClick={() => mover(1)} disabled={!podeAvancar} aria-label="Seguintes">›</button>
      </div>
    </div>
  );
}
