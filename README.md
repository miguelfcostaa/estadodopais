# estadodopais.pt

O estado do tempo, do mar e dos riscos em Portugal, num só sítio e explicado de forma simples. Feito com os dados abertos do IPMA.

**Site:** https://www.estadodopais.pt

## O que mostra

- **Previsão do tempo** para 35 locais do continente, da Madeira e dos Açores: hoje, os próximos 10 dias e o detalhe de cada dia (máxima e mínima, chuva, vento, humidade, nascer e pôr do sol).
- **Hora a hora** nas próximas 48 horas, num gráfico com temperatura, probabilidade de chuva e vento.
- **Avisos meteorológicos** num mapa de Portugal e por área, com os 8 tipos de aviso do IPMA e os níveis amarelo, laranja e vermelho.
- **Estado do mar** em toda a costa: altura e direção das ondas e temperatura da água.
- **Índice ultravioleta** e **risco de incêndio rural** (este só no continente), com as cores oficiais do IPMA.
- **Localização do visitante:** na primeira visita, o site pode pedir a localização para mostrar o local mais próximo. As coordenadas nunca saem do navegador.

## Páginas

| Endereço | Conteúdo |
|---|---|
| `/` | Previsão do local guardado ou mais próximo (Lisboa por omissão) |
| `/local/[slug]` | Previsão de um local: hoje, 10 dias, avisos e mais informações |
| `/local/[slug]/horas` | Gráfico hora a hora das próximas 48 horas |
| `/local/[slug]/dia/[data]` | Detalhe de um dia |
| `/avisos` | Mapa e lista de avisos de todo o país |
| `/avisos/[area]` | Avisos de uma área, por tipo |
| `/mar` | Mapa e tabela do estado do mar |
| `/sobre` | Sobre o projeto, fonte dos dados e localização |

## Tecnologia

- [Next.js](https://nextjs.org) 16 (App Router), React 19 e TypeScript, sem bibliotecas de interface: CSS próprio em `app/globals.css`, com tema escuro e claro.
- Os dados do IPMA são pedidos no servidor e guardados em cache durante **12 horas** (ISR). Não há base de dados nem chaves de API.
- Ícones do tempo, dos avisos e dos indicadores desenhados à mão em SVG (`components/WeatherIcon.tsx`, `AvisoIcon.tsx`, `FactIcon.tsx`).
- Mapas gerados a partir do Natural Earth e guardados como percursos SVG (`lib/mapa.ts`, `lib/mapa-avisos.ts`).
- Alojado na [Vercel](https://vercel.com), com publicação automática a cada push para `main`.
- Cabeçalhos de segurança (CSP, HSTS e outros) em `next.config.ts`; sitemap, robots, imagem de partilha e dados estruturados em `app/`.

## Estrutura

```
app/          páginas, layout, sitemap, robots e imagem de partilha
components/   cabeçalho, rodapé, gráfico hora a hora, carrossel, mapas, ícones, avisos
lib/
  ipma.ts       pedidos à API do IPMA e conversão dos dados
  data.ts       tipos, lista de locais, áreas de aviso e tabelas de códigos
  avisos.ts     níveis e agrupamento dos avisos
  dia.ts        resumo e momentos de cada dia
  sol.ts        nascer e pôr do sol
  format.ts     datas, horas e números em português
  site.ts       endereço, nome e descrição do site
```

## Correr localmente

Precisa do Node.js 20.9 ou mais recente.

```bash
npm install
```

```bash
npm run dev
```

O site fica em http://localhost:3000.

Para compilar e verificar os tipos:

```bash
npm run build
```

```bash
npm run typecheck
```

## Fontes de dados

- **IPMA, I.P.:** previsões, avisos, mar, índice ultravioleta e risco de incêndio, pela [API de dados abertos](https://api.ipma.pt). Condições de utilização: uso sem fins lucrativos, com indicação da fonte e ligação ao site do IPMA.
- **Natural Earth:** limites de países e distritos usados nos mapas (domínio público).
