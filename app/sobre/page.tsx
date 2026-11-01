import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre" };

export default function SobrePage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="label">Sobre</span>
        <h1>O tempo, sem complicar</h1>
        <p>O estadodopais.pt mostra a previsão do tempo, os avisos e o estado do mar em Portugal, com frases simples e gráficos claros.</p>
      </div>
      <div className="prose">
        <h2>De onde vêm os dados</h2>
        <p>
          Todos os dados vêm da <a href="https://api.ipma.pt" target="_blank" rel="noopener">API de dados abertos</a> do{" "}
          <a href="https://www.ipma.pt" target="_blank" rel="noopener">Instituto Português do Mar e da Atmosfera</a> (IPMA). Este site não é do IPMA e não tem ligação oficial ao instituto.
        </p>
        <h2>A sua localização</h2>
        <p>
          Na primeira visita, o site pede ao navegador a sua localização para mostrar a previsão do local do IPMA mais próximo. A conta é feita no seu
          navegador: <strong>as coordenadas não são enviadas para nenhum servidor</strong>. Só fica guardado, num cookie, o nome do local escolhido, para
          a próxima visita. Se recusar, o site mostra Lisboa e não volta a perguntar. Pode mudar de local a qualquer momento no seletor.
        </p>
        <h2 id="condicoes">Condições de utilização</h2>
        <p>
          O IPMA permite usar os seus dados <strong>sem fins lucrativos</strong>, desde que se indique sempre a fonte e a ligação ao site do instituto.
        </p>
      </div>
    </div>
  );
}
