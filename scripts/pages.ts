// HTML of the generated lab pages. Pure, so a test can check it. The chooser (index.html) is the only hand-written page.
import type { Lab } from '../src/labs.ts'

/** Same early-theme snippet as index.html: avoids a flash of the wrong theme before the module runs. */
export const THEME_SNIPPET = "try{var t=localStorage.getItem('vlabs:theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}"

export function labPageHtml(lab: Lab): string {
  const links = lab.experiments
    .filter((x) => x.status === 'ready')
    .map((x) => `<li><a href="${x.slug}/">${x.title.en}</a></li>`)
    .join('')
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/hub-assets/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${lab.summary.en}" />
    <meta name="theme-color" content="#f5f5f7" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
    <title>${lab.title.en} · Virtual Physics Lab</title>
    <script>${THEME_SNIPPET}</script>
  </head>
  <body data-page="lab" data-lab="${lab.slug}">
    <div id="app"></div>
    <noscript><div class="lp-noscript"><ul>${links}</ul></div></noscript>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
}

/** Vite input key and virtual file path (relative to the project root) of every lab page. */
export const labPagePath = (lab: Pick<Lab, 'slug'>): string => `${lab.slug}/index.html`
