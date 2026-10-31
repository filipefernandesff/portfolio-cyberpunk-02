import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Briefcase, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Link2, Maximize2, UserRound, X } from 'lucide-react'
import type { Dispositivo, Projeto, ProjetoImagem } from '../data/content'

const dispositivos: { id: Dispositivo; rotulo: string }[] = [
  { id: 'desktop', rotulo: 'Desktop' },
  { id: 'mobile', rotulo: 'Mobile' },
  { id: 'tablet', rotulo: 'Tablet' },
]

const pad = (n: number) => String(n).padStart(2, '0')

// Dimensões esperadas das imagens (px) por dispositivo. A moldura mantém essa proporção.
const medidas: Record<Dispositivo, { w: number; h: number }> = {
  desktop: { w: 1920, h: 1200 },
  mobile: { w: 1080, h: 1920 },
  tablet: { w: 1600, h: 1200 },
}

function Placeholder({ img, className = '' }: { img: ProjetoImagem; className?: string }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center ${className}`}
      style={{
        backgroundColor: '#120a26',
        backgroundImage: 'repeating-linear-gradient(135deg,rgba(255,62,200,.13) 0 2px,rgba(255,62,200,0) 2px 12px)',
      }}
    >
      <span className="text-[10px] tracking-[0.12em] text-[#8f7fb8]" style={{ fontFamily: 'ui-monospace,Menlo,monospace' }}>
        [ {img.dispositivo} ]
      </span>
      <span className="font-display text-[clamp(11px,1.4vw,16px)] font-bold tracking-[0.1em] text-white uppercase">{img.legenda}</span>
      <span className="text-[10px] tracking-[0.12em] text-[#ff3ec8]" style={{ fontFamily: 'ui-monospace,Menlo,monospace' }}>
        {medidas[img.dispositivo].w} × {medidas[img.dispositivo].h} px
      </span>
    </div>
  )
}

// As capturas reais (public/projetos/**) não são versionadas — ver .gitignore.
// Sem o arquivo no disco, o <img> falha o load e cai no mesmo placeholder de "sem src".
function Tela({ img, projeto, className = '' }: { img: ProjetoImagem; projeto: string; className?: string }) {
  const [falhou, setFalhou] = useState(false)
  if (!img.src || falhou) return <Placeholder img={img} className={className} />
  return (
    <img
      src={img.src}
      alt={`${projeto} — ${img.legenda}`}
      className={`h-full w-full object-contain ${className}`}
      draggable={false}
      onError={() => setFalhou(true)}
    />
  )
}

type GestureModo = 'idle' | 'pan' | 'pinch' | 'swipe'
interface Ponto { x: number; y: number }

const distancia = (a: Ponto, b: Ponto) => Math.hypot(a.x - b.x, a.y - b.y)
const pontoMedio = (a: Ponto, b: Ponto): Ponto => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

// Fullscreen premium: pinch-zoom, pan, double-tap e swipe entre imagens via Pointer Events (sem libs externas).
function Lightbox({
  imagens,
  indice,
  projeto,
  onIndiceChange,
  onFechar,
}: {
  imagens: ProjetoImagem[]
  indice: number
  projeto: string
  onIndiceChange: (i: number) => void
  onFechar: () => void
}) {
  const total = imagens.length
  const atual = imagens[indice]

  const containerRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const gesto = useRef({
    pointers: new Map<number, Ponto>(),
    modo: 'idle' as GestureModo,
    startDist: 0,
    startScale: 1,
    startTranslate: { x: 0, y: 0 } as Ponto,
    startPoint: { x: 0, y: 0 } as Ponto,
    lastTapTime: 0,
    lastTapPoint: { x: 0, y: 0 } as Ponto,
  })

  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState<Ponto>({ x: 0, y: 0 })
  const [origin, setOrigin] = useState('50% 50%')
  const [dragX, setDragX] = useState(0)
  const [gesturing, setGesturing] = useState(false)

  const resetView = () => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
    setOrigin('50% 50%')
    setDragX(0)
  }

  const ir = (delta: number) => {
    if (total < 2) return
    resetView()
    onIndiceChange((indice + delta + total) % total)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
      else if (e.key === 'ArrowLeft') ir(-1)
      else if (e.key === 'ArrowRight') ir(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const clampTranslate = (x: number, y: number, s: number): Ponto => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x, y }
    const maxX = (rect.width * (s - 1)) / 2
    const maxY = (rect.height * (s - 1)) / 2
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) }
  }

  const origemNoToque = (p: Ponto) => {
    const rect = imgWrapRef.current?.getBoundingClientRect()
    if (!rect) return '50% 50%'
    const ox = Math.min(100, Math.max(0, ((p.x - rect.left) / rect.width) * 100))
    const oy = Math.min(100, Math.max(0, ((p.y - rect.top) / rect.height) * 100))
    return `${ox}% ${oy}%`
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    const st = gesto.current
    const p = { x: e.clientX, y: e.clientY }
    st.pointers.set(e.pointerId, p)
    setGesturing(true)

    if (st.pointers.size === 2) {
      const [p1, p2] = [...st.pointers.values()]
      st.modo = 'pinch'
      st.startDist = distancia(p1, p2)
      st.startScale = scale
      setOrigin(origemNoToque(pontoMedio(p1, p2)))
    } else if (st.pointers.size === 1) {
      const agora = Date.now()
      const toqueDuplo = agora - st.lastTapTime < 320 && distancia(st.lastTapPoint, p) < 32
      st.lastTapTime = toqueDuplo ? 0 : agora
      st.lastTapPoint = p
      if (toqueDuplo) {
        if (scale > 1) {
          resetView()
        } else {
          setOrigin(origemNoToque(p))
          setTranslate({ x: 0, y: 0 })
          setScale(2.5)
        }
        st.modo = 'idle'
      } else {
        st.modo = scale > 1 ? 'pan' : 'swipe'
        st.startPoint = p
        st.startTranslate = { ...translate }
      }
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = gesto.current
    if (!st.pointers.has(e.pointerId)) return
    const p = { x: e.clientX, y: e.clientY }
    st.pointers.set(e.pointerId, p)

    if (st.modo === 'pinch' && st.pointers.size === 2) {
      const [p1, p2] = [...st.pointers.values()]
      const d = distancia(p1, p2)
      setScale(Math.min(4, Math.max(1, st.startScale * (d / st.startDist))))
    } else if (st.modo === 'pan') {
      const dx = p.x - st.startPoint.x
      const dy = p.y - st.startPoint.y
      setTranslate(clampTranslate(st.startTranslate.x + dx, st.startTranslate.y + dy, scale))
    } else if (st.modo === 'swipe') {
      setDragX(p.x - st.startPoint.x)
    }
  }

  const finalizarGesto = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = gesto.current
    st.pointers.delete(e.pointerId)

    if (st.modo === 'swipe') {
      if (total > 1 && dragX < -60) ir(1)
      else if (total > 1 && dragX > 60) ir(-1)
      else setDragX(0)
    }
    if (st.modo === 'pinch' && scale <= 1) resetView()

    if (st.pointers.size === 0) {
      st.modo = 'idle'
      setGesturing(false)
    } else if (st.pointers.size === 1) {
      const restante = [...st.pointers.values()][0]
      st.modo = scale > 1 ? 'pan' : 'swipe'
      st.startPoint = restante
      st.startTranslate = { ...translate }
    }
  }

  const navBtn = 'absolute top-1/2 z-[2] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-colors hover:border-[#ff3ec8] hover:text-[#ff3ec8] sm:h-12 sm:w-12'

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex flex-col bg-[rgba(3,1,8,0.97)]"
      style={{ touchAction: 'none' }}
      onMouseDown={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="flex flex-none items-center justify-between gap-3 p-3 sm:p-4" style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 10px)' }}>
        <button
          aria-label="Fechar visualização"
          onClick={onFechar}
          className="grid h-11 w-11 flex-none cursor-pointer place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-colors hover:border-[#ff3ec8] hover:text-[#ff3ec8]"
        >
          <X size={20} />
        </button>
        <div className="font-display text-[12px] font-semibold tracking-[0.18em] text-white/80">
          {pad(indice + 1)} / {pad(total)}
        </div>
        <div className="h-11 w-11 flex-none" />
      </div>

      <div
        ref={containerRef}
        className="relative flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finalizarGesto}
        onPointerCancel={finalizarGesto}
      >
        {total > 1 && (
          <>
            <button aria-label="Imagem anterior" onClick={() => ir(-1)} className={`${navBtn} left-2 cursor-pointer sm:left-4`}>
              <ChevronLeft size={24} />
            </button>
            <button aria-label="Próxima imagem" onClick={() => ir(1)} className={`${navBtn} right-2 cursor-pointer sm:right-4`}>
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div
          ref={imgWrapRef}
          className="h-full w-full p-3 sm:p-8"
          style={{
            transform: `translate(${translate.x + dragX}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: origin,
            transition: gesturing ? 'none' : 'transform 0.25s ease',
          }}
        >
          {atual && <Tela img={atual} projeto={projeto} />}
        </div>
      </div>

      <div className="flex flex-none flex-col items-center gap-2 p-3 sm:p-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 10px)' }}>
        {total > 1 && (
          <div className="flex gap-1.5">
            {imagens.map((_, idx) => (
              <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === indice ? 'w-5 bg-[#ff3ec8]' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
        )}
        {atual && <div className="text-center text-[13px] tracking-[0.02em] text-white/70">{atual.legenda}</div>}
      </div>
    </div>,
    document.body,
  )
}

function Galeria({ projeto, onLightboxAbertoChange }: { projeto: Projeto; onLightboxAbertoChange: (v: boolean) => void }) {
  const habilitados = projeto.dispositivos ?? dispositivos.map((d) => d.id)
  const [disp, setDisp] = useState<Dispositivo>(
    habilitados.includes(projeto.galeria[0]?.dispositivo) ? projeto.galeria[0].dispositivo : habilitados[0],
  )
  const [i, setI] = useState(0)
  const [aberto, setAberto] = useState(false)

  const doDisp = projeto.galeria.filter((g) => g.dispositivo === disp)
  const lista: ProjetoImagem[] = doDisp.length ? doDisp : [{ dispositivo: disp, legenda: 'Em breve' }]
  const total = lista.length
  const atual = lista[i]
  const temImagem = Boolean(atual?.src)

  const ir = (delta: number) => total > 0 && setI((v) => (v + delta + total) % total)

  useEffect(() => {
    onLightboxAbertoChange(aberto)
  }, [aberto, onLightboxAbertoChange])

  useEffect(() => () => onLightboxAbertoChange(false), [onLightboxAbertoChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (aberto) return
      if (e.key === 'ArrowLeft') ir(-1)
      else if (e.key === 'ArrowRight') ir(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const seta = 'absolute top-1/2 z-[2] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[rgba(168,85,247,0.4)] bg-[rgba(7,4,15,0.75)] text-white backdrop-blur transition-colors hover:border-[#ff3ec8] hover:text-[#ff3ec8]'

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Dispositivo" className="flex flex-wrap gap-2">
          {dispositivos.map((d) => {
            const ativo = d.id === disp
            return (
              <button
                key={d.id}
                role="tab"
                aria-selected={ativo}
                disabled={!habilitados.includes(d.id)}
                onClick={() => { setDisp(d.id); setI(0) }}
                className={`cursor-pointer rounded-[10px] border px-6 py-[10px] font-display text-[11px] font-bold tracking-[0.18em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                  ativo
                    ? 'border-transparent text-white shadow-[0_0_22px_rgba(255,62,200,0.45)]'
                    : 'border-[rgba(168,85,247,0.35)] text-[#c9b8ff] hover:border-[#ff3ec8] disabled:hover:border-[rgba(168,85,247,0.35)]'
                }`}
                style={ativo ? { background: 'linear-gradient(90deg,#ff3ec8,#a855f7)' } : undefined}
              >
                {d.rotulo}
              </button>
            )
          })}
        </div>
        <div className="font-display text-[12px] font-semibold tracking-[0.18em] text-[#c9b8ff]">
          {total ? `${pad(i + 1)} / ${pad(total)}` : '00 / 00'}
        </div>
      </div>

      <div
        className="relative flex h-[72dvh] min-h-[340px] items-center justify-center rounded-2xl border border-[rgba(168,85,247,0.28)] p-3 sm:p-4 lg:h-auto lg:min-h-0 lg:flex-1"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(168,85,247,.18),rgba(11,6,22,.95) 70%)', containerType: 'size' }}
      >
        {atual && (
          <button
            type="button"
            aria-label={temImagem ? `Ampliar ${atual.legenda}` : atual.legenda}
            disabled={!temImagem}
            onClick={() => setAberto(true)}
            className="block cursor-zoom-in overflow-hidden rounded-lg border border-[rgba(168,85,247,0.3)] shadow-[0_18px_60px_rgba(0,0,0,0.6)] disabled:cursor-default"
            style={{
              aspectRatio: `${medidas[disp].w} / ${medidas[disp].h}`,
              width: `min(100cqw, calc(100cqh * ${medidas[disp].w / medidas[disp].h}))`,
            }}
          >
            <div className="relative h-full w-full">
              <Tela img={atual} projeto={projeto.nome} />
              {temImagem && (
                <span className="absolute right-2 bottom-2 grid h-8 w-8 place-items-center rounded-full bg-[rgba(7,4,15,0.75)] text-white backdrop-blur">
                  <Maximize2 size={14} />
                </span>
              )}
            </div>
          </button>
        )}
        {total > 1 && (
          <>
            <button aria-label="Imagem anterior" onClick={() => ir(-1)} className={`${seta} left-3 cursor-pointer`}>
              <ChevronLeft size={20} />
            </button>
            <button aria-label="Próxima imagem" onClick={() => ir(1)} className={`${seta} right-3 cursor-pointer`}>
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {atual && <div className="-mt-1 text-[13px] tracking-[0.06em] text-[#a99fc4]">{atual.legenda}</div>}

      <div className="flex gap-3 overflow-x-auto pb-1">
        {lista.map((img, idx) => (
          <button
            key={`${img.legenda}-${idx}`}
            aria-label={`Ver ${img.legenda}`}
            aria-current={idx === i}
            onClick={() => setI(idx)}
            className={`h-[72px] w-[112px] flex-none cursor-pointer overflow-hidden rounded-[10px] border-2 transition-colors ${
              idx === i ? 'border-[#ff3ec8] shadow-[0_0_14px_rgba(255,62,200,0.5)]' : 'border-[rgba(168,85,247,0.28)] hover:border-[#a855f7]'
            }`}
          >
            <Tela img={img} projeto={projeto.nome} className="[&_span]:text-[9px]" />
          </button>
        ))}
      </div>

      {aberto && atual && (
        <Lightbox key={i} imagens={lista} indice={i} projeto={projeto.nome} onIndiceChange={setI} onFechar={() => setAberto(false)} />
      )}
    </div>
  )
}

function Info({ icone, rotulo, children }: { icone: React.ReactNode; rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-[2px] grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(255,62,200,0.3)] bg-[rgba(255,62,200,0.1)] text-[#ff3ec8]">{icone}</span>
      <div className="min-w-0">
        <div className="font-display text-[13px] font-semibold text-white">{rotulo}</div>
        <div className="text-[14px] leading-[1.4] break-words text-[#a99fc4]">{children}</div>
      </div>
    </div>
  )
}

interface Props {
  projetos: Projeto[]
  indice: number
  onMudar: (i: number) => void
  onFechar: () => void
}

export default function ProjetoModal({ projetos, indice, onMudar, onFechar }: Props) {
  const projeto = projetos[indice]
  const total = projetos.length
  const fecharRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const lightboxAbertoRef = useRef(false)
  const aoMudarLightbox = useCallback((v: boolean) => { lightboxAbertoRef.current = v }, [])

  const anterior = () => onMudar((indice - 1 + total) % total)
  const proximo = () => onMudar((indice + 1) % total)

  useEffect(() => {
    const foco = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fecharRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      foco?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxAbertoRef.current) return
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onFechar])

  useEffect(() => {
    painelRef.current?.scrollTo({ top: 0 })
  }, [indice])

  const navBtn = 'inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[rgba(255,62,200,0.45)] px-4 py-[10px] font-display text-[11px] font-bold tracking-[0.16em] text-[#ff3ec8] uppercase transition-colors hover:bg-[rgba(255,62,200,0.14)] hover:text-white'

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-[rgba(4,2,10,0.88)] backdrop-blur-md sm:p-3"
      onMouseDown={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Projeto ${projeto.nome}`}
        className="mx-auto flex h-full max-w-[1600px] flex-col overflow-hidden border-[rgba(168,85,247,0.3)] sm:rounded-2xl sm:border"
        style={{ background: 'linear-gradient(180deg,#0f0824,#07040f)' }}
      >
        <div className="flex flex-none items-center justify-between gap-3 border-b border-[rgba(168,85,247,0.22)] px-4 py-3 sm:px-6">
          <button ref={fecharRef} aria-label="Fechar" onClick={onFechar} className="grid h-10 w-10 flex-none cursor-pointer place-items-center rounded-[10px] border border-[rgba(168,85,247,0.4)] text-white transition-colors hover:border-[#ff3ec8] hover:text-[#ff3ec8]">
            <X size={18} />
          </button>
          <div className="font-display text-[12px] font-semibold tracking-[0.18em] text-[#c9b8ff]">
            {pad(indice + 1)} / {pad(total)}
          </div>
          <div className="flex gap-2">
            <button onClick={anterior} className={navBtn} aria-label="Projeto anterior">
              <ArrowLeft size={14} /> <span className="max-sm:hidden">Projeto anterior</span>
            </button>
            <button onClick={proximo} className={navBtn} aria-label="Próximo projeto">
              <span className="max-sm:hidden">Próximo projeto</span> <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div ref={painelRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:grid lg:grid-cols-[minmax(300px,380px)_1fr] lg:overflow-hidden">
          <aside className="flex flex-col gap-5 border-[rgba(168,85,247,0.22)] p-5 sm:p-6 lg:overflow-y-auto lg:border-r">
            <span className="w-fit rounded-md border border-[rgba(255,62,200,0.4)] bg-[rgba(255,62,200,0.1)] px-3 py-1 font-display text-[10px] font-bold tracking-[0.18em] text-[#ff3ec8] uppercase">
              {projeto.categoria}
            </span>
            <div>
              <h3 className="m-0 font-display text-[clamp(26px,3vw,38px)] leading-[1] font-bold text-white uppercase">{projeto.nome}</h3>
              <div className="mt-2 text-[clamp(16px,1.5vw,20px)] text-[#c9b8ff]">{projeto.tagline}</div>
            </div>
            <p className="m-0 text-[15px] leading-[1.6] text-[#a99fc4]">{projeto.descricao}</p>

            <div className="flex flex-col gap-4">
              <Info icone={<Briefcase size={16} />} rotulo="Meu papel">{projeto.papel}</Info>
              <Info icone={<CalendarDays size={16} />} rotulo="Período">{projeto.periodo}</Info>
              <Info icone={<UserRound size={16} />} rotulo="Cliente">
                {projeto.clienteLink ? (
                  <a href={projeto.clienteLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#c9b8ff] hover:text-white">
                    {projeto.cliente} <ExternalLink size={13} />
                  </a>
                ) : (
                  projeto.cliente
                )}
              </Info>
              {projeto.link && (
                <Info icone={<Link2 size={16} />} rotulo="Link">
                  <a href={projeto.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#c9b8ff] hover:text-white">
                    {projeto.link.replace(/^https?:\/\//, '')} <ExternalLink size={13} />
                  </a>
                </Info>
              )}
            </div>

            <div>
              <div className="mb-3 font-display text-[13px] font-semibold text-white">Tecnologias</div>
              <div className="flex flex-wrap gap-2">
                {projeto.tecnologias.map((t) => (
                  <span key={t} className="rounded-full border border-[rgba(168,85,247,0.35)] px-3 py-1 text-[12px] text-[#c9b8ff]">{t}</span>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex min-h-0 flex-col p-5 sm:p-6">
            <Galeria key={projeto.nome} projeto={projeto} onLightboxAbertoChange={aoMudarLightbox} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
