import type { IconType } from 'react-icons'
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiGsap,
  SiGit,
  SiFigma,
} from 'react-icons/si'
import { tecnologias } from '../data/content'

const icones: Record<string, { icon: IconType; cor: string }> = {
  HTML5: { icon: SiHtml5, cor: '#e34f26' },
  CSS3: { icon: SiCss, cor: '#1572b6' },
  JavaScript: { icon: SiJavascript, cor: '#f7df1e' },
  TypeScript: { icon: SiTypescript, cor: '#3178c6' },
  React: { icon: SiReact, cor: '#61dafb' },
  'Next.js': { icon: SiNextdotjs, cor: '#ffffff' },
  'Node.js': { icon: SiNodedotjs, cor: '#5fa04e' },
  PostgreSQL: { icon: SiPostgresql, cor: '#4169e1' },
  Supabase: { icon: SiSupabase, cor: '#3ecf8e' },
  Tailwind: { icon: SiTailwindcss, cor: '#38bdf8' },
  'Three.js': { icon: SiThreedotjs, cor: '#ffffff' },
  GSAP: { icon: SiGsap, cor: '#88ce02' },
  Git: { icon: SiGit, cor: '#f05032' },
  Figma: { icon: SiFigma, cor: '#f24e1e' },
}

export default function Tecnologias() {
  return (
    <section id="tecnologias" className="px-[clamp(16px,4vw,40px)] pt-0 pb-[clamp(48px,6vw,80px)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-[10px] font-display text-[12px] font-bold tracking-[0.3em] text-[#ff3ec8] uppercase">
          <span>◈</span> Tecnologias que uso
        </div>
        <div
          className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-4 rounded-2xl border border-[rgba(168,85,247,0.26)] p-[22px]"
          style={{ background: 'linear-gradient(180deg,rgba(22,12,42,.9),rgba(11,6,22,.9))' }}
        >
          {tecnologias.map((t) => {
            const info = icones[t.nome]
            const Icon = info?.icon
            return (
              <div key={t.nome} className="flex flex-col items-center gap-[10px]">
                <div className="grid h-[52px] w-[52px] place-items-center font-display text-[15px] font-bold text-[#c9b8ff]">
                  {Icon ? <Icon size={36} color={info.cor} aria-hidden="true" focusable="false" /> : t.sigla}
                </div>
                <div className="text-center text-[12px] font-semibold tracking-[0.08em] text-[#9a8fb8] uppercase">
                  {t.nome}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
