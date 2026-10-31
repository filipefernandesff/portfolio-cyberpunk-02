// Categorias da área /materiais. Arquivo sem imports de propósito: o vite.config.ts também o lê
// para gerar o HTML (title/description) de cada rota no build.

// Troque pelo domínio e pelo nome reais (mantenha em sincronia com src/data/content.ts, index.html e public/).
export const SITE_URL = 'https://seudominio.com'
export const SITE_NOME = 'Seu Nome'

export interface MaterialCategoria {
  slug: string
  nome: string
  /** Frase curta exibida na página e usada como meta description. */
  descricao: string
}

export const categorias: MaterialCategoria[] = [
  { slug: 'skills', nome: 'Skills', descricao: 'Skills para agentes de IA que uso no dia a dia para automatizar e acelerar o trabalho.' },
  { slug: 'ferramentas', nome: 'Ferramentas', descricao: 'Ferramentas de desenvolvimento, design e produtividade que fazem parte da minha rotina.' },
]

export const categoriaPorSlug = (slug: string) => categorias.find((c) => c.slug === slug)

export const MATERIAIS_DESCRICAO =
  'Biblioteca de skills, ferramentas e recursos que utilizo no dia a dia.'

export interface MetaRota {
  title: string
  description: string
  /** Caminho canônico, sem barra final. */
  path: string
}

/** Metadados de SEO de /materiais (slug vazio) ou /materiais/<slug>. */
export const metaDaRota = (slug?: string): MetaRota => {
  const cat = slug ? categoriaPorSlug(slug) : undefined
  if (!cat) return { title: `Materiais — ${SITE_NOME}`, description: MATERIAIS_DESCRICAO, path: '/materiais' }
  return { title: `${cat.nome} — Materiais | ${SITE_NOME}`, description: cat.descricao, path: `/materiais/${cat.slug}` }
}
