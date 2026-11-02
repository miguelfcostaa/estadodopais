import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "O que é o estadodopais.pt, de onde vêm os dados e como tratamos a sua localização.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="label">Sobre</span>
        <h1>O que é o estadodopais.pt</h1>
        <p>A previsão do tempo para 35 locais do continente e das ilhas, os avisos do IPMA, o estado do mar, o índice ultravioleta, o risco de incêndio e a temperatura medida nas estações, numa só página por local.</p>
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
