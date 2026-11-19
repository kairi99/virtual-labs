// Both kinds of page, picked by <body data-page>: the lab chooser ("chooser") and a lab's experiment list ("lab",
// with data-lab=<slug>). No router: each page is a real HTML file. English first, EN|ES switch, theme toggle.
import './styles/tokens.css'
import './styles/app.css'
import './styles/hub.css'
import { el, svg } from './dom.ts'
import { fmt, t } from './i18n.ts'
import { labs, readyCount, type Experiment, type Lab, type Lang } from './labs.ts'
import { chooserHref, experimentHref, labCardLinks, labHref } from './links.ts'
import { consumeParams, loadLang, loadTheme, saveLang, saveTheme, type Theme } from './persist.ts'
import { S } from './strings.ts'
import { applyTheme, nextTheme, themeIcon } from './theme.ts'
import { thumb } from './thumbs.ts'

const ISSUES_URL = 'https://github.com/kairi99/virtual-labs/issues'

/** The header mark: a pendulum (same drawing as hub-assets/favicon.svg). */
function brandMark(): SVGElement {
  return svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', class: 'lp-mark' },
    svg('path', { d: 'M4 4h16', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }),
    svg('path', { d: 'M12 4l-5 11', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
    svg('circle', { cx: 6.2, cy: 17, r: 3.4, fill: 'var(--accent)' }),
    svg('path', { d: 'M13 20a8 8 0 0 0 7-6', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-dasharray': '0.1 3' }))
}

function run(): void {
  const page = document.body.dataset.page
  const lab: Lab | undefined = page === 'lab' ? labs.find((l) => l.slug === document.body.dataset.lab) : undefined
  consumeParams()
  let lang: Lang = loadLang()
  let theme: Theme = loadTheme()

  const root = document.getElementById('app')!
  const header = el('header', 'lp-top')
  const brand = el('a', 'lp-brand', undefined, { href: chooserHref(lang) })
  const brandText = el('span')
  brand.append(brandMark(), brandText)
  const tools = el('div', 'lp-tools')
  const langGroup = el('div', 'lp-seg', undefined, { role: 'group' })
  const langBtns = (['en', 'es'] as const).map((l) => {
    const b = el('button', 'lp-seg-btn', l.toUpperCase(), { type: 'button', lang: l })
    b.addEventListener('click', () => { lang = l; saveLang(lang); label() })
    langGroup.append(b)
    return { l, b }
  })
  const themeBtn = el('button', 'lp-tool', undefined, { type: 'button' })
  tools.append(langGroup, themeBtn)
  header.append(brand, tools)

  const main = el('main', 'lp-main', undefined, { id: 'main', tabindex: '-1' })
  const hero = el('section', 'lp-hero')
  const back = el('a', 'lp-back')
  const h1 = el('h1', 'lp-heading')
  const sub = el('p', 'lp-sub')
  if (lab) hero.append(back)
  hero.append(h1, sub)
  const grid = el('ul', lab ? 'lp-grid' : 'lp-grid lp-grid-labs')
  main.append(hero, grid)

  const footer = el('footer', 'credits lp-credits')
  const creditsText = el('p')
  const report = el('a', undefined, undefined, { href: ISSUES_URL, rel: 'noopener' })
  footer.append(creditsText, report)

  const skip = el('a', 'skip-link', undefined, { href: '#main' })
  skip.addEventListener('click', (e) => { e.preventDefault(); main.focus() })
  root.append(skip, header, main, footer)

  // ---- cards: the title link is stretched over the card by CSS (a large click area); the action link and the
  // experiment links of a lab card sit above that overlay (z-index), so nothing interactive is covered ----
  interface Card { title: HTMLElement; summary: HTMLElement; kicker: HTMLElement; action: HTMLElement; link?: HTMLAnchorElement; list?: HTMLUListElement; soon: boolean; href?: (l: Lang) => string }
  const cards: Card[] = []
  function addCard(opts: { thumbKind: Parameters<typeof thumb>[0]; href?: (l: Lang) => string; soon: boolean; withList: boolean; id: string }): void {
    const li = el('li')
    const article = el('article', `lp-card${opts.soon ? ' lp-card-soon' : ''}${opts.withList ? ' lp-card-lab' : ''}`, undefined, { 'data-id': opts.id })
    const body = el('div', 'lp-body')
    const kicker = el('p', 'lp-kicker')
    const title = el('h2', 'lp-title')
    const summary = el('p', 'lp-summary')
    const c: Card = { title, summary, kicker, action: el(opts.soon ? 'span' : 'a', opts.soon ? 'chip' : 'btn btn-primary lp-action'), soon: opts.soon, href: opts.href }
    if (!opts.soon) {
      c.link = el('a', 'lp-link')
      title.append(c.link)
    } else c.action.dataset.soon = '1'
    body.append(kicker, title, summary)
    if (opts.withList) { c.list = el('ul', 'lp-inside'); body.append(c.list) }
    body.append(c.action)
    article.append(thumb(opts.thumbKind), body)
    li.append(article)
    grid.append(li)
    cards.push(c)
  }

  if (lab) {
    for (const x of lab.experiments) {
      addCard({ id: x.id, thumbKind: x.thumb, soon: x.status === 'soon', withList: false, href: x.status === 'ready' ? (l) => experimentHref(x, l, theme) : undefined })
    }
  } else {
    for (const l of labs) addCard({ id: l.id, thumbKind: l.experiments[0]!.thumb, soon: false, withList: true, href: (lg) => labHref(l, lg) })
  }

  // ---- text ----
  function label(): void {
    document.documentElement.lang = lang
    const site = t(S.siteName, lang)
    brandText.textContent = site
    brand.setAttribute('href', lab ? chooserHref(lang) : `./?lang=${lang}`)
    const desc = lab ? t(lab.summary, lang) : t(S.chooserSub, lang)
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
    if (lab) {
      document.title = `${t(lab.title, lang)} · ${site}`
      h1.textContent = t(lab.title, lang)
      sub.textContent = t(lab.summary, lang)
      back.textContent = `‹ ${t(S.back, lang)}`
      back.setAttribute('href', chooserHref(lang))
      back.setAttribute('aria-label', t(S.backAria, lang))
      main.setAttribute('aria-label', t(S.experimentsRegion, lang))
    } else {
      document.title = site
      h1.textContent = t(S.chooserTitle, lang)
      sub.textContent = t(S.chooserSub, lang)
      main.setAttribute('aria-label', t(S.labsRegion, lang))
    }
    skip.textContent = t(S.skip, lang)
    creditsText.textContent = t(S.credits, lang)
    report.textContent = t(S.report, lang)
    langGroup.setAttribute('aria-label', t(S.language, lang))
    for (const { l, b } of langBtns) b.setAttribute('aria-pressed', String(l === lang))
    themeBtn.replaceChildren(themeIcon(theme))
    const th = `${t(S.theme, lang)}: ${t(S.themes[theme], lang)}`
    themeBtn.setAttribute('aria-label', th)
    themeBtn.title = th

    const items: readonly (Lab | Experiment)[] = lab ? lab.experiments : labs
    cards.forEach((c, i) => {
      const item = items[i]!
      ;(c.link ?? c.title).textContent = t(item.title, lang)
      c.summary.textContent = t(item.summary, lang)
      if ('experiments' in item) {
        const n = readyCount(item)
        c.kicker.textContent = fmt(t(n === 1 ? S.experimentCount.one : S.experimentCount.many, lang), { n })
        const hrefs = labCardLinks(item, lang, theme).experiments
        c.list?.replaceChildren(...item.experiments.filter((x) => x.status === 'ready').map((x, k) => {
          const li = el('li')
          li.append(el('a', 'lp-exp', t(x.title, lang), { href: hrefs[k]!.href }))
          return li
        }))
        c.list?.setAttribute('aria-label', t(S.inside, lang))
      } else {
        const topic = t(item.topic, lang)
        c.kicker.textContent = item.guide !== undefined ? `${fmt(t(S.guide, lang), { n: item.guide })} · ${topic}` : topic
      }
      if (c.soon) c.action.textContent = t(S.soon, lang)
      else if (c.link && c.href) {
        c.link.setAttribute('href', c.href(lang))
        const verb = lab ? t(S.open, lang) : t(S.enterLab, lang)
        c.action.textContent = verb
        c.action.setAttribute('href', c.link.getAttribute('href')!)
        c.action.setAttribute('aria-label', `${verb}: ${t(item.title, lang)}`)
      }
    })
  }
  themeBtn.addEventListener('click', () => { theme = nextTheme(theme); saveTheme(theme); applyTheme(theme); label() })
  applyTheme(theme)
  label()
}

run()
