// Every user-facing text of the hub, as `{ en, es }` objects. Lab and experiment texts live in labs.ts.
import type { Text } from './labs.ts'

export const S = {
  siteName: { en: 'Virtual Physics Lab', es: 'Laboratorio Virtual de Física' },
  skip: { en: 'Skip to main content', es: 'Saltar al contenido principal' },
  chooserTitle: { en: 'Choose a laboratory', es: 'Elige un laboratorio' },
  chooserSub: {
    en: 'Interactive physics simulations that run in your browser, on a computer or a phone. Pick a laboratory, then an experiment.',
    es: 'Simulaciones interactivas de física que funcionan en el navegador, en computador o celular. Elige un laboratorio y luego un experimento.',
  },
  labsRegion: { en: 'Laboratories', es: 'Laboratorios' },
  experimentsRegion: { en: 'Experiments', es: 'Experimentos' },
  experimentCount: {
    one: { en: '{n} experiment', es: '{n} experimento' },
    many: { en: '{n} experiments', es: '{n} experimentos' },
  },
  enterLab: { en: 'Enter laboratory', es: 'Entrar al laboratorio' },
  enterLabAria: { en: 'Enter laboratory: {title}', es: 'Entrar al laboratorio: {title}' },
  open: { en: 'Open', es: 'Abrir' },
  openAria: { en: 'Open: {title}', es: 'Abrir: {title}' },
  soon: { en: 'Coming soon', es: 'Próximamente' },
  guide: { en: 'Practice {n}', es: 'Práctica {n}' },
  back: { en: 'All laboratories', es: 'Todos los laboratorios' },
  backAria: { en: 'Back to all laboratories', es: 'Volver a todos los laboratorios' },
  labSub: { en: 'Choose an experiment.', es: 'Elige un experimento.' },
  langSwitch: { en: 'Switch to Spanish', es: 'Cambiar a inglés' },
  theme: { en: 'Theme', es: 'Tema' },
  themes: {
    auto: { en: 'Automatic', es: 'Automático' },
    light: { en: 'Light', es: 'Claro' },
    dark: { en: 'Dark', es: 'Oscuro' },
  },
  noscript: { en: 'This site needs JavaScript to list the experiments. Direct links:', es: 'Este sitio necesita JavaScript para listar los experimentos. Enlaces directos:' },
  credits: {
    en: 'Free, open-source educational simulations, each developed in its own repository.',
    es: 'Simulaciones educativas gratuitas y de código abierto, cada una desarrollada en su propio repositorio.',
  },
  sources: { en: 'Source code', es: 'Código fuente' },
  sourcesAria: { en: 'Source repositories on GitHub', es: 'Repositorios de código fuente en GitHub' },
} satisfies Record<string, Text | Record<string, Text>>
