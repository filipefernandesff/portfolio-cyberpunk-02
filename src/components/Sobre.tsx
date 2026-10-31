import sobreApoio from '../assets/images/hero-916.webp'

export default function Sobre() {
  return (
    <section
      id="sobre"
      className="border-t border-[rgba(168,85,247,0.18)] px-[clamp(16px,4vw,40px)] py-[clamp(48px,6vw,88px)]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-[10px] font-display text-[12px] font-bold tracking-[0.3em] text-[#ff3ec8] uppercase">
          <span>◈</span> Sobre mim
        </div>
        <div className="mt-[26px] grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-[clamp(24px,3vw,44px)]">
          <div className="min-w-0">
            <h2 className="m-0 font-display text-[clamp(30px,4vw,50px)] leading-[1.02] font-bold text-white uppercase">
              Transformo ideias em <span className="text-[#ff3ec8]">produtos digitais</span> que funcionam.
            </h2>
            <a
              href="#contato"
              className="mt-7 inline-flex items-center gap-3 rounded-full border border-[rgba(255,62,200,0.5)] px-7 py-[14px] font-display text-[12px] font-bold tracking-[0.18em] text-white uppercase transition-colors duration-200 hover:border-[#ff3ec8]"
              style={{ background: 'rgba(255,62,200,.08)' }}
            >
              Saber mais <span>→</span>
            </a>
          </div>
          <div className="flex min-w-0 flex-col gap-4 text-[17px] leading-[1.65] text-[#bcb1d8]" style={{ textWrap: 'pretty' }}>
            <p className="m-0">
              Sou desenvolvedor e designer de produto. Transformo ideias em produtos digitais, de SaaS e sites a
              automações inteligentes e sistemas completos.
            </p>
            <p className="m-0">
              Uno desenvolvimento, IA e integrações para criar soluções que funcionam de verdade, com tecnologia por
              trás e uma experiência simples para quem usa.
            </p>
          </div>
          <div
            className="min-w-0 aspect-[5/4] overflow-hidden rounded-[18px] md:hidden lg:block"
            style={{ border: '1px solid rgba(40, 110, 180, 0.35)' }}
          >
            <img
              src={sobreApoio}
              alt="Ilustração cyberpunk de uma cidade futurista à noite, com uma lua rosa gigante e carros voadores"
              className="h-full w-full object-cover"
              loading="lazy"
              width={760}
              height={1350}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
