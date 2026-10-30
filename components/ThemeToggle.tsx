"use client";

export function ThemeToggle() {
  function alternar() {
    const root = document.documentElement;
    const proximo = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = proximo;
    try {
      localStorage.setItem("tema", proximo);
    } catch {}
  }

  return (
    <button className="icon-btn" type="button" onClick={alternar} aria-label="Mudar entre tema escuro e claro" title="Tema">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" />
      </svg>
    </button>
  );
}
