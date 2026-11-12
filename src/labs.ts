// The single place to add laboratories and experiments. Pure data: the pages, the build inputs and the assembly
// script are all derived from it. Erasable TypeScript only (Node loads this file directly in scripts/assemble.mjs).

export type Lang = 'en' | 'es'
export interface Text { en: string; es: string }

export type ThumbKind = 'incline' | 'arc' | 'pulley' | 'block' | 'spring' | 'cart-pendulum' | 'crystal' | 'photocell'

/** Where an experiment's site comes from and how it is built and mounted. */
export interface Source {
  /** Folder name of the checkout, a sibling of this repo by default (also github.com/kairi99/<repo>). */
  repo: string
  /**
   * Build step, or null when the source is already static (parametricResonance).
   * `cwd` is relative to the repo; `out` is the folder with the built site, relative to the repo.
   */
  build: { cwd: string; command: string; out: string } | null
  /** Folder with the site when `build` is null (relative to the repo). */
  folder?: string
  /**
   * 'experiment': the site is copied to /<lab>/<experiment>/.
   * 'lab': the site holds several experiments (one folder per slug) and is copied to /<lab>/.
   */
  mount: 'experiment' | 'lab'
  /** Top-level files or folders of the source that are not copied. */
  exclude?: string[]
}

export interface Experiment {
  id: string
  slug: string
  title: Text
  summary: Text
  /** Number of the lab guide ("Práctica n"), when the experiment follows one. */
  guide?: number
  thumb: ThumbKind
  status: 'ready' | 'soon'
  /** Required when ready. */
  source?: Source
}

export interface Lab {
  id: string
  slug: string
  title: Text
  summary: Text
  experiments: Experiment[]
}

const mecanica: Source = {
  repo: 'mecanica-labs',
  build: { cwd: '.', command: 'npm run build', out: 'dist' },
  mount: 'lab',
  exclude: ['index.html'], // the hub's own lab page lives at /mechanics/
}

export const labs: Lab[] = [
  {
    id: 'mechanics',
    slug: 'mechanics',
    title: { en: 'Principles of Newtonian Mechanics', es: 'Principios de Mecánica Newtoniana' },
    summary: {
      en: 'Motion, forces, friction and oscillations: assemble the setup, take your own measurements and analyse the data.',
      es: 'Movimiento, fuerzas, rozamiento y oscilaciones: arma el montaje, toma tus propias medidas y analiza los datos.',
    },
    experiments: [
      {
        id: 'mruv', slug: 'mruv', guide: 1, thumb: 'incline', status: 'ready', source: mecanica,
        title: { en: 'Uniformly accelerated rectilinear motion', es: 'Movimiento rectilíneo uniformemente variado' },
        summary: {
          en: 'A DigiCart rolls down an inclined rail: assemble the setup, time it, measure and analyse the acceleration.',
          es: 'Un DigiCart rueda por una riel inclinada: arma el montaje, cronometra, mide y analiza la aceleración.',
        },
      },
      {
        id: 'parabolic', slug: 'parabolico', guide: 2, thumb: 'arc', status: 'ready', source: mecanica,
        title: { en: 'Projectile motion', es: 'Movimiento parabólico' },
        summary: {
          en: 'Horizontal launch of a marble and a ping-pong ball from the edge of the table.',
          es: 'Lanzamiento horizontal de una canica y de una pelota de ping-pong desde el borde de la mesa.',
        },
      },
      {
        id: 'newton2', slug: 'segunda-ley', guide: 3, thumb: 'pulley', status: 'ready', source: mecanica,
        title: { en: 'Force and acceleration', es: 'Relación fuerza–aceleración' },
        summary: {
          en: 'A DigiCart on a levelled rail is pulled by a hanging canister: measure force and acceleration and test Newton’s second law.',
          es: 'Un DigiCart en una riel nivelada es jalado por un contenedor colgante: mide la fuerza y la aceleración y comprueba la segunda ley de Newton.',
        },
      },
      {
        id: 'friction', slug: 'rozamiento', guide: 4, thumb: 'block', status: 'ready', source: mecanica,
        title: { en: 'Friction force', es: 'Fuerza de rozamiento' },
        summary: {
          en: 'Static and kinetic friction: a block on paper pulled with spring scales and bars sliding down a raised rail.',
          es: 'Rozamiento estático y cinético: un taco sobre papel jalado con dinamómetros y barras que deslizan por un riel inclinado.',
        },
      },
      {
        id: 'parametric-resonance', slug: 'parametric-resonance', thumb: 'spring', status: 'ready',
        title: { en: 'Parametric resonance: the elastic pendulum', es: 'Resonancia paramétrica: el péndulo elástico' },
        summary: {
          en: 'A smartphone hangs from a spring: watch energy flow between stretching and swinging at the 2:1 resonance.',
          es: 'Un teléfono cuelga de un resorte: observa cómo la energía pasa del estiramiento al balanceo en la resonancia 2:1.',
        },
        source: {
          repo: 'parametricResonance', build: null, folder: 'simulator', mount: 'experiment',
          exclude: ['tests', 'dev', 'tools', 'README.md'],
        },
      },
      {
        id: 'pendulum-incline', slug: 'pendulum-incline', thumb: 'cart-pendulum', status: 'ready', source: mecanica,
        title: { en: 'Physical pendulum on an accelerating cart', es: 'Péndulo físico sobre un carrito acelerado' },
        summary: {
          en: 'A pendulum on a cart rolling down an incline, seen from the lab frame and from the cart.',
          es: 'Un péndulo sobre un carrito que baja por un plano inclinado, visto desde el laboratorio y desde el carrito.',
        },
      },
    ],
  },
  {
    id: 'atomic',
    slug: 'atomic',
    title: { en: 'Atomic Physics', es: 'Física Atómica' },
    summary: {
      en: 'Light and matter at the atomic scale: X-rays in crystals and the photoelectric effect.',
      es: 'Luz y materia a escala atómica: rayos X en cristales y efecto fotoeléctrico.',
    },
    experiments: [
      {
        id: 'x-ray', slug: 'x-ray', thumb: 'crystal', status: 'ready',
        title: { en: 'X-ray lab: Bragg diffraction and attenuation', es: 'Laboratorio de rayos X: difracción de Bragg y atenuación' },
        summary: {
          en: 'Bragg reflection of Mo Kα and Kβ X-rays at an NaCl crystal, on a simulated X-ray apparatus.',
          es: 'Reflexión de Bragg de rayos X Mo Kα y Kβ en un cristal de NaCl, con un equipo de rayos X simulado.',
        },
        source: { repo: 'AtomicSimulation', build: { cwd: 'web', command: 'npm run build', out: 'web/dist' }, mount: 'experiment' },
      },
      {
        id: 'photoelectric', slug: 'photoelectric', thumb: 'photocell', status: 'ready',
        title: { en: 'Photoelectric effect: Planck’s constant', es: 'Efecto fotoeléctrico: constante de Planck' },
        summary: {
          en: 'A mercury lamp, a prism and a photocell: find the limit voltage for each line and determine h.',
          es: 'Una lámpara de mercurio, un prisma y una fotocelda: halla el voltaje límite de cada línea y determina h.',
        },
        source: { repo: 'photoelectric-sim', build: { cwd: '.', command: 'npm run build', out: 'dist' }, mount: 'experiment' },
      },
    ],
  },
]

/** Experiments that are open now (the "soon" ones are not counted on the lab card). */
export const readyCount = (lab: Pick<Lab, 'experiments'>): number => lab.experiments.filter((x) => x.status === 'ready').length

export const GITHUB_OWNER = 'kairi99'
export const repoUrl = (repo: string): string => `https://github.com/${GITHUB_OWNER}/${repo}`
/** Source repositories used by the ready experiments, without duplicates. */
export const sourceRepos = (all: readonly Lab[] = labs): string[] =>
  [...new Set(all.flatMap((l) => l.experiments.flatMap((x) => (x.source ? [x.source.repo] : []))))]
