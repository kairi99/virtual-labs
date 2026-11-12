import { describe, expect, it } from 'vitest'
import { fmt, resolveLang, t } from '../src/i18n.ts'

describe('resolveLang', () => {
  it('prefers ?lang=, then the stored choice, then English', () => {
    expect(resolveLang('es', 'en')).toBe('es')
    expect(resolveLang('en', 'es')).toBe('en')
    expect(resolveLang(null, 'es')).toBe('es')
    expect(resolveLang(null, null)).toBe('en')
  })
  it('ignores invalid values', () => {
    expect(resolveLang('fr', 'es')).toBe('es')
    expect(resolveLang('fr', 'de')).toBe('en')
    expect(resolveLang('', '')).toBe('en')
  })
})
describe('text helpers', () => {
  it('picks a language and fills placeholders', () => {
    expect(t({ en: 'a', es: 'b' }, 'es')).toBe('b')
    expect(fmt('Open: {title} {n}', { title: 'X', n: 2 })).toBe('Open: X 2')
  })
})
