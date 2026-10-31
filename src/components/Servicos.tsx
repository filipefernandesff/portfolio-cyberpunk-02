import { servicos } from '../data/content'

export default function Servicos() {
  return (
    <section id="servicos" className="px-[clamp(16px,4vw,40px)] pt-0 pb-[clamp(48px,6vw,80px)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-[10px] font-display text-[12px] font-bold tracking-[0.3em] text-[#ff3ec8] uppercase">
          <span>◈</span> Serviços
        </div>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[18px]">
          {servicos.map((s) => (
            <div
              key={s.titulo}
              className="flex flex-col gap-[14px] rounded-2xl border border-[rgba(168,85,247,0.28)] p-[26px] transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-[#ff3ec8]"
              style={{ background: 'linear-gradient(180deg,rgba(26,14,50,.9),rgba(12,7,25,.9))' }}
            >
              <div
                className="grid h-11 w-11 place-items-center rounded-xl border border-[rgba(168,85,247,0.4)] text-[20px]"
                style={{ background: 'rgba(124,42,232,.2)' }}
              >
                {s.icone}
              </div>
              <div className="font-display text-[16px] font-bold tracking-[0.08em] text-white uppercase">{s.titulo}</div>
              <p className="m-0 text-[15px] leading-[1.55] text-[#a99fc4]">{s.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
