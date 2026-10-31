import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import CtaButton from './CtaButton'
import { site, whatsappConversar } from '../data/content'

const navLinks = [
  { href: '#inicio', id: 'inicio', label: 'Início' },
  { href: '#sobre', id: 'sobre', label: 'Sobre' },
  { href: '#servicos', id: 'servicos', label: 'Serviços' },
  { href: '#projetos', id: 'projetos', label: 'Projetos' },
  { href: '#tecnologias', id: 'tecnologias', label: 'Tecnologias' },
  { href: '#processo', id: 'processo', label: 'Processo' },
  { href: '#contato', id: 'contato', label: 'Contato' },
]

// Na área /materiais as seções da home não existem: os links viram âncoras para "/".
const emMateriais = /^\/materiais(\/|$)/.test(window.location.pathname)
const base = emMateriais ? '/' : ''

// Extra breathing room below the sticky header so a section's title never
// sits flush against it — both on click-jump (scroll-margin-top) and when
// deciding which link is "active" while scrolling.
const OFFSET_GAP = 24

export default function Header() {
  const [activeId, setActiveId] = useState(emMateriais ? '' : 'inicio')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  // Set when a nav link is clicked: short trailing sections (Depoimentos)
  // can't scroll to the top of the viewport, so scroll-spy would pick a
  // neighbour. Keep the clicked link active until the user scrolls manually.
  const lockedIdRef = useRef<string | null>(null)
  const userInputRef = useRef(false)

  const handleNavClick = (id: string) => {
    lockedIdRef.current = id
    userInputRef.current = false
    setActiveId(id)
  }

  // Drawer is mobile/tablet-only UI — if the viewport crosses into desktop
  // (xl) while it's open, force it closed so it can't get stuck open behind
  // the now-visible desktop nav.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1280px)')
    const onChange = () => setIsMenuOpen(false)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  useEffect(() => {
    const headerEl = headerRef.current
    if (!headerEl) return

    const applyHeaderHeight = () => {
      const h = headerEl.offsetHeight
      document.documentElement.style.setProperty('--header-h', `${h + OFFSET_GAP}px`)
    }
    applyHeaderHeight()

    const resizeObserver = new ResizeObserver(applyHeaderHeight)
    resizeObserver.observe(headerEl)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    // Sort by actual DOM position — the nav's label order (Processo before
    // Tecnologias) doesn't match the page's section order (Tecnologias
    // before Processo), and the scan below relies on top-to-bottom order.
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    if (!sections.length) return

    let ticking = false
    const computeActive = () => {
      ticking = false
      if (lockedIdRef.current) return
      const headerEl = headerRef.current
      const offset = (headerEl?.offsetHeight ?? 0) + OFFSET_GAP + 1

      let current = sections[0].id
      for (const section of sections) {
        if (section.getBoundingClientRect().top - offset <= 0) {
          current = section.id
        } else {
          break
        }
      }
      // Near the very bottom of the page, trailing sections (Depoimentos,
      // Contato) combined with the footer can be too short to ever push
      // their top past `offset` before scroll bottoms out, so the loop above
      // gets stuck on an earlier section. Once at max scroll, fall back to
      // whichever section actually covers the most of the viewport instead
      // of blindly forcing the very last one (which may only show a sliver).
      const doc = document.documentElement
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        let bestId = current
        let bestVisible = -1
        for (const section of sections) {
          const rect = section.getBoundingClientRect()
          const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
          if (visible > bestVisible) {
            bestVisible = visible
            bestId = section.id
          }
        }
        current = bestId
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(computeActive)
      }
    }

    // Only release the lock when the user's own input actually moves the
    // page — a wheel tick at the bottom of the page scrolls nothing and must
    // not re-run the (ambiguous) bottom-of-page fallback.
    const markUserInput = () => {
      userInputRef.current = true
    }
    const userEvents = ['wheel', 'touchmove', 'keydown', 'pointerdown'] as const
    const handleScroll = () => {
      if (lockedIdRef.current && userInputRef.current) lockedIdRef.current = null
      onScroll()
    }

    computeActive()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    userEvents.forEach((ev) => window.addEventListener(ev, markUserInput, { passive: true }))
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', onScroll)
      userEvents.forEach((ev) => window.removeEventListener(ev, markUserInput))
    }
  }, [])

  return (
    <div
      ref={headerRef}
      className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-[rgba(168,85,247,0.22)] px-[clamp(16px,4vw,40px)] py-[14px] backdrop-blur-[12px] xl:flex-nowrap"
      style={{ background: 'rgba(9,5,20,.88)' }}
    >
      {/* min-w mantém a largura do logo de antes ("Seu Nome") para o cabeçalho quebrar em duas linhas no mobile como antes. */}
      <div className="order-1 flex min-w-[236px] items-center gap-2 font-display text-[20px] font-bold whitespace-nowrap tracking-[0.16em] sm:min-w-[259px] sm:text-[22px] xl:min-w-0">
        <span>{site.nome}</span>
        <span className="text-[#ff3ec8]">✦</span>
      </div>

      <nav className="order-3 hidden w-full flex-wrap justify-center gap-x-[clamp(12px,2vw,26px)] gap-y-3 text-[13px] font-semibold tracking-[0.14em] uppercase xl:order-2 xl:flex xl:w-auto xl:justify-start">
        {navLinks.map((link) => {
          const isActive = link.id === activeId
          return (
            <a
              key={link.href}
              href={base + link.href}
              onClick={() => handleNavClick(link.id)}
              className={`relative pb-2 transition-colors duration-200 ${
                isActive ? 'text-[#ff3ec8]' : 'text-white hover:text-[#ff3ec8]'
              }`}
            >
              {link.label}
              {isActive && (
                <span
                  className="absolute -bottom-0.5 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#ff3ec8]"
                  style={{ boxShadow: '0 0 8px #ff3ec8' }}
                />
              )}
            </a>
          )
        })}
      </nav>

      <CtaButton
        href={whatsappConversar}
        target="_blank"
        rel="noopener noreferrer"
        size="sm"
        className="order-2 flex-none sm:max-xl:ml-auto xl:order-3"
        style={{
          background: 'linear-gradient(100deg,#7c2ae8,#ff3ec8)',
          boxShadow: '0 0 24px rgba(255,62,200,.45)',
        }}
      >
        Vamos conversar
      </CtaButton>

      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-drawer"
        className="order-4 flex flex-none items-center justify-center rounded-full border border-[rgba(168,85,247,0.35)] p-2.5 text-white transition-colors duration-200 hover:border-[#ff3ec8] hover:text-[#ff3ec8] xl:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {createPortal(
        <>
          <div
            className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
              isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className={`fixed inset-y-0 right-0 z-[70] flex w-[78vw] max-w-[320px] flex-col gap-8 border-l border-[rgba(168,85,247,0.22)] px-7 py-6 shadow-[-8px_0_32px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out xl:hidden ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ background: 'rgba(9,5,20,.97)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-[18px] font-bold tracking-[0.16em] text-white">
                <span>{site.nome}</span>
                <span className="text-[#ff3ec8]">✦</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fechar menu"
                className="flex items-center justify-center rounded-full border border-[rgba(168,85,247,0.35)] p-2.5 text-white transition-colors duration-200 hover:border-[#ff3ec8] hover:text-[#ff3ec8]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <nav className="flex flex-col gap-6 text-[15px] font-semibold tracking-[0.14em] uppercase">
                {navLinks.map((link) => {
                  const isActive = link.id === activeId
                  return (
                    <a
                      key={link.href}
                      href={base + link.href}
                      onClick={() => {
                        handleNavClick(link.id)
                        setIsMenuOpen(false)
                      }}
                      className={`relative w-fit transition-colors duration-200 ${
                        isActive ? 'text-[#ff3ec8]' : 'text-white hover:text-[#ff3ec8]'
                      }`}
                    >
                      {link.label}
                    </a>
                  )
                })}
              </nav>

              <CtaButton
                href={whatsappConversar}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="justify-center"
                style={{
                  background: 'linear-gradient(100deg,#7c2ae8,#ff3ec8)',
                  boxShadow: '0 0 24px rgba(255,62,200,.45)',
                }}
              >
                Vamos conversar
              </CtaButton>
            </div>
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}
