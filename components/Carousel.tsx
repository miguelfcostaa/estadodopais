"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Faixa horizontal que desliza com o rato, o dedo ou os botões ‹ ›.
// "inicio" é o seletor de um elemento para onde a faixa deve abrir (por exemplo, a hora atual).
// Com "titulo", os botões ‹ › ficam na linha do título, à direita, em vez de por baixo da faixa.
export function Carousel({ children, label, inicio, titulo }: { children: React.ReactNode; label: string; inicio?: string; titulo?: React.ReactNode }) {
  const faixa = useRef<HTMLDivElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  const atualizar = useCallback(() => {
    const f = faixa.current;
    if (!f) return;
    setPodeVoltar(f.scrollLeft > 1);
    setPodeAvancar(f.scrollLeft + f.clientWidth < f.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const f = faixa.current;
    if (!f) return;
    if (inicio) {
      const alvo = f.querySelector<HTMLElement>(inicio);
      if (alvo) f.scrollLeft = alvo.offsetLeft;
    }
    atualizar();
    const ro = new ResizeObserver(atualizar);
    ro.observe(f);
    return () => ro.disconnect();
  }, [atualizar, inicio]);

  function mover(sentido: 1 | -1) {
    const f = faixa.current;
    if (!f) return;
    // Se o que sobra for menos do que um passo, vai até à ponta (evita parar a poucos píxeis do fim)
    const max = f.scrollWidth - f.clientWidth;
    const gap = parseFloat(getComputedStyle(f.firstElementChild ?? f).columnGap) || 0;
    let alvo = f.scrollLeft + sentido * (f.clientWidth + gap);
    if (alvo > max - 8) alvo = max;
    if (alvo < 8) alvo = 0;
    f.scrollTo({ left: alvo, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  const botoes = (
    <div className="carousel-nav">
      <button type="button" className="carousel-btn" onClick={() => mover(-1)} disabled={!podeVoltar} aria-label="Anteriores">‹</button>
      <button type="button" className="carousel-btn" onClick={() => mover(1)} disabled={!podeAvancar} aria-label="Seguintes">›</button>
    </div>
  );

  return (
    <div className="carousel" role="region" aria-label={label}>
      {titulo && (
        <div className="sec-head carousel-head">
          {titulo}
          {botoes}
        </div>
      )}
      <div className="carousel-track" ref={faixa} onScroll={atualizar} tabIndex={0}>
        {children}
      </div>
      {!titulo && botoes}
    </div>
  );
}
