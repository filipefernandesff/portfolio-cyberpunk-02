export interface Metrica {
  icone: string
  valor: string
  rotulo: string
}

export interface Servico {
  icone: string
  titulo: string
  texto: string
}

export type Dispositivo = 'desktop' | 'mobile' | 'tablet'

export interface ProjetoImagem {
  dispositivo: Dispositivo
  legenda: string
  /** URL da imagem (ex.: '/projetos/meu-projeto/home.webp' ou um bucket/CDN seu). Sem src = mostra placeholder. */
  src?: string
}

export interface Projeto {
  nome: string
  tagline: string
  descricao: string
  categoria: string
  papel: string
  periodo: string
  cliente: string
  /** Opcional. Site do cliente/empresa: transforma `cliente` em link no modal. */
  clienteLink?: string
  link?: string
  tecnologias: string[]
  galeria: ProjetoImagem[]
  /** Opcional. Padrão: desktop, mobile e tablet habilitados. Ex.: dispositivos: ['mobile'] deixa só mobile. */
  dispositivos?: Dispositivo[]
  /** Imagem de capa do card (miniatura leve). Sem ela, usa a 1ª imagem da galeria — geralmente pesada demais para um card. */
  capa?: string
  /** Opcional. Selo exibido no card (ex.: 'Em desenvolvimento'). Sem capa, fica centralizado no lugar da imagem. */
  status?: string
}

export interface Tecnologia {
  sigla: string
  nome: string
}

export interface Etapa {
  numero: string
  titulo: string
  texto: string
}

export interface Depoimento {
  texto: string
  nome: string
  cargo: string
  /** Opcional. Foto do cliente (círculo de 42px). Sem foto, mostra o padrão listrado. */
  foto?: string
}

export const site = {
  marca: 'Seu Nome',
  nome: 'Seu',
  sobrenome: 'Nome',
  disponivel: true,
  email: 'contato@seudominio.com',
  local: 'Brasil · Remoto',
}

// Formato internacional, só dígitos: código do país + DDD + número (ex.: 5511999999999).
const WHATSAPP_PHONE = '5500900000000'

const whatsappUrl = (text: string) =>
  `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`

export const whatsappConversar = whatsappUrl('Olá! Quero conversar sobre uma ideia. Podemos falar?')
export const whatsappProjeto = whatsappUrl('Olá! Estou com uma ideia e quero tirar esse projeto do papel. Bora criar? 🚀')

export const statusTexto = site.disponivel ? 'Disponível para projetos' : 'Agenda fechada'
export const disponibilidade = site.disponivel ? 'Aberto a novos projetos' : 'Fila de espera'
export const rodape = `© 2026 ${site.marca}. Todos os direitos reservados.`

export const metricas: Metrica[] = [
  { icone: '◆', valor: '08+', rotulo: 'Anos de experiência' },
  { icone: '⧉', valor: '12+', rotulo: 'Projetos entregues' },
  { icone: '◉', valor: '09+', rotulo: 'Clientes satisfeitos' },
  { icone: '★', valor: '06', rotulo: 'Prêmios e destaques' },
]

export const servicos: Servico[] = [
  { icone: '◍', titulo: 'Sites & Landing Pages', texto: 'Sites rápidos, responsivos e pensados para apresentar sua marca, gerar confiança e transformar visitas em oportunidades.' },
  { icone: '▣', titulo: 'Sistemas & SaaS', texto: 'Sistemas web e plataformas SaaS sob medida, com banco de dados, autenticação, dashboards e tudo que o produto precisa para crescer.' },
  { icone: '⌘', titulo: 'IA & Automações', texto: 'Agentes de IA, automações e fluxos inteligentes que conectam ferramentas e tiram tarefas repetitivas do caminho.' },
  { icone: '◈', titulo: 'APIs & Integrações', texto: 'Integrações que fazem seus sistemas conversarem, conectando APIs, pagamentos, marketplaces e serviços externos.' },
]

// Para adicionar telas: coloque a imagem em /public/projetos/<projeto>/ e inclua
// { dispositivo, legenda, src: '/projetos/<projeto>/tela.webp' } em `galeria`. O modal se adapta sozinho.
// Sem `src`, o modal mostra um placeholder. Troque os projetos de exemplo abaixo pelos seus.
export const projetos: Projeto[] = [
  {
    nome: 'Projeto Exemplo 1', tagline: 'Plataforma web',
    descricao: 'Descreva aqui o que o projeto faz, para quem e qual problema ele resolve.',
    categoria: 'Plataforma web',
    papel: 'Arquitetura · Desenvolvimento · Integrações',
    periodo: '2024 – Atual',
    cliente: 'Nome do cliente ou "Projeto próprio"',
    tecnologias: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind'],
    galeria: [
      { dispositivo: 'desktop', legenda: 'Página inicial' },
      { dispositivo: 'desktop', legenda: 'Painel' },
      { dispositivo: 'mobile', legenda: 'Página inicial' },
      { dispositivo: 'tablet', legenda: 'Painel' },
    ],
  },
  {
    nome: 'Projeto Exemplo 2', tagline: 'SaaS com IA',
    descricao: 'Descreva aqui o que o projeto faz, para quem e qual problema ele resolve.',
    categoria: 'SaaS / IA / Automação',
    papel: 'Produto · Arquitetura · Desenvolvimento',
    periodo: '2025',
    cliente: 'Nome do cliente ou "Projeto próprio"',
    tecnologias: ['React', 'TypeScript', 'Tailwind', 'PostgreSQL', 'OpenAI', 'n8n'],
    galeria: [
      { dispositivo: 'desktop', legenda: 'Página inicial' },
      { dispositivo: 'mobile', legenda: 'Painel' },
    ],
  },
  {
    nome: 'Projeto Exemplo 3', tagline: 'Hub corporativo', status: 'Em desenvolvimento',
    descricao: 'Descreva aqui o que o projeto faz, para quem e qual problema ele resolve.',
    categoria: 'Software B2B',
    papel: 'Arquitetura · Desenvolvimento',
    periodo: '2025 – Atual',
    cliente: 'Nome do cliente ou "Projeto próprio"',
    tecnologias: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind'],
    galeria: [
      { dispositivo: 'desktop', legenda: 'Dashboard' },
      { dispositivo: 'tablet', legenda: 'Visão em tablet' },
    ],
  },
]

export const tecnologias: Tecnologia[] = [
  { sigla: 'HTML', nome: 'HTML5' },
  { sigla: 'CSS', nome: 'CSS3' },
  { sigla: 'JS', nome: 'JavaScript' },
  { sigla: 'TS', nome: 'TypeScript' },
  { sigla: 'Re', nome: 'React' },
  { sigla: 'N', nome: 'Next.js' },
  { sigla: 'Nd', nome: 'Node.js' },
  { sigla: 'PG', nome: 'PostgreSQL' },
  { sigla: 'Sb', nome: 'Supabase' },
  { sigla: 'TW', nome: 'Tailwind' },
  { sigla: '3js', nome: 'Three.js' },
  { sigla: 'Gs', nome: 'GSAP' },
  { sigla: 'Git', nome: 'Git' },
  { sigla: 'Fg', nome: 'Figma' },
]

export const processo: Etapa[] = [
  { numero: '01', titulo: 'Descobrir', texto: 'Entender objetivos, público e a direção criativa do projeto.' },
  { numero: '02', titulo: 'Planejar', texto: 'Estratégia, wireframes e planejamento das interações.' },
  { numero: '03', titulo: 'Desenhar', texto: 'Criar uma interface marcante com foco na experiência.' },
  { numero: '04', titulo: 'Desenvolver', texto: 'Transformar o design em código limpo e eficiente.' },
  { numero: '05', titulo: 'Publicar', texto: 'Testes, otimização e lançamento sem sobressaltos.' },
]

export const depoimentos: Depoimento[] = [
  // `foto` é opcional: importe uma imagem de src/assets/images e passe aqui. Sem foto, mostra o padrão listrado.
  { texto: 'Escreva aqui o depoimento de um cliente real (com autorização dele para publicar).', nome: 'Nome do Cliente', cargo: 'Cargo, Empresa' },
]
