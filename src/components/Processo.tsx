import { processo } from '../data/content'

export default function Processo() {
  return (
    <section id="processo" className="px-[clamp(16px,4vw,40px)] pt-0 pb-[clamp(48px,6vw,80px)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-[10px] font-display text-[12px] font-bold tracking-[0.3em] text-[#ff3ec8] uppercase">
          <span>◈</span> Meu processo
        </div>
        <div
          className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-6 rounded-2xl border border-[rgba(168,85,247,0.26)] p-[26px]"
          style={{ background: 'linear-gradient(180deg,rgba(22,12,42,.9),rgba(11,6,22,.9))' }}
        >
          {processo.map((e) => (
            <div key={e.numero} className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-3">
                <div
                  className="font-display text-[34px] leading-none font-bold text-transparent"
                  style={{ WebkitTextStroke: '1.5px #ff3ec8' }}
                >
                  {e.numero}
                </div>
                <div className="font-display text-[14px] font-bold tracking-[0.16em] text-white uppercase">{e.titulo}</div>
              </div>
              <p className="m-0 text-[14px] leading-[1.55] text-[#a99fc4]">{e.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
