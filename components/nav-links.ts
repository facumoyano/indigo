export const NAV_LINKS = [
  { href: '/#alineadores', label: 'Alineadores' },
  { href: '/#hacemos', label: 'Hacemos' },
  { href: '/#nosotras', label: 'Nosotras' },
  { href: '/contactar', label: 'Contactar' },
  { href: '/ya-soy-usuario-indigo', label: 'Ya soy usuario Indigo' },
] as const

export type NavLink = (typeof NAV_LINKS)[number]
