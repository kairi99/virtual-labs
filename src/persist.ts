// localStorage, always inside try/catch (private mode, blocked storage). Every key is prefixed `vlabs:`.
import { isLang, resolveLang } from './i18n.ts'
import type { Lang } from './labs.ts'
import { parseParams, stripParams, type Theme } from './links.ts'

export const LANG_KEY = 'vlabs:lang'
export const THEME_KEY = 'vlabs:theme'
export type { Theme }

function get(key: string): string | null { try { return localStorage.getItem(key) } catch { return null } }
function set(key: string, value: string | null): void {
  try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value) } catch { /* ignore */ }
}

/** Apply `?lang=` / `?theme=` once: store them as the choice and drop them from the address, so a later switch survives a reload. */
export function consumeParams(): void {
  try {
    const { search, pathname, hash } = globalThis.location
    const { lang, theme } = parseParams(search)
    if (lang) saveLang(lang)
    if (theme) saveTheme(theme)
    const rest = stripParams(search)
    if (rest !== search) history.replaceState(history.state, '', pathname + rest + hash)
  } catch { /* no location */ }
}

export function loadLang(): Lang { return resolveLang(null, get(LANG_KEY)) }
export function saveLang(lang: Lang): void { if (isLang(lang)) set(LANG_KEY, lang) }

export function loadTheme(): Theme { const v = get(THEME_KEY); return v === 'light' || v === 'dark' ? v : 'auto' }
export function saveTheme(t: Theme): void { set(THEME_KEY, t === 'auto' ? null : t) }
