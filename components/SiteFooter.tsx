import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap cols">
        <div>
          <Link className="brand" href="/">
            <span>aberta<b>.pt</b></span>
          </Link>
          <p>O tempo em Portugal, explicado de forma simples. Feito com os dados abertos do IPMA.</p>
        </div>
        <div>
          <span className="label">Navegar</span>
          <ul>
            <li><Link href="/">Previsão de hoje</Link></li>
            <li><Link href="/avisos">Avisos meteorológicos</Link></li>
            <li><Link href="/mar">Mar, UV e incêndio</Link></li>
            <li><Link href="/sobre">Sobre o projeto</Link></li>
          </ul>
        </div>
        <div>
          <span className="label">Dados</span>
          <ul>
            <li><a href="https://www.ipma.pt" target="_blank" rel="noopener">IPMA, I.P.</a></li>
            <li><a href="https://api.ipma.pt" target="_blank" rel="noopener">API de dados abertos</a></li>
            <li><Link href="/sobre#condicoes">Condições de utilização</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap base mono">
        <span>Dados: Instituto Português do Mar e da Atmosfera. Este site não é do IPMA.</span>
        <span>© 2026 aberta.pt</span>
      </div>
    </footer>
  );
}
