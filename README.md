# aberta (nome provisório)

Site de meteorologia para Portugal feito com os dados abertos do IPMA.

## Estado

Protótipo em Next.js, ainda sem ligação à API. Os valores são uma amostra real do IPMA (Lisboa, avisos e mar), recolhida a 30/10/2026, em `lib/data.ts`.

## Páginas

- `/` previsão de hoje (Lisboa por defeito)
- `/local/[slug]` previsão por local (35 locais da API)
- `/avisos` avisos meteorológicos
- `/mar` estado do mar ao longo da costa
- `/sobre` sobre o projeto, fonte dos dados e condições

## Estrutura

- `app/layout.tsx` cabeçalho, corpo e rodapé partilhados por todas as páginas
- `components/` cabeçalho, rodapé, meteograma, lista de dias, avisos
- `lib/` dados de exemplo e funções de formatação

## Correr localmente

```bash
npm install
npm run dev
```

## Fontes de dados

- API de dados abertos do IPMA: https://api.ipma.pt
- Os dados são do IPMA, I.P. Condições de utilização: uso sem fins lucrativos, com indicação da fonte e ligação ao site do IPMA.
