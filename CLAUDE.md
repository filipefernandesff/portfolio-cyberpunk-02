# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# portifolio-cyberpunk-02

Portfólio estático (Vite + React + Tailwind) (conteúdo de exemplo: troque nome, contatos, domínio e projetos pelos seus).

## Deploy

- Site estático: a saída de `npm run build` fica em `dist/` e pode ir para qualquer hospedagem
  estática (Cloudflare Pages, Netlify, Vercel...). Se o deploy for automático a cada push no
  `main`, rode `npm run build`, `npm run lint` e `npm audit` antes de dar push.
- Para desfazer uma publicação ruim: `git revert <hash>` e novo push.

## Comandos

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — `tsc -b && vite build` (saída em `dist/`)
- `npm run lint` — oxlint
- `npm run preview` — serve o `dist/` localmente

## Arquitetura

- **Sem roteador de verdade.** `src/Raiz.tsx` decide entre duas "páginas" só
  olhando `window.location.pathname`: `/materiais*` carrega `src/components/Materiais.tsx`
  (via `lazy()`, para não pesar o bundle da home); qualquer outro caminho renderiza
  `src/App.tsx`. Dentro de cada página, navegação é por âncora (`#secao`) com scroll-spy
  manual (ver `Header.tsx`), não por rotas de componente.
- **`src/App.tsx`** é a home: uma sequência fixa de seções (`Hero`, `Sobre`, `Servicos`,
  `Projetos`, `Tecnologias`, `Processo`, `Depoimentos`, `Contato`) dentro de `Header` +
  `Footer`. Para adicionar uma seção, crie o componente em `src/components/` e insira-o
  nessa lista — o nav do `Header` também precisa do link correspondente.
- **`src/components/Materiais.tsx`** é a área `/materiais` (biblioteca de categorias/itens
  com busca e paginação client-side). Lê o path/query string direto de `window.location`
  (sem lib de rotas) e re-renderiza no `popstate`.
- **Conteúdo é dado, não JSX.** Praticamente todo texto/imagem/link do site vive em
  `src/data/content.ts` (site, serviços, projetos, tecnologias, depoimentos, etc.) e
  `src/data/materiais.ts` / `src/data/materiais-categorias.ts` (itens e categorias de
  `/materiais`). Componentes majoritariamente mapeiam esses arrays — edições de conteúdo
  geralmente são só em `src/data/*.ts`, não nos componentes.
- **SEO estático por rota em build-time**: `vite.config.ts` tem um plugin Vite
  (`materiaisSeo`) que, após o build, duplica `dist/index.html` para
  `dist/materiais/<categoria>/index.html` com `<title>`/`description`/`canonical`/`og:*`
  próprios de cada categoria (definidos em `metaDaRota()` de `materiais-categorias.ts`).
  Isso existe porque crawlers sem JS (e prévias de link) só veem o HTML servido
  estaticamente pelo Cloudflare Pages, não o que o React troca em runtime via
  `aplicarSeo()` dentro de `Materiais.tsx`. Ao adicionar categoria nova, as duas pontas
  (build-time e runtime) precisam ficar consistentes.
- Estilização é Tailwind v4 via `@tailwindcss/vite` (sem `tailwind.config.js` — config
  fica em CSS, ver `src/index.css`), com classes de cor hardcoded em hexadecimal
  (`#07040f`, `#e8e2f5`) em vez de tokens de tema.

## Notas

- `public/projetos/` está no `.gitignore` (capturas podem ter dados de clientes). Os projetos em
  `src/data/content.ts` não têm `src` nas imagens e mostram placeholder; para usar capturas
  reais, aponte `src` para `/projetos/<projeto>/<tela>.webp` ou para um bucket/CDN seu.
- TypeScript fica na 6.x de propósito: o TS 7 liga `strict` por padrão e não tem API
  programática (volta no 7.1). Migrar só com decisão explícita.
- framer-motion fica na 13.x (a 14 não foi avaliada).
- Não existe `.env` nem backend; não há segredos no repositório.

## Issues no GitHub

- Sempre que surgir um problema que não será resolvido na sessão (pelo menos a princípio), documente-o como issue no GitHub (`gh issue create`), com contexto, causa provável e como reproduzir.
- Sempre que formos consertar problemas, informe se já existem outros issues cadastrados no GitHub (`gh issue list`) relacionados ao que estamos mexendo.
- Nunca delete issues resolvidos: feche-os. Se a correção vem de um commit, use `Fixes #N` na mensagem; se não, use `gh issue close N --comment "<o que foi feito>"`.
