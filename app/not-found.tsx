import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="label">Erro 404</span>
        <h1>Esta página não existe</h1>
        <p>Pode ter sido mudada de sítio ou o endereço tem um erro.</p>
      </div>
      <div className="empty">
        <Link className="more" href="/">Voltar à previsão de hoje →</Link>
      </div>
    </div>
  );
}
