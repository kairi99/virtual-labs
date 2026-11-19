// Card drawings, our own and tiny: inline SVG painted with the theme tokens, so they follow light and dark.
import { svg } from './dom.ts'
import type { ThumbKind } from './labs.ts'

const W = 320, H = 120

function inclineDrawing(): SVGElement[] {
  const x0 = 40, y0 = 48, x1 = 280, y1 = 86
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI
  const cx = 150, cy = y0 + ((cx - x0) / (x1 - x0)) * (y1 - y0)
  const marks: SVGElement[] = []
  for (let i = 0; i <= 7; i++) {
    const x = x0 + 20 + i * 27, y = y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)
    marks.push(svg('line', { x1: x, y1: y + 5, x2: x, y2: y + 10, class: 'th-line' }))
  }
  return [
    svg('line', { x1: 0, y1: 104, x2: W, y2: 104, class: 'th-ground' }),
    svg('rect', { x: x0 - 4, y: y0 + 4, width: 5, height: 100 - y0, class: 'th-leg' }),
    svg('rect', { x: x0 - 22, y: 100, width: 44, height: 4, rx: 2, class: 'th-leg' }),
    svg('rect', { x: x1 - 4, y: y1 + 4, width: 5, height: 100 - y1 - 4, class: 'th-leg' }),
    svg('rect', { x: x1 - 18, y: 100, width: 32, height: 4, rx: 2, class: 'th-leg' }),
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
    svg('rect', { x: x1 - 17, y: ty + 4, width: 5, height: fy - ty - 4, class: 'th-leg' }),
    svg('rect', { x: x1 - 32, y: fy - 4, width: 34, height: 4, rx: 2, class: 'th-leg' }),
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
  // a support bar, a short coil spring hanging from it, a phone at the end, a ghost phone and one dotted arc for the swing
  const cx = 160, top = 14, y0 = top + 8, y1 = 54, n = 7
  const pts: string[] = [`${cx},${top}`, `${cx},${y0}`]
  for (let i = 0; i < n; i++) {
    const y = y0 + ((i + 0.5) / n) * (y1 - y0)
    pts.push(`${cx + (i % 2 === 0 ? 12 : -12)},${y.toFixed(1)}`)
  }
  pts.push(`${cx},${y1}`)
  const R = 88, a = (42 * Math.PI) / 180
  const ax = R * Math.sin(a), ay = top + R * Math.cos(a)
  return [
    svg('rect', { x: cx - 46, y: top - 6, width: 92, height: 6, rx: 2, class: 'th-leg' }),
    svg('path', { d: `M ${cx - ax} ${ay} A ${R} ${R} 0 0 0 ${cx + ax} ${ay}`, class: 'th-dots', fill: 'none' }),
    svg('rect', { x: cx - 13, y: y1, width: 26, height: 36, rx: 5, class: 'th-ghost', transform: `rotate(-38 ${cx} ${top})` }),
    svg('polyline', { points: pts.join(' '), class: 'th-spring', fill: 'none' }),
    svg('rect', { x: cx - 13, y: y1, width: 26, height: 36, rx: 5, class: 'th-body' }),
    svg('rect', { x: cx - 13, y: y1, width: 26, height: 7, rx: 3, class: 'th-accent' }),
    svg('line', { x1: cx - 5, y1: y1 + 28, x2: cx + 5, y2: y1 + 28, class: 'th-line' }),
  ]
}

function cartPendulumDrawing(): SVGElement[] {
  // an inclined plane, a cart on it carrying a small gantry (two columns and a beam) and a pendulum hanging from the
  // middle of the beam: vertical in the lab frame plus a swing, so it is visibly tilted away from the frame's axis
  const x0 = 30, y0 = 40, x1 = 290, y1 = 104
  const angR = Math.atan2(y1 - y0, x1 - x0), ang = (angR * 180) / Math.PI
  const cx = 150, cy = y0 + ((cx - x0) / (x1 - x0)) * (y1 - y0)
  const pivY = -53, len = 27, tilt = (20 * Math.PI) / 180 // in cart coordinates: 20 degrees from the frame's downward axis, toward the uphill side
  const bobX = -len * Math.sin(tilt), bobY = pivY + len * Math.cos(tilt)
  return [
    svg('line', { x1: 0, y1: 108, x2: W, y2: 108, class: 'th-ground' }),
    svg('polygon', { points: `${x0},${y0} ${x1},${y1} ${x0},${y1}`, class: 'th-wedge' }),
    svg('line', { x1: x0, y1: y0, x2: x1, y2: y1, class: 'th-rail' }),
    svg('g', { transform: `translate(${cx} ${cy}) rotate(${ang})` },
      svg('rect', { x: -26, y: -20, width: 52, height: 14, rx: 4, class: 'th-body' }),
      svg('circle', { cx: -15, cy: -6, r: 4.5, class: 'th-wheel' }),
      svg('circle', { cx: 15, cy: -6, r: 4.5, class: 'th-wheel' }),
      svg('rect', { x: -21, y: -56, width: 3, height: 36, class: 'th-leg' }),
      svg('rect', { x: 18, y: -56, width: 3, height: 36, class: 'th-leg' }),
      svg('rect', { x: -21, y: -56, width: 42, height: 3, rx: 1.5, class: 'th-leg' }),
      svg('line', { x1: 0, y1: pivY, x2: bobX, y2: bobY, class: 'th-line' }),
      svg('circle', { cx: 0, cy: pivY, r: 2, class: 'th-wheel' }),
      svg('circle', { cx: bobX, cy: bobY, r: 5, class: 'th-accent' })),
  ]
}

function crystalDrawing(): SVGElement[] {
  // a crystal block with a square lattice; the incident and the reflected ray make equal angles with the top plane
  // and meet on an atom of the top row
  const ax0 = 112, dx = 24, rowY = [64, 80, 96]
  const atoms: SVGElement[] = []
  rowY.forEach((y, r) => { for (let c = 0; c < 5; c++) atoms.push(svg('circle', { cx: ax0 + c * dx, cy: y, r: 4.5, class: r === 0 ? 'th-accent' : 'th-wheel' })) })
  const px = ax0 + 2 * dx, py = rowY[0]!, th = (28 * Math.PI) / 180, run = 66, cos = Math.cos(th), sin = Math.sin(th)
  const stop = 7 // the rays end at the atom's edge
  return [
    svg('rect', { x: 90, y: 48, width: 140, height: 64, rx: 6, class: 'th-body', fill: 'none' }),
    svg('line', { x1: 98, y1: py, x2: 222, y2: py, class: 'th-line', 'stroke-dasharray': '2 4' }),
    ...atoms,
    svg('line', { x1: px - run, y1: py - run * Math.tan(th), x2: px - stop * cos, y2: py - stop * sin, class: 'th-beam' }),
    svg('line', { x1: px + stop * cos, y1: py - stop * sin, x2: px + run, y2: py - run * Math.tan(th), class: 'th-beam th-beam-out' }),
  ]
}

function photocellDrawing(): SVGElement[] {
  // light arriving from the left onto the cathode plate of a glass bulb, a ring anode, and the external circuit
  // leaving the bulb at two points and passing below it, with a small meter
  const o = 20, bx = 180 + o, by = 46, cathX = 158 + o, anX = 198 + o, wy = 102
  const ray = (y: number) => [
    svg('line', { x1: 14 + o, y1: y, x2: cathX - 12, y2: y, class: 'th-beam' }),
    svg('polygon', { points: `${cathX - 4},${y} ${cathX - 13},${y - 4} ${cathX - 13},${y + 4}`, class: 'th-accent' }),
  ]
  return [
    svg('circle', { cx: bx, cy: by, r: 38, class: 'th-body' }),
    ...[30, 46, 62].flatMap(ray),
    svg('rect', { x: cathX, y: 28, width: 6, height: 36, rx: 3, class: 'th-accent' }),
    svg('ellipse', { cx: anX, cy: by, rx: 5, ry: 14, class: 'th-ring' }),
    svg('circle', { cx: cathX + 11, cy: 40, r: 2.5, class: 'th-dot' }),
    svg('circle', { cx: cathX + 18, cy: 46, r: 2.5, class: 'th-dot' }),
    svg('circle', { cx: cathX + 25, cy: 52, r: 2.5, class: 'th-dot' }),
    svg('polyline', { points: `${cathX + 3},64 ${cathX + 3},${wy} ${bx - 8},${wy}`, class: 'th-line', fill: 'none' }),
    svg('polyline', { points: `${bx + 8},${wy} ${anX},${wy} ${anX},${by + 14}`, class: 'th-line', fill: 'none' }),
    svg('circle', { cx: bx, cy: wy, r: 8, class: 'th-body' }),
    svg('line', { x1: bx, y1: wy + 4, x2: bx + 4, y2: wy - 3, class: 'th-needle', 'stroke-width': 1.8 }),
  ]
}

function interferometerDrawing(): SVGElement[] {
  // a Michelson interferometer seen from above: laser on the left, beam splitter (diamond) at the corner of the L, a mirror
  // at the end of each arm, a photodetector below the splitter and a small wave travelling under the long arm
  const sx = 110, sy = 70, r = 9, mx = 262, my = 16
  const wave: string[] = []
  for (let x = 164; x <= 284; x += 4) wave.push(`${x},${(102 + 5 * Math.sin(((x - 164) / 40) * 2 * Math.PI)).toFixed(1)}`)
  return [
    svg('rect', { x: 14, y: sy - 9, width: 32, height: 18, rx: 4, class: 'th-body' }),
    svg('rect', { x: 14, y: sy - 9, width: 8, height: 18, rx: 3, class: 'th-accent' }),
    svg('line', { x1: 46, y1: sy, x2: sx - r, y2: sy, class: 'th-beam' }),
    svg('line', { x1: sx + r, y1: sy, x2: mx - 3, y2: sy, class: 'th-beam' }),
    svg('line', { x1: sx, y1: sy - r, x2: sx, y2: my + 5, class: 'th-beam' }),
    svg('rect', { x: mx, y: sy - 11, width: 5, height: 22, rx: 2, class: 'th-wheel' }),
    svg('rect', { x: sx - 11, y: my - 5, width: 22, height: 5, rx: 2, class: 'th-wheel' }),
    svg('polygon', { points: `${sx},${sy - r} ${sx + r},${sy} ${sx},${sy + r} ${sx - r},${sy}`, class: 'th-body' }),
    svg('line', { x1: sx, y1: sy + r, x2: sx, y2: 96, class: 'th-line' }),
    svg('circle', { cx: sx, cy: 104, r: 8, class: 'th-body' }),
    svg('circle', { cx: sx, cy: 104, r: 3, class: 'th-dot' }),
    svg('polyline', { points: wave.join(' '), class: 'th-spring', fill: 'none' }),
  ]
}

const DRAW: Record<ThumbKind, () => SVGElement[]> = {
  incline: inclineDrawing, arc: arcDrawing, pulley: pulleyDrawing, block: blockDrawing,
  spring: springDrawing, 'cart-pendulum': cartPendulumDrawing, crystal: crystalDrawing, photocell: photocellDrawing, interferometer: interferometerDrawing,
}

export function thumb(kind: ThumbKind): SVGElement {
  const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'hub-thumb', 'aria-hidden': 'true', focusable: 'false' })
  s.append(svg('rect', { width: W, height: H, class: 'th-bg' }), ...DRAW[kind]())
  return s
}
