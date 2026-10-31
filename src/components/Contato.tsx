import CtaButton from './CtaButton'
import { disponibilidade, site, whatsappProjeto } from '../data/content'

export default function Contato() {
  return (
    <section id="contato" className="px-[clamp(16px,4vw,40px)] pt-0 pb-[clamp(28px,4vw,48px)]">
      <div
        className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-center gap-[clamp(20px,3vw,40px)] rounded-[20px] border border-[rgba(255,62,200,0.35)] p-[clamp(26px,3vw,40px)]"
        style={{ background: 'radial-gradient(90% 160% at 88% 50%,rgba(124,42,232,.45),rgba(13,7,26,.95))' }}
      >
        <h2 className="m-0 font-display text-[clamp(25px,3.3vw,42px)] leading-[0.95] font-bold text-white uppercase">
          Vamos <br className="hidden lg:inline" />construir <br className="hidden lg:inline" />algo <br className="hidden lg:inline" />
          <span className="text-[#ff3ec8]">extraordinário?</span>
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[18px]">
          <div>
            <div className="font-display text-[11px] font-bold tracking-[0.2em] text-[#ff3ec8] uppercase">E-mail</div>
            <div className="mt-[6px] text-[15px] text-[#ded6f0]">{site.email}</div>
          </div>
          <div>
            <div className="font-display text-[11px] font-bold tracking-[0.2em] text-[#ff3ec8] uppercase">Localização</div>
            <div className="mt-[6px] text-[15px] text-[#ded6f0]">{site.local}</div>
          </div>
          <div>
            <div className="font-display text-[11px] font-bold tracking-[0.2em] text-[#ff3ec8] uppercase">Disponibilidade</div>
            <div className="mt-[6px] text-[15px] text-[#ded6f0]">{disponibilidade}</div>
          </div>
        </div>
        <CtaButton
          href={whatsappProjeto}
          target="_blank"
          rel="noopener noreferrer"
          className="justify-self-start"
          style={{
            background: 'linear-gradient(100deg,#7c2ae8,#ff3ec8)',
            boxShadow: '0 0 34px rgba(255,62,200,.5)',
          }}
        >
          Iniciar um projeto
        </CtaButton>
      </div>
    </section>
  )
}
