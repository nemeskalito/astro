export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'astro-theme'

export function useTheme() {
  // useState — SSR-safe, работает и на сервере, и на клиенте
  const theme = useState<Theme>('theme', () => 'dark')

  /** Применить тему к <html> */
  function apply(t: Theme) {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem(STORAGE_KEY, t)
    }
  }

  function setTheme(t: Theme) {
    theme.value = t
    apply(t)
  }

  function toggle() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  /** Инициализация на клиенте (после гидратации) */
  function init() {
    if (!import.meta.client) return
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved === 'dark' || saved === 'light') {
      theme.value = saved
      apply(saved)
    } else {
      // По умолчанию — тёмная, но уважаем системную
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
      setTheme(prefersLight ? 'light' : 'dark')
    }
  }

  return { theme, setTheme, toggle, init }
}