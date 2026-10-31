import type { MaterialCategoria } from './materiais-categorias'

export interface Material {
  /** Único e estável (usado como key). */
  id: string
  titulo: string
  /** 1–2 frases. */
  descricao: string
  /** slug de uma categoria em materiais-categorias.ts */
  categoria: MaterialCategoria['slug']
  tags?: string[]
  /** Link do recurso original. */
  url: string
}

// Para cadastrar um material novo: copie um item abaixo, troque os campos e salve.
// Categorias novas: materiais-categorias.ts (a rota /materiais/<slug> nasce sozinha).
export const materiais: Material[] = [
  {
    id: 'caveman',
    titulo: 'Caveman',
    descricao: 'Skill para agentes de código que faz o modelo responder de forma ultra-direta, cortando tokens e enrolação.',
    categoria: 'skills',
    tags: ['tokens', 'agentes', 'produtividade'],
    url: 'https://github.com/juliusbrussee/caveman',
  },
  {
    id: 'graphify',
    titulo: 'Graphify',
    descricao: 'Transforma código, docs, schemas e PDFs em um grafo de conhecimento consultável, direto do seu agente com o comando /graphify.',
    categoria: 'skills',
    tags: ['grafo', 'código', 'agentes'],
    url: 'https://github.com/Graphify-Labs/graphify',
  },
  {
    id: 'ai-website-cloner-template',
    titulo: 'AI Website Cloner Template',
    descricao: 'Template para clonar qualquer site com um único comando usando agentes de código, com engenharia reversa do layout em Next.js e shadcn/ui.',
    categoria: 'skills',
    tags: ['clonagem', 'agentes', 'nextjs'],
    url: 'https://github.com/JCodesMore/ai-website-cloner-template',
  },
  {
    id: 'chrome-devtools-mcp',
    titulo: 'Chrome DevTools MCP',
    descricao: 'Servidor MCP que dá ao agente acesso ao Chrome DevTools para depurar páginas, medir performance e automatizar o navegador.',
    categoria: 'ferramentas',
    tags: ['mcp', 'debug', 'performance'],
    url: 'https://github.com/ChromeDevTools/chrome-devtools-mcp',
  },
  {
    id: 'vite',
    titulo: 'Vite',
    descricao: 'Ferramenta de build e servidor de desenvolvimento rápido, base deste portfólio.',
    categoria: 'ferramentas',
    tags: ['frontend', 'build'],
    url: 'https://vite.dev',
  },
  {
    id: 'cloudflare-pages',
    titulo: 'Cloudflare Pages',
    descricao: 'Hospedagem estática com deploy automático a cada push — onde este portfólio está publicado.',
    categoria: 'ferramentas',
    tags: ['deploy', 'hospedagem'],
    url: 'https://developers.cloudflare.com/pages/',
  },
]
