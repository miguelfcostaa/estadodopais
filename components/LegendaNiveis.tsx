import { NIVEIS } from "@/lib/data";

function Itens() {
  return (
    <>
      {NIVEIS.map((n) => (
        <span key={n.id}>
          <i className={`lvl ${n.id}`} />
          <span className="scale-txt">
            <b>{n.nome.toLowerCase()}</b>
            <span className="scale-sep"> · </span>
            <span className="scale-sentido">{n.sentido}</span>
          </span>
        </span>
      ))}
    </>
  );
}

// Legenda dos níveis de aviso. No computador fica visível numa linha; no telemóvel fica atrás de um botão
// que abre uma janela (popover nativo do navegador: fecha ao tocar fora, com Esc ou no botão Fechar).
export function LegendaNiveis({ id }: { id: string }) {
  return (
    <>
      <div className="scale mono">
        <Itens />
      </div>
      <button type="button" className="legenda-btn mono" popoverTarget={id}>
        <span aria-hidden="true">ⓘ</span> O que significam as cores?
      </button>
      <div id={id} popover="auto" className="legenda-pop" role="dialog" aria-label="Níveis de aviso">
        <div className="legenda-pop-head">
          <span className="label">Níveis de aviso</span>
          <button type="button" className="legenda-fechar" popoverTarget={id} popoverTargetAction="hide" aria-label="Fechar">
            ×
          </button>
        </div>
        <div className="scale scale-grelha mono">
          <Itens />
        </div>
      </div>
    </>
  );
}
