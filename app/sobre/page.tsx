import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre" };

export default function SobrePage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="label">Sobre</span>
        <h1>O tempo, sem complicar</h1>
        <p>A aberta mostra a previsão do tempo, os avisos e o estado do mar em Portugal, com frases simples e gráficos claros.</p>
      </div>
      <div className="prose">
        <h2>De onde vêm os dados</h2>
        <p>
          Todos os dados vêm da <a href="https://api.ipma.pt" target="_blank" rel="noopener">API de dados abertos</a> do{" "}
          <a href="https://www.ipma.pt" target="_blank" rel="noopener">Instituto Português do Mar e da Atmosfera</a> (IPMA). Este site não é do IPMA e não tem ligação oficial ao instituto.
        </p>
        <h2 id="condicoes">Condições de utilização</h2>
        <p>
          O IPMA permite usar os seus dados <strong>sem fins lucrativos</strong>, desde que se indique sempre a fonte e a ligação ao site do instituto.
        </p>
        <h2>Estado do projeto</h2>
        <p>Protótipo. Os valores que vê são uma amostra real recolhida a 30 de outubro de 2026 e ainda não se atualizam sozinhos.</p>
      </div>
    </div>
  );
}
