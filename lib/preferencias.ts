// Preferências guardadas no navegador, em cookies, para a página inicial já chegar certa do servidor.

export const COOKIE_LOCAL = "previsao-local"; // slug do local escolhido
export const COOKIE_DIST = "previsao-dist"; // km até ao local, quando veio da localização
export const COOKIE_GEO = "previsao-geo"; // "pedido" depois de perguntar uma vez

const UM_ANO = 60 * 60 * 24 * 365;

function escrever(nome: string, valor: string | null) {
  document.cookie = valor === null ? `${nome}=; max-age=0; path=/; samesite=lax` : `${nome}=${encodeURIComponent(valor)}; max-age=${UM_ANO}; path=/; samesite=lax`;
}

export function lerCookie(nome: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${nome}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

// Escolha feita pela pessoa no seletor
export function guardarLocal(slug: string) {
  escrever(COOKIE_LOCAL, slug);
  escrever(COOKIE_DIST, null);
}

// Local encontrado pela localização do navegador
export function guardarLocalProximo(slug: string, km: number) {
  escrever(COOKIE_LOCAL, slug);
  escrever(COOKIE_DIST, String(Math.round(km)));
  escrever(COOKIE_GEO, "pedido");
}

export function marcarGeoPedido() {
  escrever(COOKIE_GEO, "pedido");
}
