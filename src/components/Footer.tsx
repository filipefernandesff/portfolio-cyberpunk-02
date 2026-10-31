import { lazy, Suspense } from 'react'
import { FaGithub, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { rodape, site } from '../data/content'
import type { Social } from './AnimatedSocialLinks'

const AnimatedSocialLinks = lazy(() => import('./AnimatedSocialLinks'))

const socials: Social[] = [
  { name: 'Instagram', href: 'https://www.instagram.com/seu-usuario', icon: <FaInstagram />, color: '#ff3ec8' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/seu-usuario', icon: <FaLinkedinIn />, color: '#38bdf8' },
  { name: 'GitHub', href: 'https://github.com/seu-usuario', icon: <FaGithub />, color: '#e8e2f5' },
  { name: 'YouTube', href: 'https://www.youtube.com/@seu-usuario', icon: <FaYoutube />, color: '#ff3b3b' },
]

const rotulo = 'font-display text-[11px] font-bold tracking-[0.2em] text-[#ff3ec8] uppercase'
const bloco = 'flex flex-col items-start gap-3 border-t border-[rgba(168,85,247,0.2)] pt-5 md:border-t-0 md:pt-0'
const linkNavegacao =
  'font-display text-[12px] font-semibold tracking-[0.12em] text-[#8d81ab] uppercase transition-colors duration-200 hover:text-[#ff3ec8]'

const navegacao = [
  { rotulo: 'Materiais', href: '/materiais' },
  { rotulo: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { rotulo: 'Termos de Uso', href: '/termos-de-uso' },
]

export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1280px] flex-col gap-5 border-t border-[rgba(168,85,247,0.2)] px-[clamp(16px,4vw,40px)] pt-8 pb-10 md:flex-row md:flex-wrap md:items-stretch md:justify-between md:gap-x-6 md:gap-y-6 lg:flex-nowrap lg:gap-x-8">
      <div className="flex flex-col items-start justify-center gap-2 md:basis-full lg:basis-auto">
        <div className="flex items-center gap-[10px] font-display text-[13px] font-bold tracking-[0.16em] text-[#e8e2f5]">
          {site.nome} <span className="text-[#ff3ec8]">✦</span>
        </div>
        <div className="text-[13px] text-[#8d81ab]">{rodape}</div>
      </div>

      <nav aria-label="Navegação" className={`${bloco} lg:border-l lg:pl-8`}>
        <div className={rotulo}>Navegação</div>
        <ul className="m-0 flex list-none flex-col items-start gap-[6px] p-0">
          {navegacao.map((item) => (
            <li key={item.rotulo}>
              <a href={item.href} className={linkNavegacao}>
                {item.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`${bloco} justify-center md:border-l md:pl-8`}>
        {/* Com mouse, o ícone ampliado do hover sobe ~50px: no layout empilhado reserva um respiro para não cobrir o logo acima. */}
        <div className="-ml-4 [@media(hover:hover)]:max-md:mt-4">
          <Suspense fallback={null}>
            <AnimatedSocialLinks socials={socials} />
          </Suspense>
        </div>
      </div>
    </footer>
  )
}