// Language: ?lang= first, then the stored choice, then English.
import type { Lang } from './labs.ts'

export const isLang = (v: unknown): v is Lang => v === 'en' || v === 'es'

/** Pure resolution: the `?lang=` value (or null), the stored value (or null). */
export function resolveLang(queryValue: string | null, stored: string | null): Lang {
  if (isLang(queryValue)) return queryValue
  if (isLang(stored)) return stored
  return 'en'
}

/** Pick the text of a `{ en, es }` object. */
export const t = (text: Record<Lang, string>, lang: Lang): string => text[lang]

/** Replace `{name}` placeholders. */
export const fmt = (s: string, vars: Record<string, string | number>): string =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))
