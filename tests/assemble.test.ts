import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { labs } from '../src/labs.ts'
import { labPageHtml } from '../scripts/pages.ts'
import { isExcluded, planAssembly, resolveBaseDir, setHomeMeta } from '../scripts/plan.ts'

const base = join('/src'), dist = join('/hub', 'dist')
const steps = planAssembly(labs, base, dist)
const by = (repo: string) => steps.find((s) => s.repo === repo)!

describe('planAssembly', () => {
  it('makes one step per source site', () => {
    expect(steps.map((s) => s.repo)).toEqual(['mecanica-labs', 'parametricResonance', 'AtomicSimulation', 'photoelectric-sim'])
  })
  it('copies mecanica-labs into the lab folder without its index.html', () => {
    const s = by('mecanica-labs')
    expect(s.from).toBe(join('/src', 'mecanica-labs', 'dist'))
    expect(s.to).toBe(join(dist, 'mechanics'))
    expect(s.exclude).toEqual(['index.html'])
    expect(s.expect).toEqual(['mruv', 'parabolico', 'segunda-ley', 'rozamiento', 'pendulum-incline'].map((x) => join(dist, 'mechanics', x, 'index.html')))
  })
  it('copies the plain-JS simulator without tests, dev, tools and README', () => {
    const s = by('parametricResonance')
    expect(s.command).toBeNull()
    expect(s.from).toBe(join('/src', 'parametricResonance', 'simulator'))
    expect(s.to).toBe(join(dist, 'mechanics', 'parametric-resonance'))
    expect(s.exclude).toEqual(['tests', 'dev', 'tools', 'README.md'])
  })
  it('maps the Vite apps and builds them in the right folder', () => {
    const a = by('AtomicSimulation')
    expect(a.buildCwd).toBe(join('/src', 'AtomicSimulation', 'web'))
    expect(a.from).toBe(join('/src', 'AtomicSimulation', 'web', 'dist'))
    expect(a.to).toBe(join(dist, 'atomic', 'x-ray'))
    const p = by('photoelectric-sim')
    expect(p.from).toBe(join('/src', 'photoelectric-sim', 'dist'))
    expect(p.to).toBe(join(dist, 'atomic', 'photoelectric'))
  })
  it('never lets a source target the hub assets or the lab pages', () => {
    for (const s of steps) {
      expect(s.to).not.toBe(dist)
      expect(s.to.startsWith(join(dist, 'hub-assets'))).toBe(false)
    }
  })
  it('rejects a ready experiment without a source', () => {
    const bad = [{ ...labs[0]!, experiments: [{ ...labs[0]!.experiments[0]!, source: undefined }] }]
    expect(() => planAssembly(bad, base, dist)).toThrow(/no source/)
  })
})

describe('home link', () => {
  it('rewrites only the three single-experiment sources', () => {
    expect(by('mecanica-labs').home).toEqual([])
    expect(by('parametricResonance').home).toEqual([join(dist, 'mechanics', 'parametric-resonance', 'index.html')])
    expect(by('AtomicSimulation').home).toEqual([join(dist, 'atomic', 'x-ray', 'index.html')])
    expect(by('photoelectric-sim').home).toEqual([join(dist, 'atomic', 'photoelectric', 'index.html')])
  })
  it('sets the meta content', () => {
    const h = '<head><meta charset="utf-8">\n<meta name="vlabs-home" content=""></head>'
    expect(setHomeMeta(h)).toBe('<head><meta charset="utf-8">\n<meta name="vlabs-home" content="../"></head>')
    expect(setHomeMeta('<meta name="vlabs-home" content="x">')).toContain('content="../"')
  })
  it('fails when the tag is missing', () => {
    expect(() => setHomeMeta('<head></head>')).toThrow(/vlabs-home/)
  })
})

describe('isExcluded', () => {
  it('matches top-level names and what is inside them', () => {
    expect(isExcluded('tests', ['tests'])).toBe(true)
    expect(isExcluded(join('tests', 'a.js'), ['tests'])).toBe(true)
    expect(isExcluded(join('js', 'tests'), ['tests'])).toBe(false)
    expect(isExcluded('', ['tests'])).toBe(false)
  })
})

describe('resolveBaseDir', () => {
  it('uses --base, then SOURCES_DIR, then the hub parent', () => {
    expect(resolveBaseDir(['--base', '/a'], { SOURCES_DIR: '/b' }, '/x/hub')).toBe('/a')
    expect(resolveBaseDir(['--base=/a'], {}, '/x/hub')).toBe('/a')
    expect(resolveBaseDir([], { SOURCES_DIR: '/b' }, '/x/hub')).toBe('/b')
    expect(resolveBaseDir([], {}, '/x/hub')).toBe(join('/x'))
    expect(() => resolveBaseDir(['--base'], {}, '/x/hub')).toThrow()
  })
})

describe('labPageHtml', () => {
  it('marks the lab and uses the shared entry', () => {
    const h = labPageHtml(labs[1]!)
    expect(h).toContain('data-lab="atomic"')
    expect(h).toContain('/src/main.ts')
    expect(h).toContain('<a href="x-ray/">')
  })
})
