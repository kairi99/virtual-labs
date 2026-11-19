// Link building. Every link is relative, ends with a slash and carries the language. Pages are real static pages:
// the chooser is /index.html, a lab is /<lab>/index.html, an experiment is /<lab>/<experiment>/.
import type { Experiment, Lab, Lang } from './labs.ts'
import { isLang } from './i18n.ts'

export type Theme = 'auto' | 'light' | 'dark'

const q = (lang: Lang): string => `?lang=${lang}`

/** From the chooser (/) to a lab page. */
export const labHref = (lab: Pick<Lab, 'slug'>, lang: Lang): string => `${lab.slug}/${q(lang)}`
/** From a lab page (/<lab>/) to an experiment. */
export const experimentHref = (x: Pick<Experiment, 'slug'>, lang: Lang, theme: Theme = 'auto'): string =>
  `${x.slug}/${q(lang)}${theme === 'auto' ? '' : `&theme=${theme}`}`
/** Links inside a chooser card, in focus order: the title, one per open experiment, the "Enter laboratory" action. */
export function labCardLinks(lab: Pick<Lab, 'slug' | 'experiments'>, lang: Lang, theme: Theme = 'auto'): { title: string; experiments: { id: string; href: string }[]; action: string } {
  const href = `${lab.slug}/${q(lang)}`
  return {
    title: href,
    // From the chooser an experiment is two levels down.
    experiments: lab.experiments.filter((x) => x.status === 'ready').map((x) => ({ id: x.id, href: `${lab.slug}/${experimentHref(x, lang, theme)}` })),
    action: href,
  }
}
/** From a lab page back to the chooser. */
export const chooserHref = (lang: Lang): string => `../${q(lang)}`

/** `?lang=` and `?theme=` of an incoming address (null when absent or invalid). `theme=auto` is a valid explicit choice. */
export function parseParams(search: string): { lang: Lang | null; theme: Theme | null } {
  const p = new URLSearchParams(search)
  const lang = p.get('lang'), theme = p.get('theme')
  return { lang: isLang(lang) ? lang : null, theme: theme === 'light' || theme === 'dark' || theme === 'auto' ? theme : null }
}
/** The same query without `lang` and `theme` (other parameters stay). Empty string, or starts with `?`. */
export function stripParams(search: string): string {
  const p = new URLSearchParams(search)
  p.delete('lang'); p.delete('theme')
  const r = p.toString()
  return r ? `?${r}` : ''
}
