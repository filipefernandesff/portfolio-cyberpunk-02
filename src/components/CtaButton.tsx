import { ArrowRight } from 'lucide-react'
import type { AnchorHTMLAttributes, CSSProperties } from 'react'

type Size = 'sm' | 'md'

const SIZES: Record<Size, { height: string; pl: string; gap: string; iconCircle: string; iconRight: string; text: string; tracking: string }> = {
  sm: { height: '2.75rem', pl: '1.35rem', gap: '0.85rem', iconCircle: '1.9rem', iconRight: '0.3rem', text: '12px', tracking: '0.16em' },
  md: { height: '3.25rem', pl: '1.75rem', gap: '1rem', iconCircle: '2.2rem', iconRight: '0.35rem', text: '13px', tracking: '0.18em' },
}

interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: Size
  fillBgColor?: string
  fillTextColor?: string
}

export default function CtaButton({
  size = 'md',
  fillBgColor = '#ffffff',
  fillTextColor = '#7c2ae8',
  className = '',
  style,
  children,
  ...props
}: CtaButtonProps) {
  const s = SIZES[size]
  const pr = `calc(${s.iconCircle} + ${s.iconRight} + ${s.gap})`

  return (
    <a
      {...props}
      className={`group relative inline-flex items-center overflow-hidden rounded-full font-display font-bold text-white uppercase ${className}`}
      style={{
        height: s.height,
        paddingLeft: s.pl,
        paddingRight: pr,
        fontSize: s.text,
        letterSpacing: s.tracking,
        ...style,
        '--icon-circle': s.iconCircle,
        '--icon-right': s.iconRight,
        '--circle-inset-y': 'calc((100% - var(--icon-circle)) / 2)',
        '--fill-bg': fillBgColor,
        '--fill-text': fillTextColor,
      } as CSSProperties & Record<string, string>}
    >
      <span className="relative z-0">{children}</span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-10 rounded-full bg-(--fill-bg) inset-[var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%_-_var(--icon-right)_-_var(--icon-circle))] transition-all duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:inset-0"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 flex items-center text-(--fill-text) [clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%_-_var(--icon-right)_-_var(--icon-circle)))] transition-[clip-path] duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:[clip-path:inset(0)]"
        style={{ paddingLeft: s.pl, paddingRight: pr }}
      >
        {children}
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 z-30 flex -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-(--fill-bg) text-(--fill-text) transition-colors duration-[450ms]"
        style={{ right: s.iconRight, height: s.iconCircle, width: s.iconCircle }}
      >
        <ArrowRight
          className="absolute top-1/2 left-1/2 size-[45%] -translate-x-[170%] -translate-y-1/2 scale-0 text-current transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:-translate-x-1/2 group-hover:scale-100"
          strokeWidth={2}
        />
        <ArrowRight
          className="absolute top-1/2 left-1/2 size-[45%] -translate-x-1/2 -translate-y-1/2 text-current transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:translate-x-[70%] group-hover:scale-0"
          strokeWidth={2}
        />
      </span>
    </a>
  )
}
