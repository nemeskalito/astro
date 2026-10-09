<script setup lang="ts">
const { theme, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
    @click="toggle"
  >
    <svg
      v-if="theme === 'dark'"
      viewBox="0 0 24 24" width="18" height="18"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24" width="18" height="18"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: relative;
  isolation: isolate;
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--ghost-bg);
  border: 0;
  border-radius: 50%;
  color: var(--text-dim);
  cursor: pointer;
  box-shadow: 0 0 0 1px var(--ghost-border);
  transition: color 0.2s, box-shadow 0.2s, transform 0.15s;
}

/* Верхний блик, как у основной кнопки */
.theme-toggle::before {
  content: '';
  position: absolute;
  inset: 1px 3px 50% 3px;
  z-index: -1;
  border-radius: 999px 999px 50% 50% / 100% 100% 30% 30%;
  background: transparent;
  pointer-events: none;
}

.theme-toggle:hover {
  color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-strong), inset 0 1px 0 var(--glass-hi), 0 10px 22px -10px var(--btn-glow);
}

.theme-toggle:active { transform: scale(0.94); }
</style>
