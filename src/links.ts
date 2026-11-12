// Link building. Every link is relative, ends with a slash and carries the language. Pages are real static pages:
// the chooser is /index.html, a lab is /<lab>/index.html, an experiment is /<lab>/<experiment>/.
import type { Experiment, Lab, Lang } from './labs.ts'

const q = (lang: Lang): string => `?lang=${lang}`

/** From the chooser (/) to a lab page. */
export const labHref = (lab: Pick<Lab, 'slug'>, lang: Lang): string => `${lab.slug}/${q(lang)}`
/** From a lab page (/<lab>/) to an experiment. */
export const experimentHref = (x: Pick<Experiment, 'slug'>, lang: Lang): string => `${x.slug}/${q(lang)}`
/** From a lab page back to the chooser. */
export const chooserHref = (lang: Lang): string => `../${q(lang)}`
