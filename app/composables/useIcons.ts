import type { Planet, ZodiacSign } from '~/types/astro'

interface IconTheme {
  planets: Record<string, string>
  zodiac: Record<string, string>
  /** Одноцветные иконки: в тёмной теме становятся белыми */
  adaptive: boolean
  /** Множитель размера иконок группы (для тем с большими полями вокруг знака) */
  scale: Record<'planets' | 'zodiac', number>
}

interface ThemeConfig {
  adaptive?: boolean
  scale?: { planets?: number; zodiac?: number }
}

/** Тема, из которой берутся недостающие иконки (например, планеты у тем, где есть только знаки) */
const FALLBACK_THEME = 'default'
/** Тема, выбранная при первом заходе (пока в cookie ничего нет) */
const INITIAL_THEME = 'monkik'
const COOKIE = 'astro-icons'

// Темы подхватываются автоматически: assets/themes/<название>/{planets,zodiac}/<ключ>.<ext>
const files = import.meta.glob<string>('../assets/themes/*/*/*.{webp,png,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default'
})
const configs = import.meta.glob<ThemeConfig>('../assets/themes/*/theme.json', {
  eager: true,
  import: 'default'
})

const REGISTRY = new Map<string, IconTheme>()

function sanitizeScale(value: unknown): number {
  return typeof value === 'number' && value >= 0.5 && value <= 3 ? value : 1
}

function ensure(name: string): IconTheme {
  let theme = REGISTRY.get(name)
  if (!theme) {
    theme = { planets: {}, zodiac: {}, adaptive: false, scale: { planets: 1, zodiac: 1 } }
    REGISTRY.set(name, theme)
  }
  return theme
}

for (const [path, url] of Object.entries(files)) {
  const m = path.match(/themes\/([^/]+)\/(planets|zodiac)\/([^/]+)\.[a-z]+$/i)
  if (!m) continue
  const [, name, group, key] = m
  ensure(name!)[group as 'planets' | 'zodiac'][key!.toLowerCase()] = url
}

for (const [path, config] of Object.entries(configs)) {
  const name = path.match(/themes\/([^/]+)\/theme\.json$/)?.[1]
  if (!name || !REGISTRY.has(name)) continue
  const theme = ensure(name)
  theme.adaptive = config.adaptive === true
  theme.scale = { planets: sanitizeScale(config.scale?.planets), zodiac: sanitizeScale(config.scale?.zodiac) }
}

/** Все темы в алфавитном порядке; default выбирается по умолчанию, не по позиции в списке. */
const THEME_NAMES = [...REGISTRY.keys()].sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }))

export function useIcons() {
  const cookie = useCookie<string>(COOKIE, {
    default: () => INITIAL_THEME,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
  const stored = useState<string>('icon-theme', () =>
    REGISTRY.has(cookie.value) ? cookie.value : INITIAL_THEME
  )

  const themeName = computed(() => (REGISTRY.has(stored.value) ? stored.value : INITIAL_THEME))
  const theme = computed(() => REGISTRY.get(themeName.value))
  const fallback = REGISTRY.get(FALLBACK_THEME)

  function setTheme(name: string) {
    if (!REGISTRY.has(name)) return
    stored.value = name
    cookie.value = name
  }

  /** Иконка из активной темы, при отсутствии — из FALLBACK_THEME; настройки берутся у той темы, что дала файл */
  function iconData(group: 'planets' | 'zodiac', key: string) {
    const normalized = key.toLowerCase()
    const active = theme.value
    const activeUrl = active?.[group][normalized]
    if (active && activeUrl) {
      return { url: activeUrl, adaptive: active.adaptive, scale: active.scale[group] }
    }

    return {
      url: fallback?.[group][normalized] ?? '',
      adaptive: fallback?.adaptive === true,
      scale: fallback?.scale[group] ?? 1
    }
  }

  /** Inline-стиль для <img>: белая инверсия в тёмной теме и масштаб темы */
  function iconStyle(group: 'planets' | 'zodiac', key: string): Record<string, string> {
    const { adaptive, scale } = iconData(group, key)
    const style: Record<string, string> = {
      filter: adaptive ? 'var(--icon-adaptive-filter)' : 'none'
    }
    if (scale !== 1) style.transform = `scale(${scale})`
    return style
  }

  const planetIcon = (planet: Planet) => iconData('planets', planet).url
  const zodiacIcon = (sign: ZodiacSign) => iconData('zodiac', sign).url
  const planetIconAdaptive = (planet: Planet) => iconData('planets', planet).adaptive
  const zodiacIconAdaptive = (sign: ZodiacSign) => iconData('zodiac', sign).adaptive
  const planetIconStyle = (planet: Planet) => iconStyle('planets', planet)
  const zodiacIconStyle = (sign: ZodiacSign) => iconStyle('zodiac', sign)

  const isAdaptive = (name: string) => REGISTRY.get(name)?.adaptive ?? false
  const previewIcon = (name: string) =>
    REGISTRY.get(name)?.planets.sun ?? fallback?.planets.sun ?? ''

  return {
    themeNames: THEME_NAMES,
    themeName,
    adaptive: computed(() => isAdaptive(themeName.value)),
    setTheme,
    planetIcon,
    zodiacIcon,
    planetIconAdaptive,
    zodiacIconAdaptive,
    planetIconStyle,
    zodiacIconStyle,
    isAdaptive,
    previewIcon
  }
}
