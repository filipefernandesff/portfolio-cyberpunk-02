import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type Social = {
  name: string
  href: string
  icon: ReactNode
  color: string
}

export default function AnimatedSocialLinks({ socials }: { socials: Social[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [clicked, setClicked] = useState(false)

  const activate = (name: string) => {
    setHovered(name)
    // oxlint-disable-next-line react/purity -- chamado em evento de hover, não na renderização
    setRotation(Math.random() * 20 - 10)
  }

  return (
    <>
      <div className="hidden items-center justify-center [@media(hover:none)]:flex">
        {socials.map((social) => (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            whileTap={{ scale: 1.3 }}
            transition={{ duration: 0.15 }}
            className="flex size-11 items-center justify-center text-[22px]"
            style={{ color: social.color }}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    <div className="flex items-center justify-center [@media(hover:none)]:hidden">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className={`relative px-4 py-2 text-[12px] font-semibold tracking-[0.12em] uppercase transition-[opacity,color] duration-200 ${
            hovered && hovered !== social.name ? 'opacity-50' : 'opacity-100'
          } ${hovered === social.name ? 'text-[#ff3ec8]' : 'text-[#a99fc4]'}`}
          onMouseEnter={() => activate(social.name)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => activate(social.name)}
          onBlur={() => setHovered(null)}
          onClick={() => {
            setClicked(true)
            setTimeout(() => setClicked(false), 300)
          }}
        >
          {social.name}
          <AnimatePresence>
            {hovered === social.name && (
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                animate={{ scale: clicked ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-[36px]"
                  style={{ color: social.color, filter: `drop-shadow(0 0 8px ${social.color})` }}
                  initial={{ y: -40, rotate: rotation, opacity: 0 }}
                  animate={{ y: -50, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {social.icon}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </a>
      ))}
    </div>
    </>
  )
}
