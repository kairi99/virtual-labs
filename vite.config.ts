/// <reference types="vitest/config" />
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { labs } from './src/labs.ts'
import { labPageHtml, labPagePath } from './scripts/pages.ts'

// One page for the chooser and one per lab, generated from src/labs.ts: adding a lab needs no HTML.
// The lab pages are virtual files (<root>/<slug>/index.html) served and built from labPageHtml().
const root = process.cwd()
const virtualPages = new Map(labs.map((l) => [resolve(root, labPagePath(l)), labPageHtml(l)]))

const labPages = (): Plugin => ({
  name: 'virtual-labs:lab-pages',
  enforce: 'pre',
  resolveId(id) { return virtualPages.has(id) ? id : undefined },
  load(id) { return virtualPages.get(id) },
  configureServer(server) {
    // dev server: serve /<lab>/ and /<lab>/index.html from the same generator
    server.middlewares.use(async (req, res, next) => {
      const url = (req.url ?? '').split('?')[0]!
      const lab = labs.find((l) => url === `/${l.slug}/` || url === `/${labPagePath(l)}`)
      if (!lab) return next()
      res.setHeader('Content-Type', 'text/html')
      res.end(await server.transformIndexHtml(url, labPageHtml(lab)))
    })
  },
})

const input: Record<string, string> = { chooser: resolve(root, 'index.html') }
for (const l of labs) input[l.id] = resolve(root, labPagePath(l))

export default defineConfig({
  base: './', // relative asset paths: the site works under any sub-path (no router)
  plugins: [labPages()],
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
  build: {
    // The hub's files go in hub-assets/, never assets/: /mechanics/ also receives mecanica-labs' own assets/ and favicon.svg.
    assetsDir: 'hub-assets',
    target: 'es2022',
    rollupOptions: { input },
  },
})
