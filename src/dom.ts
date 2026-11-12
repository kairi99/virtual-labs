// Tiny DOM helpers.
const SVG_NS = 'http://www.w3.org/2000/svg'

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string, attrs?: Record<string, string>): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text !== undefined) e.textContent = text
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
  return e
}

export function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, ...kids: (SVGElement | string)[]): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG_NS, tag)
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v))
  for (const k of kids) e.append(typeof k === 'string' ? document.createTextNode(k) : k)
  return e
}

export function button(text: string, cls: string): HTMLButtonElement { return el('button', cls, text, { type: 'button' }) }
