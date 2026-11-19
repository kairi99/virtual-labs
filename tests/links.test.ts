import { describe, expect, it } from 'vitest'
import { labs, readyCount } from '../src/labs.ts'
import { chooserHref, experimentHref, labCardLinks, labHref, parseParams, stripParams } from '../src/links.ts'

describe('links', () => {
  it('are relative, end with a slash and carry the language', () => {
    expect(labHref(labs[0]!, 'en')).toBe('mechanics/?lang=en')
    expect(experimentHref(labs[0]!.experiments[0]!, 'es')).toBe('mruv/?lang=es')
    expect(chooserHref('es')).toBe('../?lang=es')
  })
  it('never start with a slash or a scheme, and the path ends with a slash', () => {
    for (const lang of ['en', 'es'] as const) {
      const hrefs = [chooserHref(lang), ...labs.flatMap((l) => [labHref(l, lang), ...l.experiments.map((x) => experimentHref(x, lang))])]
      for (const h of hrefs) {
        expect(h).not.toMatch(/^(\/|[a-z]+:)/)
        expect(h.split('?')[0]).toMatch(/\/$/)
        expect(h.endsWith(`?lang=${lang}`)).toBe(true)
      }
    }
  })
  it('carry the theme only when it is explicit', () => {
    const x = labs[0]!.experiments[0]!
    expect(experimentHref(x, 'es', 'auto')).toBe('mruv/?lang=es')
    expect(experimentHref(x, 'en', 'dark')).toBe('mruv/?lang=en&theme=dark')
    expect(experimentHref(x, 'es', 'light')).toBe('mruv/?lang=es&theme=light')
  })
  it('gives a chooser card one title link, one link per open experiment and one action link', () => {
    for (const lab of labs) {
      const c = labCardLinks(lab, 'es', 'dark')
      expect(c.experiments.length).toBe(readyCount(lab))
      expect(c.title).toBe(c.action)
      for (const e of c.experiments) expect(e.href).toMatch(/^[a-z-]+\/[a-z-]+\/\?lang=es&theme=dark$/)
    }
    expect(labCardLinks(labs[1]!, 'en').experiments.map((e) => e.href)).toEqual(['atomic/x-ray/?lang=en', 'atomic/photoelectric/?lang=en'])
  })
  it('parses and strips ?lang= and ?theme= of the hub address', () => {
    expect(parseParams('?lang=es&theme=dark')).toEqual({ lang: 'es', theme: 'dark' })
    expect(parseParams('?lang=fr&theme=pink')).toEqual({ lang: null, theme: null })
    expect(parseParams('?theme=auto').theme).toBe('auto')
    expect(stripParams('?lang=es&theme=dark')).toBe('')
    expect(stripParams('?x=1&lang=es')).toBe('?x=1')
    expect(stripParams('')).toBe('')
  })
})
