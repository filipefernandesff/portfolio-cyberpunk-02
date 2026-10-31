import { lazy, Suspense, useState } from 'react'
import { projetos, type Projeto } from '../data/content'

const ProjetoModal = lazy(() => import('./ProjetoModal'))

const capa = (p: Projeto) => p.capa ?? p.galeria.find((i) => i.src)?.src

export default function Projetos() {
  const [aberto, setAberto] = useState<number | null>(null)

  return (
    <section id="projetos" className="px-[clamp(16px,4vw,40px)] pt-0 pb-[clamp(48px,6vw,80px)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-[10px] font-display text-[12px] font-bold tracking-[0.3em] text-[#ff3ec8] uppercase">
            <span>◈</span> Projetos em destaque
          </div>
        </div>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-[18px]">
          {projetos.map((p, idx) => (
            <button
              type="button"
              key={p.nome}
              onClick={() => setAberto(idx)}
              aria-label={`Abrir projeto ${p.nome}`}
              className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[rgba(168,85,247,0.28)] p-0 text-left transition-[border-color] duration-200 hover:border-[#ff3ec8]"
              style={{ background: 'linear-gradient(180deg,rgba(24,13,46,.9),rgba(11,6,22,.95))' }}
            >
              <div
                className="relative flex aspect-[16/12] flex-col justify-end overflow-hidden p-5"
                style={{ backgroundColor: '#120a26' }}
              >
                {capa(p) ? (
                  <img
                    src={capa(p)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(135deg,rgba(255,62,200,.13) 0 2px,rgba(255,62,200,0) 2px 12px)',
                    }}
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg,rgba(11,6,22,0) 40%,rgba(11,6,22,.9))' }}
                />
                {p.status && (
                  <div
                    className={`absolute z-[1] flex w-max items-center gap-[10px] whitespace-nowrap rounded-full border border-[rgba(255,62,200,0.4)] px-4 py-[10px] ${
                      capa(p) ? 'top-[14px] right-[14px]' : 'top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2'
                    }`}
                    style={{ background: 'rgba(15,8,30,.82)', boxShadow: '0 0 28px rgba(255,62,200,.22)' }}
                  >
                    <span
                      className="h-[9px] w-[9px] animate-pulse rounded-full bg-[#ffb02e]"
                      style={{ boxShadow: '0 0 10px #ffb02e' }}
                    />
                    <span className="font-display text-[11px] font-bold tracking-[0.16em] text-[#e8e2f5] uppercase">
                      {p.status}
                    </span>
                  </div>
                )}
                <div
                  className="font-display text-[clamp(22px,2.4vw,30px)] leading-[0.98] font-bold text-white uppercase"
                  style={{ textShadow: '0 2px 18px rgba(0,0,0,.8)' }}
                >
                  {p.nome}
                </div>
                <div className="font-display text-[13px] font-semibold tracking-[0.2em] text-[#ff3ec8] uppercase">
                  {p.tagline}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 px-5 py-[18px]">
                <p className="m-0 text-[14px] leading-[1.55] text-[#a99fc4]">{p.descricao}</p>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[rgba(168,85,247,0.2)] pt-3">
                  <div className="text-[11px] font-semibold tracking-[0.16em] text-[#7f719f] uppercase">{p.categoria}</div>
                  <span
                    className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] border border-[rgba(255,62,200,0.35)] text-[#ff3ec8]"
                    style={{ background: 'rgba(255,62,200,.14)' }}
                  >
                    ↗
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {aberto !== null && (
        <Suspense fallback={null}>
          <ProjetoModal projetos={projetos} indice={aberto} onMudar={setAberto} onFechar={() => setAberto(null)} />
        </Suspense>
      )}
    </section>
  )
}
