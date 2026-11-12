// localStorage, always inside try/catch (private mode, blocked storage). Every key is prefixed `vlabs:`.
import { isLang, resolveLang } from './i18n.ts'
import type { Lang } from './labs.ts'

export const LANG_KEY = 'vlabs:lang'
export const THEME_KEY = 'vlabs:theme'
export type Theme = 'auto' | 'light' | 'dark'

function get(key: string): string | null { try { return localStorage.getItem(key) } catch { return null } }
function set(key: string, value: string | null): void {
  try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value) } catch { /* ignore */ }
}

export function loadLang(): Lang {
  let query: string | null = null
  try { query = new URLSearchParams(globalThis.location?.search ?? '').get('lang') } catch { /* no location */ }
  return resolveLang(query, get(LANG_KEY))
}
export function saveLang(lang: Lang): void { if (isLang(lang)) set(LANG_KEY, lang) }

export function loadTheme(): Theme { const v = get(THEME_KEY); return v === 'light' || v === 'dark' ? v : 'auto' }
export function saveTheme(t: Theme): void { set(THEME_KEY, t === 'auto' ? null : t) }
