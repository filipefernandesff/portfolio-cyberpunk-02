import { depoimentos } from '../data/content'

export default function Depoimentos() {
  return (
    <section id="depoimentos" className="px-[clamp(16px,4vw,40px)] pt-0 pb-[clamp(48px,6vw,80px)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-[10px] font-display text-[12px] font-bold tracking-[0.3em] text-[#ff3ec8] uppercase">
          <span>◈</span> Palavras gentis
        </div>
        <div className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px]">
          {depoimentos.map((d) => (
            <div
              key={d.nome}
              className="flex flex-col gap-[18px] rounded-2xl border border-[rgba(168,85,247,0.26)] p-[26px]"
              style={{ background: 'linear-gradient(180deg,rgba(24,13,46,.9),rgba(11,6,22,.92))' }}
            >
              <p className="m-0 text-[16px] leading-[1.6] text-[#d3cae8]">“{d.texto}”</p>
              <div className="mt-auto flex items-center gap-3">
                {d.foto ? (
                  <img
                    src={d.foto}
                    alt={d.nome}
                    width={42}
                    height={42}
                    loading="lazy"
                    className="h-[42px] w-[42px] flex-none rounded-full border border-[rgba(168,85,247,0.4)] object-cover"
                  />
                ) : (
                  <div
                    className="h-[42px] w-[42px] flex-none rounded-full border border-[rgba(168,85,247,0.4)]"
                    style={{
                      backgroundColor: '#1a0f33',
                      backgroundImage: 'repeating-linear-gradient(135deg,rgba(255,62,200,.16) 0 2px,rgba(255,62,200,0) 2px 8px)',
                    }}
                  />
                )}
                <div>
                  <div className="font-display text-[14px] font-bold text-white">{d.nome}</div>
                  <div className="text-[12px] font-semibold tracking-[0.1em] text-[#8d81ab] uppercase">{d.cargo}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
