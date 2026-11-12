// Both kinds of page, picked by <body data-page>: the lab chooser ("chooser") and a lab's experiment list ("lab",
// with data-lab=<slug>). No router: each page is a real HTML file. English first, ES toggle, theme toggle.
import './styles/tokens.css'
import './styles/app.css'
import './styles/hub.css'
import { button, el } from './dom.ts'
import { fmt, t } from './i18n.ts'
import { labs, readyCount, repoUrl, sourceRepos, type Lab, type Lang } from './labs.ts'
import { chooserHref, experimentHref, labHref } from './links.ts'
import { loadLang, loadTheme, saveLang, saveTheme, type Theme } from './persist.ts'
import { S } from './strings.ts'
import { applyTheme, nextTheme, themeIcon } from './theme.ts'
import { thumb } from './thumbs.ts'

function run(): void {
  const page = document.body.dataset.page
  const lab: Lab | undefined = page === 'lab' ? labs.find((l) => l.slug === document.body.dataset.lab) : undefined
  let lang: Lang = loadLang()
  let theme: Theme = loadTheme()

  const root = document.getElementById('app')!
  const header = el('header', 'lp-top')
  const brand = el('a', 'lp-brand', undefined, { href: chooserHref(lang) })
  const tools = el('div', 'lp-tools')
  const langBtn = button('', 'lp-tool')
  const themeBtn = button('', 'lp-tool')
  tools.append(langBtn, themeBtn)
  header.append(brand, tools)

  const main = el('main', 'lp-main', undefined, { id: 'main', tabindex: '-1' })
  const hero = el('section', 'lp-hero')
  const back = el('a', 'lp-back')
  const h1 = el('h1', 'lp-heading')
  const sub = el('p', 'lp-sub')
  if (lab) hero.append(back)
  hero.append(h1, sub)
  const grid = el('ul', 'lp-grid')
  main.append(hero, grid)

  const footer = el('footer', 'credits lp-credits')
  const creditsText = el('p')
  const srcNav = el('nav')
  const srcList = el('ul', 'lp-source-list')
  srcNav.append(srcList)
  footer.append(creditsText, srcNav)

  const skip = el('a', 'skip-link', undefined, { href: '#main' })
  skip.addEventListener('click', (e) => { e.preventDefault(); main.focus() })
  root.append(skip, header, main, footer)

  const repoLinks = sourceRepos().map((repo) => {
    const a = el('a', undefined, repo, { href: repoUrl(repo), rel: 'noopener' })
    const li = el('li')
    li.append(a)
    srcList.append(li)
    return a
  })

  // ---- cards ----
  interface Card { title: HTMLElement; summary: HTMLElement; meta: HTMLElement; action: HTMLElement; count?: HTMLElement; guide?: HTMLElement; link?: HTMLAnchorElement; titleText: (l: Lang) => string; href?: (l: Lang) => string; soon: boolean }
  const cards: Card[] = []
  function addCard(opts: { thumbKind: Parameters<typeof thumb>[0]; titleText: Card['titleText']; href?: (l: Lang) => string; soon: boolean; guideN?: number; countN?: number; id: string }): void {
    const li = el('li')
    const article = el('article', `lp-card${opts.soon ? ' lp-card-soon' : ''}`, undefined, { 'data-id': opts.id })
    const meta = el('div', 'lp-meta')
    const title = el('h2', 'lp-title')
    const summary = el('p', 'lp-summary')
    const c: Card = { title, summary, meta, action: title, titleText: opts.titleText, href: opts.href, soon: opts.soon }
    if (opts.guideN !== undefined) { c.guide = el('span', 'lp-guide'); meta.append(c.guide) }
    if (opts.countN !== undefined) { c.count = el('span', 'chip'); meta.append(c.count) }
    if (opts.soon) {
      const chip = el('span', 'chip')
      chip.dataset.soon = '1'
      meta.append(chip)
      c.action = chip
      // a "soon" card is visible but not a link, not focusable and not a button
    } else {
      c.link = el('a', 'btn btn-primary lp-action')
      c.action = c.link
    }
    article.append(thumb(opts.thumbKind), meta, title, summary)
    if (c.link) article.append(c.link)
    li.append(article)
    grid.append(li)
    cards.push(c)
  }

  if (lab) {
    for (const x of lab.experiments) {
      addCard({
        id: x.id, thumbKind: x.thumb, soon: x.status === 'soon', guideN: x.guide,
        titleText: (l) => t(x.title, l),
        href: x.status === 'ready' ? (l) => experimentHref(x, l) : undefined,
      })
    }
  } else {
    for (const l of labs) {
      addCard({
        id: l.id, thumbKind: l.experiments[0]!.thumb, soon: false, countN: readyCount(l),
        titleText: (lg) => t(l.title, lg), href: (lg) => labHref(l, lg),
      })
    }
  }

  // ---- text ----
  function label(): void {
    document.documentElement.lang = lang
    const site = t(S.siteName, lang)
    brand.textContent = site
    brand.setAttribute('href', lab ? chooserHref(lang) : `./?lang=${lang}`)
    brand.setAttribute('aria-label', site)
    if (lab) {
      document.title = `${t(lab.title, lang)} · ${site}`
      h1.textContent = t(lab.title, lang)
      sub.textContent = t(lab.summary, lang)
      back.textContent = `‹ ${t(S.back, lang)}`
      back.setAttribute('href', chooserHref(lang))
      back.setAttribute('aria-label', t(S.backAria, lang))
      main.setAttribute('aria-label', t(S.experimentsRegion, lang))
    } else {
      document.title = `${site}`
      h1.textContent = t(S.chooserTitle, lang)
      sub.textContent = t(S.chooserSub, lang)
      main.setAttribute('aria-label', t(S.labsRegion, lang))
    }
    skip.textContent = t(S.skip, lang)
    creditsText.textContent = t(S.credits, lang)
    srcNav.setAttribute('aria-label', t(S.sourcesAria, lang))
    srcNav.setAttribute('title', t(S.sources, lang))
    for (const a of repoLinks) a.setAttribute('aria-label', `${t(S.sources, lang)}: ${a.textContent}`)
    langBtn.textContent = lang === 'es' ? 'EN' : 'ES'
    langBtn.setAttribute('aria-label', `${langBtn.textContent}: ${t(S.langSwitch, lang)}`)
    themeBtn.replaceChildren(themeIcon(theme))
    const th = `${t(S.theme, lang)}: ${t(S.themes[theme], lang)}`
    themeBtn.setAttribute('aria-label', th)
    themeBtn.title = th

    const items = lab ? lab.experiments : labs
    cards.forEach((c, i) => {
      const item = items[i]!
      const title = c.titleText(lang)
      c.title.textContent = title
      c.summary.textContent = t(item.summary, lang)
      if (c.guide && 'guide' in item && item.guide !== undefined) c.guide.textContent = fmt(t(S.guide, lang), { n: item.guide })
      if (c.count && 'experiments' in item) {
        const n = readyCount(item)
        c.count.textContent = fmt(t(n === 1 ? S.experimentCount.one : S.experimentCount.many, lang), { n })
      }
      if (c.soon) c.action.textContent = t(S.soon, lang)
      else if (c.link && c.href) {
        c.link.setAttribute('href', c.href(lang))
        c.link.textContent = lab ? t(S.open, lang) : t(S.enterLab, lang)
        c.link.setAttribute('aria-label', fmt(t(lab ? S.openAria : S.enterLabAria, lang), { title }))
      }
    })
  }
  langBtn.addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; saveLang(lang); label() })
  themeBtn.addEventListener('click', () => { theme = nextTheme(theme); saveTheme(theme); applyTheme(theme); label() })
  applyTheme(theme)
  label()
}

run()
