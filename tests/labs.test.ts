import { describe, expect, it } from 'vitest'
import { labs, readyCount, type Text } from '../src/labs.ts'

const texts = (t: Text): boolean => t.en.trim() !== '' && t.es.trim() !== ''
const all = labs.flatMap((l) => l.experiments.map((x) => ({ lab: l, x })))

describe('labs data', () => {
  it('has unique lab ids and slugs', () => {
    expect(new Set(labs.map((l) => l.id)).size).toBe(labs.length)
    expect(new Set(labs.map((l) => l.slug)).size).toBe(labs.length)
  })
  it('has unique experiment ids (global) and slugs (per lab)', () => {
    expect(new Set(all.map(({ x }) => x.id)).size).toBe(all.length)
    for (const l of labs) expect(new Set(l.experiments.map((x) => x.slug)).size).toBe(l.experiments.length)
  })
  it('uses URL-safe slugs', () => {
    for (const s of [...labs.map((l) => l.slug), ...all.map(({ x }) => x.slug)]) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })
  it('has both languages everywhere', () => {
    for (const l of labs) { expect(texts(l.title)).toBe(true); expect(texts(l.summary)).toBe(true) }
    for (const { x } of all) { expect(texts(x.title)).toBe(true); expect(texts(x.summary)).toBe(true); expect(texts(x.topic), x.id).toBe(true) }
  })
  it('has a source for every ready experiment, and build or folder in it', () => {
    for (const { x } of all.filter(({ x }) => x.status === 'ready')) {
      expect(x.source, x.id).toBeDefined()
      expect(x.source!.build !== null || !!x.source!.folder, x.id).toBe(true)
    }
  })
  it('lists the expected content', () => {
    expect(labs.map((l) => l.slug)).toEqual(['mechanics', 'atomic'])
    expect(all.filter(({ x }) => x.status === 'soon').map(({ x }) => x.slug)).toEqual([])
    expect(all.length).toBe(8)
  })
  it('does not collide with the files of the hub or of a lab-mounted source', () => {
    for (const l of labs) expect(['hub-assets', 'assets', 'src']).not.toContain(l.slug)
    for (const { x } of all) expect(['assets', 'help', 'favicon.svg', 'index.html']).not.toContain(x.slug)
  })
  it('counts only ready experiments on a lab card', () => {
    expect(readyCount(labs[0]!)).toBe(6)
    expect(readyCount(labs[1]!)).toBe(2)
  })
  it('names the four source repositories (used by the assemble script)', () => {
    const repos = [...new Set(all.flatMap(({ x }) => (x.source ? [x.source.repo] : [])))]
    expect(repos).toEqual(['mecanica-labs', 'parametricResonance', 'AtomicSimulation', 'photoelectric-sim'])
  })
})
