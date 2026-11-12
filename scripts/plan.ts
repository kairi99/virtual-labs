// Pure path mapping of the assembly: which folder of which source repo goes where in dist/. No file system access.
import { join, sep } from 'node:path'
import type { Lab } from '../src/labs.ts'

export interface Step {
  repo: string
  /** Absolute folder of the source checkout. */
  repoDir: string
  /** Folder to run the build command in, or null when the source needs no build. */
  buildCwd: string | null
  command: string | null
  /** Folder with the site to copy. */
  from: string
  /** Destination inside dist/. */
  to: string
  /** Top-level names of `from` that are not copied. */
  exclude: string[]
  /** Files that must exist in `to` after the copy (one per ready experiment). */
  expect: string[]
  /** Copied index.html files that get the hub's home link (`vlabs-home` meta set to `../`): the single-experiment sources. */
  home: string[]
}

/**
 * One step per source site. Experiments that share a repo and a mount (the four mecanica-labs ones) make one step.
 * `baseDir`: folder that holds the source checkouts. `distDir`: the hub's output folder.
 */
export function planAssembly(labs: readonly Lab[], baseDir: string, distDir: string): Step[] {
  const steps = new Map<string, Step>()
  for (const lab of labs) {
    for (const x of lab.experiments) {
      if (x.status !== 'ready') continue
      const s = x.source
      if (!s) throw new Error(`Experiment ${lab.id}/${x.id} is ready but has no source`)
      const repoDir = join(baseDir, s.repo)
      const to = s.mount === 'lab' ? join(distDir, lab.slug) : join(distDir, lab.slug, x.slug)
      const rel = s.build ? s.build.out : s.folder
      if (!rel) throw new Error(`Source of ${lab.id}/${x.id} needs build.out or folder`)
      const key = `${s.repo}\0${to}`
      const expect = join(to, s.mount === 'lab' ? x.slug : '', 'index.html')
      const prev = steps.get(key)
      if (prev) { prev.expect.push(expect); continue }
      const home = s.mount === 'experiment' ? [expect] : []
      steps.set(key, {
        repo: s.repo, repoDir,
        buildCwd: s.build ? join(repoDir, s.build.cwd) : null,
        command: s.build ? s.build.command : null,
        from: join(repoDir, rel), to, exclude: s.exclude ?? [], expect: [expect], home,
      })
    }
  }
  return [...steps.values()]
}

/** True when a path (relative to the source folder) is one of the excluded top-level names or inside one. */
export function isExcluded(relPath: string, exclude: readonly string[]): boolean {
  const top = relPath.split(sep)[0] ?? ''
  return top !== '' && exclude.includes(top)
}

/** Base directory of the source checkouts: --base flag, then SOURCES_DIR, then the hub's parent folder. */
export function resolveBaseDir(args: readonly string[], env: Record<string, string | undefined>, hubDir: string): string {
  const i = args.indexOf('--base')
  if (i >= 0) {
    const v = args[i + 1]
    if (!v || v.startsWith('--')) throw new Error('--base needs a folder')
    return v
  }
  const eq = args.find((a) => a.startsWith('--base='))
  if (eq) return eq.slice('--base='.length)
  if (env.SOURCES_DIR) return env.SOURCES_DIR
  return join(hubDir, '..')
}

/** Where the simulations' "All experiments" link points when the hub hosts them: the lab page, one level up. */
export const HOME_HREF = '../'

const HOME_META = /(<meta\s+name=["']vlabs-home["']\s+content=")[^"]*(")/

/**
 * Sets the content of `<meta name="vlabs-home" content="">` in an assembled index.html. Throws when the tag is
 * missing, so a simulation that lost it is noticed instead of silently shipping without its home link.
 */
export function setHomeMeta(html: string, href: string = HOME_HREF): string {
  if (!HOME_META.test(html)) throw new Error('no <meta name="vlabs-home" content=""> tag found')
  return html.replace(HOME_META, (_m, a: string, b: string) => `${a}${href}${b}`)
}
