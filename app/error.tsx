"use client";

import Link from "next/link";

// Quando uma página falha (por exemplo, a API do IPMA não responde): mensagem simples e forma de tentar outra vez
export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="label">Sem dados</span>
        <h1>Não foi possível carregar esta página</h1>
        <p>Os dados vêm da API do IPMA, que pode estar em baixo por uns minutos. Tente outra vez daqui a pouco.</p>
      </div>
      <div className="empty erro-acoes">
        <button type="button" className="pk-btn sem-seta" onClick={reset}>Tentar outra vez</button>
        <Link className="more" href="/">Voltar à previsão de hoje →</Link>
      </div>
    </div>
  );
}
