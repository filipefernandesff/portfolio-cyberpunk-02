import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { categorias, metaDaRota, SITE_URL } from './src/data/materiais-categorias.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Gera dist/materiais/**/index.html com title/description/canonical próprios de cada rota,
// para que crawlers e prévias de link (sem JS) vejam o SEO correto de cada categoria.
// O Cloudflare Pages serve esses arquivos direto; qualquer outra rota cai no index.html.
function materiaisSeo(): Plugin {
  let outDir = 'dist'
  return {
    name: 'materiais-seo',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir)
    },
    closeBundle() {
      const base = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const slug of ['', ...categorias.map((c) => c.slug)]) {
        const meta = metaDaRota(slug)
        const url = SITE_URL + meta.path
        const html = base
          .replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
          .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, `$1${esc(meta.description)}"`)
          .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
          .replace(/(<meta property="og:title"\s+content=")[^"]*"/, `$1${esc(meta.title)}"`)
          .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${esc(meta.description)}"`)
          .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
        const dir = join(outDir, meta.path)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), html)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), materiaisSeo()],
})
