import { describe, expect, it } from 'vitest'
import { labs } from '../src/labs.ts'
import { chooserHref, experimentHref, labHref } from '../src/links.ts'

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
})
