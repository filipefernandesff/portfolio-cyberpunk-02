import heroCidadeNeon from '../assets/images/hero-cidade-neon.webp'
import heroCidadeNeon916 from '../assets/images/hero-916.webp'
import heroRetrato from '../assets/images/hero-retrato.svg'
import CtaButton from './CtaButton'
import { metricas, site, statusTexto } from '../data/content'

const portraitMask =
  'radial-gradient(74% 86% at 52% 34%,#000 0 52%,rgba(0,0,0,.94) 66%,rgba(0,0,0,.66) 78%,rgba(0,0,0,.26) 90%,transparent 100%),' +
  'linear-gradient(to bottom,#000 0 44%,rgba(0,0,0,.86) 62%,rgba(0,0,0,.5) 76%,rgba(0,0,0,.16) 89%,transparent 98%),' +
  'linear-gradient(to right,transparent 0,rgba(0,0,0,.28) 4%,rgba(0,0,0,.7) 9%,rgba(0,0,0,.93) 15%,#000 22% 78%,rgba(0,0,0,.93) 85%,rgba(0,0,0,.7) 91%,rgba(0,0,0,.28) 96%,transparent 100%)'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden px-[clamp(16px,4vw,40px)] pt-[clamp(32px,5vw,64px)] pb-0"
      style={{
        background:
          'radial-gradient(120% 90% at 78% 8%,rgba(124,42,232,.5) 0%,rgba(255,62,200,.22) 32%,rgba(7,4,15,0) 62%),#07040f',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 left-0 h-[clamp(560px,74vw,880px)] overflow-hidden"
      >
        <picture>
          <source media="(max-width: 640px)" srcSet={heroCidadeNeon916} />
          <img
            src={heroCidadeNeon}
            alt=""
            fetchPriority="high"
            decoding="async"
            width={1967}
            height={800}
            className="absolute inset-0 h-full w-full object-cover object-[62%_42%] max-sm:object-[50%_25%]"
            style={{ filter: 'saturate(1.08) contrast(1.03) brightness(.95)' }}
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right,rgba(7,4,15,.9) 0 8%,rgba(7,4,15,.7) 26%,rgba(7,4,15,.34) 50%,rgba(7,4,15,.06) 78%,rgba(7,4,15,0) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(58% 46% at 72% 18%,rgba(255,62,200,.16),transparent 72%),radial-gradient(44% 38% at 90% 58%,rgba(34,211,238,.1),transparent 74%)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute inset-0 opacity-45"
          style={{
            mixBlendMode: 'screen',
            backgroundImage:
              'radial-gradient(1.5px 1.5px at 18% 22%,rgba(255,255,255,.65),transparent 100%),' +
              'radial-gradient(1.2px 1.2px at 74% 12%,rgba(255,62,200,.75),transparent 100%),' +
              'radial-gradient(1.6px 1.6px at 44% 46%,rgba(34,211,238,.6),transparent 100%),' +
              'radial-gradient(1.2px 1.2px at 88% 34%,rgba(255,255,255,.5),transparent 100%),' +
              'radial-gradient(1.4px 1.4px at 62% 66%,rgba(201,184,255,.55),transparent 100%)',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[28%]"
          style={{ background: 'linear-gradient(to top,#07040f 0,rgba(7,4,15,.6) 48%,transparent 100%)' }}
        />
      </div>

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(24px,4vw,48px)]">
        <div className="relative z-[1] min-w-0">
          <div className="font-display text-[13px] font-bold tracking-[0.34em] text-[#ff3ec8] uppercase">
            Desenvolvedor criativo
          </div>
          <h1 className="m-0 mt-[14px] font-display text-[clamp(52px,9vw,116px)] leading-[0.88] font-bold tracking-[-0.02em] uppercase">
            <span
              className="block bg-clip-text text-transparent"
              style={{ background: 'linear-gradient(180deg,#ffffff,#c9b8ff)', backgroundClip: 'text' }}
            >
              {site.nome}
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(100deg,#ff3ec8,#a855f7)',
                backgroundClip: 'text',
                width: 653,
                height: 111,
              }}
            >
              {site.sobrenome}
            </span>
          </h1>
          <p className="mt-[22px] max-w-[34ch] text-[clamp(16px,1.5vw,20px)] leading-[1.5] font-medium tracking-[0.06em] text-[#c8bfe0] uppercase">
            Eu crio sistemas e experiências digitais sob medida, onde código, design e tecnologia se encontram.
          </p>
          <div className="mt-[30px] flex flex-wrap gap-4">
            <CtaButton
              href="#projetos"
              style={{
                background: 'linear-gradient(100deg,#7c2ae8,#ff3ec8)',
                boxShadow: '0 0 30px rgba(124,42,232,.5)',
              }}
            >
              Ver projetos
            </CtaButton>
            <a
              href="#sobre"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(201,184,255,0.35)] px-[26px] py-[15px] font-display text-[13px] font-bold tracking-[0.18em] text-white uppercase transition-colors duration-200 hover:border-[#ff3ec8]"
            >
              Sobre mim <span>→</span>
            </a>
          </div>
        </div>

        <div className="relative min-w-0">
          <div
            className="absolute top-[14px] right-[14px] z-[2] flex w-max items-center gap-[10px] whitespace-nowrap rounded-full border border-[rgba(255,62,200,0.4)] px-4 py-[10px] max-sm:top-[10px] max-sm:right-0 max-sm:left-0 max-sm:mx-auto min-[641px]:max-[899px]:top-auto min-[641px]:max-[899px]:bottom-[90px]"
            style={{ background: 'rgba(15,8,30,.82)' }}
          >
            <span
              className="status-dot h-[9px] w-[9px] rounded-full bg-[#3ce88a]"
              style={{ boxShadow: '0 0 10px #3ce88a' }}
            />
            <span className="font-display text-[11px] font-bold tracking-[0.16em] text-[#e8e2f5] uppercase">
              {statusTexto}
            </span>
          </div>

          <div
            className="relative flex h-[clamp(420px,min(58vw,82vh),720px)] items-end justify-center"
            style={{ marginBottom: 'clamp(-80px,-7vw,-28px)' }}
          >
            <div
              className="absolute bottom-[14%] left-[52%] aspect-[1/1.1] w-[96%] -translate-x-1/2 rounded-full blur-[40px]"
              style={{
                background: 'radial-gradient(closest-side,rgba(255,62,200,.34),rgba(124,42,232,.2) 58%,transparent 100%)',
              }}
            />
            <div
              className="absolute top-[12%] left-1/2 aspect-square w-[56%] -translate-x-1/2 rounded-full blur-[30px]"
              style={{
                background: 'radial-gradient(closest-side,rgba(7,4,15,.5),rgba(7,4,15,.18) 62%,transparent 100%)',
              }}
            />
            <picture className="contents">
              <img
                src={heroRetrato}
                alt={site.marca}
                decoding="async"
                width={416}
                height={599}
                className="relative z-[1] h-[104%] w-auto max-w-[112%] object-contain min-[641px]:h-auto lg:translate-x-[4vw]"
                style={{
                  objectPosition: 'bottom center',
                  filter:
                    'drop-shadow(-24px 0 64px rgba(124,42,232,.5)) drop-shadow(26px 10px 64px rgba(255,62,200,.36)) drop-shadow(0 0 22px rgba(34,211,238,.22)) saturate(1.2) contrast(1.14) brightness(1.19)',
                  WebkitMaskImage: portraitMask,
                  maskImage: portraitMask,
                  WebkitMaskComposite: 'source-in',
                  maskComposite: 'intersect',
                }}
              />
            </picture>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[3]"
              style={{
                background:
                  'radial-gradient(66% 52% at 76% 22%,rgba(255,62,200,.2),transparent 70%),radial-gradient(58% 48% at 20% 62%,rgba(124,42,232,.16),transparent 74%)',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-[4] mx-auto max-w-[1280px] pb-[clamp(40px,6vw,72px)]" style={{ marginTop: 'clamp(4px,1vw,16px)' }}>
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4 rounded-[18px] border border-[rgba(168,85,247,0.28)] backdrop-blur-[14px]"
          style={{ background: 'rgba(168,85,247,.22)', boxShadow: '0 24px 60px rgba(7,4,15,.6)' }}
        >
          {metricas.map((m) => (
            <div
              key={m.rotulo}
              className="flex items-center gap-[14px] px-6 py-[22px]"
              style={{ background: 'linear-gradient(180deg,rgba(23,12,45,.78),rgba(13,7,26,.86))' }}
            >
              <div
                className="grid h-10 w-10 flex-none place-items-center rounded-[11px] border border-[rgba(255,62,200,0.3)] text-[18px] text-[#ff3ec8]"
                style={{ background: 'rgba(255,62,200,.14)' }}
              >
                {m.icone}
              </div>
              <div className="min-w-0">
                <div className="font-display text-[26px] leading-none font-bold text-white">{m.valor}</div>
                <div className="text-[12px] font-semibold tracking-[0.14em] text-[#a894cf] uppercase">{m.rotulo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
