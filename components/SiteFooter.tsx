import Link from "next/link";

// Rodapé numa só linha: a fonte dos dados, as páginas principais, o código e o ano
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <ul className="wrap rodape">
        <li>
          Dados: <a href="https://www.ipma.pt" target="_blank" rel="noopener">IPMA</a>
        </li>
        <li><Link href="/avisos">Avisos</Link></li>
        <li><Link href="/mar">Mar</Link></li>
        <li><Link href="/sobre">Sobre</Link></li>
        <li><Link href="/sobre#condicoes">Condições de utilização</Link></li>
        <li>
          <a href="https://github.com/miguelfcostaa/estadodopais.pt" target="_blank" rel="noopener">Código aberto (AGPL-3.0)</a>
        </li>
        <li>© 2026 estadodopais.pt</li>
      </ul>
    </footer>
  );
}
