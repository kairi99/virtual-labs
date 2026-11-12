// Card drawings, our own and tiny: inline SVG painted with the theme tokens, so they follow light and dark.
import { svg } from './dom.ts'
import type { ThumbKind } from './labs.ts'

const W = 320, H = 120

function inclineDrawing(): SVGElement[] {
  const x0 = 40, y0 = 48, x1 = 280, y1 = 86
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI
  const cx = 150, cy = y0 + ((cx - x0) / (x1 - x0)) * (y1 - y0)
  const marks: SVGElement[] = []
  for (let i = 0; i <= 8; i++) {
    const x = x0 + 20 + i * 27, y = y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)
    marks.push(svg('line', { x1: x, y1: y + 5, x2: x, y2: y + 10, class: 'th-line' }))
  }
  return [
    svg('line', { x1: 0, y1: 104, x2: W, y2: 104, class: 'th-ground' }),
    svg('rect', { x: x0 - 4, y: y0 + 4, width: 5, height: 100 - y0, class: 'th-leg' }),
    svg('rect', { x: x0 - 22, y: 100, width: 44, height: 4, rx: 2, class: 'th-leg' }),
    svg('line', { x1: x0, y1: y0, x2: x1, y2: y1, class: 'th-rail' }),
    ...marks,
    svg('g', { transform: `translate(${cx} ${cy}) rotate(${ang})` },
      svg('rect', { x: -22, y: -17, width: 44, height: 13, rx: 4, class: 'th-body' }),
      svg('rect', { x: -22, y: -17, width: 8, height: 13, rx: 3, class: 'th-accent' }),
      svg('circle', { cx: -13, cy: -4, r: 4, class: 'th-wheel' }),
      svg('circle', { cx: 13, cy: -4, r: 4, class: 'th-wheel' })),
  ]
}

function arcDrawing(): SVGElement[] {
  const ex = 108, ty = 44, fy = 104
  const pts: string[] = []
  const x1 = 262, g = (fy - 8 - ty) / ((x1 - ex) * (x1 - ex))
  for (let x = ex; x <= x1; x += 6) pts.push(`${x},${(ty - 6 + g * (x - ex) * (x - ex)).toFixed(1)}`)
  return [
    svg('line', { x1: 0, y1: fy, x2: W, y2: fy, class: 'th-ground' }),
    svg('rect', { x: 12, y: ty, width: ex - 12, height: 6, rx: 2, class: 'th-leg' }),
    svg('rect', { x: ex - 16, y: ty + 6, width: 5, height: fy - ty - 6, class: 'th-leg' }),
    svg('line', { x1: 20, y1: ty - 22, x2: ex, y2: ty - 6, class: 'th-rail' }),
    svg('polyline', { points: pts.join(' '), class: 'th-dots', fill: 'none' }),
    svg('rect', { x: x1 - 26, y: fy - 3, width: 52, height: 3, class: 'th-paper' }),
    svg('circle', { cx: ex, cy: ty - 10, r: 5, class: 'th-accent' }),
    svg('circle', { cx: x1, cy: fy - 5, r: 3, class: 'th-accent' }),
  ]
}

function pulleyDrawing(): SVGElement[] {
  const ty = 46, x0 = 30, x1 = 232, fy = 108
  return [
    svg('line', { x1: 0, y1: fy, x2: W, y2: fy, class: 'th-ground' }),
    svg('rect', { x: x0 - 3, y: ty + 4, width: 5, height: fy - ty - 4, class: 'th-leg' }),
    svg('rect', { x: x0 - 20, y: fy - 4, width: 40, height: 4, rx: 2, class: 'th-leg' }),
    svg('line', { x1: x0, y1: ty, x2: x1, y2: ty, class: 'th-rail' }),
    svg('rect', { x: 92, y: ty - 18, width: 44, height: 13, rx: 4, class: 'th-body' }),
    svg('rect', { x: 128, y: ty - 18, width: 8, height: 13, rx: 3, class: 'th-accent' }),
    svg('circle', { cx: 104, cy: ty - 5, r: 4, class: 'th-wheel' }),
    svg('circle', { cx: 124, cy: ty - 5, r: 4, class: 'th-wheel' }),
    svg('circle', { cx: x1 + 6, cy: ty - 6, r: 9, class: 'th-body' }),
    svg('line', { x1: 136, y1: ty - 12, x2: x1 + 6, y2: ty - 15, class: 'th-line' }),
    svg('line', { x1: x1 + 15, y1: ty - 6, x2: x1 + 15, y2: 84, class: 'th-line' }),
    svg('rect', { x: x1 + 7, y: 84, width: 16, height: 18, rx: 3, class: 'th-accent' }),
  ]
}

function blockDrawing(): SVGElement[] {
  const gy = 84
  return [
    svg('line', { x1: 0, y1: gy, x2: W, y2: gy, class: 'th-ground' }),
    svg('rect', { x: 44, y: gy - 30, width: 62, height: 30, rx: 4, class: 'th-body' }),
    svg('rect', { x: 44, y: gy - 6, width: 62, height: 6, rx: 2, class: 'th-paper' }),
    svg('line', { x1: 106, y1: gy - 15, x2: 150, y2: gy - 15, class: 'th-line' }),
    svg('rect', { x: 150, y: gy - 24, width: 92, height: 18, rx: 9, class: 'th-body' }),
    svg('line', { x1: 168, y1: gy - 24, x2: 168, y2: gy - 6, class: 'th-line' }),
    svg('line', { x1: 188, y1: gy - 24, x2: 188, y2: gy - 6, class: 'th-line' }),
    svg('line', { x1: 208, y1: gy - 24, x2: 208, y2: gy - 6, class: 'th-line' }),
    svg('line', { x1: 196, y1: gy - 28, x2: 196, y2: gy - 2, class: 'th-needle' }),
    svg('circle', { cx: 256, cy: gy - 15, r: 8, class: 'th-ring' }),
    svg('line', { x1: 244, y1: gy - 15, x2: 248, y2: gy - 15, class: 'th-line' }),
  ]
}

function springDrawing(): SVGElement[] {
  // a support bar, a coil spring hanging from it, a phone at the end and a dotted arc for its swing
  const cx = 160, top = 14
  const pts: string[] = [`${cx},${top}`, `${cx},${top + 8}`]
  const n = 9, y0 = top + 8, y1 = 70
  for (let i = 0; i < n; i++) {
    const y = y0 + ((i + 0.5) / n) * (y1 - y0)
    pts.push(`${cx + (i % 2 === 0 ? 12 : -12)},${y.toFixed(1)}`)
  }
  pts.push(`${cx},${y1}`)
  return [
    svg('rect', { x: cx - 46, y: top - 6, width: 92, height: 6, rx: 2, class: 'th-leg' }),
    svg('polyline', { points: pts.join(' '), class: 'th-spring', fill: 'none' }),
    svg('path', { d: `M ${cx - 60} 100 A 70 70 0 0 0 ${cx + 60} 100`, class: 'th-dots', fill: 'none' }),
    svg('rect', { x: cx - 13, y: y1, width: 26, height: 42, rx: 5, class: 'th-body' }),
    svg('rect', { x: cx - 13, y: y1, width: 26, height: 7, rx: 3, class: 'th-accent' }),
    svg('line', { x1: cx - 5, y1: y1 + 34, x2: cx + 5, y2: y1 + 34, class: 'th-line' }),
  ]
}

function cartPendulumDrawing(): SVGElement[] {
  // an inclined plane, a cart on it with a small bracket on top, and a short rod hanging DOWN from the bracket
  // (vertical-ish in the lab frame, so visibly tilted away from the track normal)
  const x0 = 30, y0 = 40, x1 = 290, y1 = 104
  const angR = Math.atan2(y1 - y0, x1 - x0), ang = (angR * 180) / Math.PI
  const cx = 150, cy = y0 + ((cx - x0) / (x1 - x0)) * (y1 - y0)
  // pivot at the top of the bracket, in cart coordinates (x along the track, y -up the normal), then to the lab frame
  const px = 4, py = -56
  const pivX = cx + px * Math.cos(angR) - py * Math.sin(angR)
  const pivY = cy + px * Math.sin(angR) + py * Math.cos(angR)
  const swing = (8 * Math.PI) / 180, len = 24
  const bobX = pivX - len * Math.sin(swing), bobY = pivY + len * Math.cos(swing)
  return [
    svg('line', { x1: 0, y1: 108, x2: W, y2: 108, class: 'th-ground' }),
    svg('polygon', { points: `${x0},${y0} ${x1},${y1} ${x0},${y1}`, class: 'th-wedge' }),
    svg('line', { x1: x0, y1: y0, x2: x1, y2: y1, class: 'th-rail' }),
    svg('g', { transform: `translate(${cx} ${cy}) rotate(${ang})` },
      svg('rect', { x: -26, y: -20, width: 52, height: 14, rx: 4, class: 'th-body' }),
      svg('circle', { cx: -15, cy: -6, r: 4.5, class: 'th-wheel' }),
      svg('circle', { cx: 15, cy: -6, r: 4.5, class: 'th-wheel' }),
      // bracket: a post up from the cart and a short arm over it
      svg('rect', { x: -4, y: -56, width: 3, height: 36, class: 'th-leg' }),
      svg('rect', { x: -4, y: -58, width: 16, height: 3, rx: 1.5, class: 'th-leg' })),
    svg('line', { x1: pivX, y1: pivY, x2: bobX, y2: bobY, class: 'th-line' }),
    svg('circle', { cx: bobX, cy: bobY, r: 5, class: 'th-accent' }),
  ]
}

function crystalDrawing(): SVGElement[] {
  // a square lattice of atoms, an incoming beam and a reflected beam at the same angle
  const atoms: SVGElement[] = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) atoms.push(svg('circle', { cx: 150 + c * 26, cy: 58 + r * 20, r: 4.5, class: r === 0 ? 'th-accent' : 'th-wheel' }))
  return [
    svg('rect', { x: 134, y: 48, width: 150, height: 62, rx: 6, class: 'th-body', fill: 'none' }),
    ...atoms,
    svg('line', { x1: 16, y1: 4, x2: 168, y2: 58, class: 'th-beam' }),
    svg('line', { x1: 168, y1: 58, x2: 304, y2: 8, class: 'th-beam th-beam-out' }),
    svg('path', { d: 'M 132 52 A 38 38 0 0 1 140 68', class: 'th-line', fill: 'none' }),
  ]
}

function photocellDrawing(): SVGElement[] {
  // a glass bulb with a cathode plate and an anode ring, light arriving from the left, a wire out to the right
  return [
    svg('line', { x1: 0, y1: 108, x2: W, y2: 108, class: 'th-ground' }),
    svg('line', { x1: 20, y1: 26, x2: 112, y2: 52, class: 'th-beam' }),
    svg('line', { x1: 20, y1: 48, x2: 112, y2: 60, class: 'th-beam' }),
    svg('line', { x1: 20, y1: 70, x2: 112, y2: 68, class: 'th-beam' }),
    svg('circle', { cx: 190, cy: 60, r: 46, class: 'th-body' }),
    svg('rect', { x: 150, y: 36, width: 7, height: 48, rx: 3, class: 'th-accent' }),
    svg('ellipse', { cx: 216, cy: 60, rx: 6, ry: 18, class: 'th-ring' }),
    svg('line', { x1: 153, y1: 84, x2: 153, y2: 100, class: 'th-line' }),
    svg('line', { x1: 153, y1: 100, x2: 296, y2: 100, class: 'th-line' }),
    svg('line', { x1: 222, y1: 60, x2: 296, y2: 60, class: 'th-line' }),
    svg('line', { x1: 296, y1: 60, x2: 296, y2: 100, class: 'th-line' }),
    svg('circle', { cx: 164, cy: 56, r: 3, class: 'th-dot' }),
    svg('circle', { cx: 184, cy: 50, r: 3, class: 'th-dot' }),
    svg('circle', { cx: 200, cy: 58, r: 3, class: 'th-dot' }),
  ]
}

const DRAW: Record<ThumbKind, () => SVGElement[]> = {
  incline: inclineDrawing, arc: arcDrawing, pulley: pulleyDrawing, block: blockDrawing,
  spring: springDrawing, 'cart-pendulum': cartPendulumDrawing, crystal: crystalDrawing, photocell: photocellDrawing,
}

export function thumb(kind: ThumbKind): SVGElement {
  const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'hub-thumb', 'aria-hidden': 'true', focusable: 'false' })
  s.append(svg('rect', { width: W, height: H, class: 'th-bg' }), ...DRAW[kind]())
  return s
}
