import { ArrowUpRight, Search, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { materiais, type Material } from '../data/materiais'
import { categoriaPorSlug, categorias, metaDaRota, SITE_NOME, SITE_URL } from '../data/materiais-categorias'
import Footer from './Footer'
import Header from './Header'

const POR_PAGINA = 20

interface Loc {
  slug: string
  busca: string
  pagina: number
}

const lerLocation = (): Loc => {
  const partes = window.location.pathname.split('/').filter(Boolean)
  const params = new URLSearchParams(window.location.search)
  return {
    slug: partes[1] ?? '',
    busca: params.get('q') ?? '',
    pagina: Math.max(1, parseInt(params.get('p') ?? '', 10) || 1),
  }
}

const montarUrl = ({ slug, busca, pagina }: Loc) => {
  const params = new URLSearchParams()
  if (busca) params.set('q', busca)
  if (pagina > 1) params.set('p', String(pagina))
  const qs = params.toString()
  return `/materiais${slug ? `/${slug}` : ''}${qs ? `?${qs}` : ''}`
}

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const indice = materiais.map((m) => ({ m, texto: normalizar([m.titulo, m.descricao, ...(m.tags ?? [])].join(' ')) }))

const nomeCategoria = (slug: string) => categoriaPorSlug(slug)?.nome ?? slug

const hostDe = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const definirMeta = (seletor: string, atributo: string, valor: string) => {
  document.head.querySelector(seletor)?.setAttribute(atributo, valor)
}

// Mantém title/description/canonical/og em dia quando a categoria muda sem recarregar.
// No primeiro carregamento o HTML já vem com esses valores (ver vite.config.ts).
const aplicarSeo = (slug: string) => {
  const meta = metaDaRota(slug)
  document.title = meta.title
  definirMeta('meta[name="description"]', 'content', meta.description)
  definirMeta('link[rel="canonical"]', 'href', SITE_URL + meta.path)
  definirMeta('meta[property="og:title"]', 'content', meta.title)
  definirMeta('meta[property="og:description"]', 'content', meta.description)
  definirMeta('meta[property="og:url"]', 'content', SITE_URL + meta.path)
}

const paginasVisiveis = (atual: number, total: number): (number | null)[] => {
  const base = new Set([1, total, atual - 1, atual, atual + 1].filter((n) => n >= 1 && n <= total))
  const ordenadas = [...base].sort((a, b) => a - b)
  const saida: (number | null)[] = []
  ordenadas.forEach((n, i) => {
    if (i > 0 && n - ordenadas[i - 1] > 1) saida.push(null)
    saida.push(n)
  })
  return saida
}

interface RotaProps {
  to: string
  ir: (to: string) => void
  className?: string
  children: ReactNode
  ariaCurrent?: boolean
  style?: CSSProperties
}

// Link interno: navega sem recarregar, mas preserva ctrl/cmd+clique e botão do meio.
function Rota({ to, ir, className, children, ariaCurrent, style }: RotaProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    ir(to)
  }
  return (
    <a href={to} onClick={onClick} aria-current={ariaCurrent ? 'page' : undefined} className={className} style={style}>
      {children}
    </a>
  )
}

function CardMaterial({ m }: { m: Material }) {
  return (
    <article
      className="flex flex-col gap-3 rounded-2xl border border-[rgba(168,85,247,0.28)] p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#ff3ec8]"
      style={{ background: 'linear-gradient(180deg,rgba(26,14,50,.9),rgba(12,7,25,.9))' }}
    >
      <div className="text-[11px] font-semibold tracking-[0.16em] text-[#ff3ec8] uppercase">{nomeCategoria(m.categoria)}</div>
      <h3 className="m-0 font-display text-[16px] leading-[1.25] font-bold tracking-[0.04em] text-white uppercase">{m.titulo}</h3>
      <p className="m-0 text-[15px] leading-[1.5] text-[#a99fc4]">{m.descricao}</p>
      {m.tags && m.tags.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
          {m.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-[rgba(168,85,247,0.3)] px-[10px] py-[2px] text-[12px] text-[#bdb2d8]"
              style={{ background: 'rgba(124,42,232,.14)' }}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[rgba(168,85,247,0.2)] pt-3">
        <span className="min-w-0 truncate text-[12px] text-[#7f719f]">{hostDe(m.url)}</span>
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Acessar ${m.titulo} (abre em nova aba)`}
          className="inline-flex min-h-[40px] flex-none items-center gap-[6px] rounded-full border border-[rgba(255,62,200,0.4)] px-4 font-display text-[12px] font-bold tracking-[0.14em] text-[#ff3ec8] uppercase transition-[background-color,color,box-shadow] duration-200 hover:bg-[#ff3ec8] hover:text-[#07040f] hover:shadow-[0_0_18px_rgba(255,62,200,.45)]"
          style={{ background: 'rgba(255,62,200,.12)' }}
        >
          Acessar <ArrowUpRight size={14} strokeWidth={2.5} />
        </a>
      </div>
    </article>
  )
}

export default function Materiais() {
  const [loc, setLoc] = useState(lerLocation)
  const listaRef = useRef<HTMLDivElement>(null)
  const chipsRef = useRef<HTMLElement>(null)
  const categoria = categoriaPorSlug(loc.slug)
  const invalida = loc.slug !== '' && !categoria

  const navegar = useCallback((proximo: Loc, substituir = false) => {
    const url = montarUrl(proximo)
    if (substituir) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
    setLoc(proximo)
  }, [])

  const irPara = useCallback(
    (to: string) => {
      const u = new URL(to, window.location.origin)
      window.history.pushState(null, '', u.pathname + u.search)
      setLoc(lerLocation())
    },
    [],
  )

  useEffect(() => {
    const onPop = () => setLoc(lerLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    aplicarSeo(loc.slug)
    if (invalida) document.title = `Categoria não encontrada — Materiais | ${SITE_NOME}`
  }, [loc.slug, invalida])

  // Chip da categoria ativa sempre visível na faixa horizontal (mobile/tablet).
  useEffect(() => {
    chipsRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [loc.slug])

  const termos = useMemo(() => normalizar(loc.busca).split(/\s+/).filter(Boolean), [loc.busca])

  const filtrados = useMemo(
    () =>
      indice
        .filter(({ m, texto }) => (!loc.slug || m.categoria === loc.slug) && termos.every((t) => texto.includes(t)))
        .map(({ m }) => m),
    [loc.slug, termos],
  )

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const pagina = Math.min(loc.pagina, totalPaginas)
  const visiveis = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const contagem = useMemo(() => {
    const c: Record<string, number> = {}
    materiais.forEach((m) => {
      c[m.categoria] = (c[m.categoria] ?? 0) + 1
    })
    return c
  }, [])

  const irParaPagina = (n: number) => {
    navegar({ ...loc, pagina: n })
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    listaRef.current?.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' })
  }

  const itensNav = [{ slug: '', nome: 'Todos', total: materiais.length }, ...categorias.map((c) => ({ slug: c.slug, nome: c.nome, total: contagem[c.slug] ?? 0 }))]
  const hrefDe = (slug: string) => (slug ? `/materiais/${slug}` : '/materiais')
  const meta = metaDaRota(loc.slug)

  return (
    <div className="min-h-screen bg-[#07040f] text-[#e8e2f5]" style={{ fontFamily: 'var(--font-body)' }}>
      <Header />
      <main className="px-[clamp(16px,4vw,40px)] pt-[clamp(32px,5vw,64px)] pb-[clamp(48px,6vw,80px)]">
        <div className="relative mx-auto max-w-[1280px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-[260px] w-[min(560px,90%)] opacity-60"
            style={{ background: 'radial-gradient(closest-side,rgba(124,42,232,.35),rgba(7,4,15,0))' }}
          />

          <header className="relative">
            <div className="flex items-center gap-[10px] font-display text-[12px] font-bold tracking-[0.3em] text-[#ff3ec8] uppercase">
              <span>◈</span> Biblioteca
            </div>
            <h1 className="m-0 mt-3 font-display text-[clamp(38px,6vw,76px)] leading-[0.95] font-bold tracking-[-0.01em] text-white uppercase">
              Materiais
              {categoria && <span className="text-[#ff3ec8]"> / {categoria.nome}</span>}
            </h1>
            <p className="m-0 mt-4 max-w-[640px] text-[clamp(16px,1.6vw,19px)] leading-[1.5] text-[#a99fc4]">
              {invalida ? 'Essa categoria não existe. Escolha uma das categorias abaixo.' : categoria ? categoria.descricao : 'Biblioteca de skills, ferramentas e recursos que utilizo no dia a dia. Escolha uma categoria ou busque pelo que precisa.'}
            </p>
          </header>

          <div className="relative mt-[clamp(24px,3vw,40px)] grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
            {/* Mobile/tablet: faixa horizontal com scroll */}
            <nav
              ref={chipsRef}
              aria-label="Categorias de materiais"
              className="-mx-[clamp(16px,4vw,40px)] flex gap-2 overflow-x-auto px-[clamp(16px,4vw,40px)] pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
            >
              {itensNav.map((item) => {
                const ativo = item.slug === loc.slug
                return (
                  <Rota
                    key={item.slug || 'todos'}
                    to={hrefDe(item.slug)}
                    ir={irPara}
                    ariaCurrent={ativo}
                    style={ativo ? { background: 'linear-gradient(100deg,#7c2ae8,#ff3ec8)' } : undefined}
                    className={`inline-flex min-h-[44px] flex-none items-center rounded-full border px-4 font-display text-[12px] font-bold tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-200 ${
                      ativo
                        ? 'border-transparent text-white'
                        : 'border-[rgba(168,85,247,0.35)] text-[#cfc5e8] hover:border-[#ff3ec8] hover:text-[#ff3ec8]'
                    }`}
                  >
                    {item.nome}
                  </Rota>
                )
              })}
            </nav>

            {/* Desktop: sidebar */}
            <aside className="hidden lg:block">
              <nav
                aria-label="Categorias de materiais"
                className="sticky top-[var(--header-h,96px)] flex flex-col gap-1 rounded-2xl border border-[rgba(168,85,247,0.28)] p-3"
                style={{ background: 'linear-gradient(180deg,rgba(24,13,46,.7),rgba(11,6,22,.8))' }}
              >
                {itensNav.map((item) => {
                  const ativo = item.slug === loc.slug
                  return (
                    <Rota
                      key={item.slug || 'todos'}
                      to={hrefDe(item.slug)}
                      ir={irPara}
                      ariaCurrent={ativo}
                      className={`flex items-center justify-between gap-3 rounded-xl border-l-2 px-3 py-[10px] font-display text-[13px] font-semibold tracking-[0.12em] uppercase transition-colors duration-200 ${
                        ativo
                          ? 'border-[#ff3ec8] bg-[rgba(255,62,200,.1)] text-[#ff3ec8]'
                          : 'border-transparent text-[#cfc5e8] hover:bg-[rgba(168,85,247,.1)] hover:text-white'
                      }`}
                    >
                      <span>{item.nome}</span>
                      <span className="text-[12px] font-normal tracking-normal text-[#7f719f]">{item.total}</span>
                    </Rota>
                  )
                })}
              </nav>
            </aside>

            <section ref={listaRef} className="min-w-0 scroll-mt-[var(--header-h,96px)]" aria-label="Lista de materiais">
              <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
                <Search aria-hidden="true" size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#7f719f]" />
                <input
                  type="search"
                  name="q"
                  value={loc.busca}
                  onChange={(e) => navegar({ ...loc, busca: e.target.value, pagina: 1 }, true)}
                  placeholder="Buscar por título, descrição ou tag"
                  aria-label="Buscar materiais"
                  enterKeyHint="search"
                  autoComplete="off"
                  className="h-12 w-full rounded-full border border-[rgba(168,85,247,0.35)] bg-[rgba(15,8,30,.8)] pr-11 pl-11 text-[16px] text-[#e8e2f5] placeholder:text-[#7f719f] transition-[border-color,box-shadow] duration-200 outline-none focus:border-[#ff3ec8] focus:shadow-[0_0_18px_rgba(255,62,200,.25)] [&::-webkit-search-cancel-button]:hidden"
                />
                {loc.busca && (
                  <button
                    type="button"
                    aria-label="Limpar busca"
                    onClick={() => navegar({ ...loc, busca: '', pagina: 1 }, true)}
                    className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#a99fc4] transition-colors duration-200 hover:text-[#ff3ec8]"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              <div className="mt-4 mb-4 text-[13px] text-[#7f719f]" aria-live="polite">
                {invalida ? '' : `${filtrados.length} ${filtrados.length === 1 ? 'material' : 'materiais'}`}
                {termos.length > 0 && !invalida && ` para “${loc.busca.trim()}”`}
              </div>

              {visiveis.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
                  {visiveis.map((m) => (
                    <CardMaterial key={m.id} m={m} />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl border border-dashed border-[rgba(168,85,247,0.35)] px-6 py-12 text-center"
                  style={{ background: 'rgba(15,8,30,.5)' }}
                >
                  <p className="m-0 font-display text-[16px] font-bold tracking-[0.08em] text-white uppercase">
                    {invalida ? 'Categoria não encontrada' : termos.length > 0 ? 'Nenhum resultado' : 'Nada por aqui ainda'}
                  </p>
                  <p className="m-0 mt-2 text-[15px] text-[#a99fc4]">
                    {invalida
                      ? 'Use as categorias para navegar pelos materiais.'
                      : termos.length > 0
                        ? 'Nenhum material bate com a busca. Tente outras palavras.'
                        : 'Ainda não há materiais nesta categoria.'}
                  </p>
                  {(invalida || termos.length > 0) && (
                    <Rota
                      to={termos.length > 0 && !invalida ? meta.path : '/materiais'}
                      ir={irPara}
                      className="mt-5 inline-flex min-h-[40px] items-center rounded-full border border-[rgba(255,62,200,0.4)] px-5 font-display text-[12px] font-bold tracking-[0.14em] uppercase"
                    >
                      {termos.length > 0 && !invalida ? 'Limpar busca' : 'Ver todos os materiais'}
                    </Rota>
                  )}
                </div>
              )}

              {totalPaginas > 1 && (
                <nav aria-label="Paginação" className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <BotaoPagina desabilitado={pagina === 1} onClick={() => irParaPagina(pagina - 1)} rotulo="Página anterior">
                    ←
                  </BotaoPagina>
                  {paginasVisiveis(pagina, totalPaginas).map((n, i) =>
                    n === null ? (
                      <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-[#7f719f]">
                        …
                      </span>
                    ) : (
                      <BotaoPagina key={n} ativo={n === pagina} onClick={() => irParaPagina(n)} rotulo={`Página ${n}`}>
                        {n}
                      </BotaoPagina>
                    ),
                  )}
                  <BotaoPagina desabilitado={pagina === totalPaginas} onClick={() => irParaPagina(pagina + 1)} rotulo="Próxima página">
                    →
                  </BotaoPagina>
                </nav>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface BotaoPaginaProps {
  children: ReactNode
  rotulo: string
  onClick: () => void
  ativo?: boolean
  desabilitado?: boolean
}

function BotaoPagina({ children, rotulo, onClick, ativo, desabilitado }: BotaoPaginaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desabilitado}
      aria-label={rotulo}
      aria-current={ativo ? 'page' : undefined}
      className={`grid h-11 min-w-11 place-items-center rounded-full border px-3 font-display text-[13px] font-bold transition-[border-color,color,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-35 ${
        ativo
          ? 'border-[#ff3ec8] text-white shadow-[0_0_16px_rgba(255,62,200,.4)]'
          : 'border-[rgba(168,85,247,0.35)] text-[#cfc5e8] enabled:hover:border-[#ff3ec8] enabled:hover:text-[#ff3ec8]'
      }`}
      style={ativo ? { background: 'linear-gradient(100deg,#7c2ae8,#ff3ec8)' } : undefined}
    >
      {children}
    </button>
  )
}
