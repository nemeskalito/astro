import type { Planet, ZodiacSign } from '~/types/astro'

interface IconTheme {
  planets: Record<string, string>
  zodiac: Record<string, string>
  /** Одноцветные чёрные иконки: в тёмной теме инвертируются */
  adaptive: boolean
}

const DEFAULT_THEME = 'default'
const COOKIE = 'astro-icons'

// Темы подхватываются автоматически: assets/themes/<название>/{planets,zodiac}/<ключ>.<ext>
const files = import.meta.glob<string>('../assets/themes/*/*/*.{webp,png,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default'
})
const configs = import.meta.glob<{ adaptive?: boolean }>('../assets/themes/*/theme.json', {
  eager: true,
  import: 'default'
})

const REGISTRY = new Map<string, IconTheme>()

function ensure(name: string): IconTheme {
  let theme = REGISTRY.get(name)
  if (!theme) {
    theme = { planets: {}, zodiac: {}, adaptive: false }
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
  if (name && REGISTRY.has(name)) ensure(name).adaptive = config.adaptive === true
}

/** default — всегда первым, остальные по алфавиту */
const THEME_NAMES = [...REGISTRY.keys()].sort((a, b) =>
  a === DEFAULT_THEME ? -1 : b === DEFAULT_THEME ? 1 : a.localeCompare(b)
)

export function useIcons() {
  const cookie = useCookie<string>(COOKIE, {
    default: () => DEFAULT_THEME,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
  const stored = useState<string>('icon-theme', () => cookie.value)

  const themeName = computed(() => (REGISTRY.has(stored.value) ? stored.value : DEFAULT_THEME))
  const theme = computed(() => REGISTRY.get(themeName.value))
  const fallback = REGISTRY.get(DEFAULT_THEME)

  function setTheme(name: string) {
    if (!REGISTRY.has(name)) return
    stored.value = name
    cookie.value = name
  }

  /** Иконка из активной темы, при отсутствии — из default */
  function iconData(group: 'planets' | 'zodiac', key: string) {
    const normalized = key.toLowerCase()
    const active = theme.value
    const activeUrl = active?.[group][normalized]
    if (activeUrl) return { url: activeUrl, adaptive: active?.adaptive === true }

    const fallbackUrl = fallback?.[group][normalized] ?? ''
    return { url: fallbackUrl, adaptive: fallback?.adaptive === true }
  }

  const planetIcon = (planet: Planet) => iconData('planets', planet).url
  const zodiacIcon = (sign: ZodiacSign) => iconData('zodiac', sign).url
  const planetIconAdaptive = (planet: Planet) => iconData('planets', planet).adaptive
  const zodiacIconAdaptive = (sign: ZodiacSign) => iconData('zodiac', sign).adaptive

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
    isAdaptive,
    previewIcon
  }
}
