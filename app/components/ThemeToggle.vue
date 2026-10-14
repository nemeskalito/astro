<script setup lang="ts">
const { theme, toggle } = useTheme()

// Иконки лежат в public/buttons/theme/. В тёмной теме показываем солнце («включить светлую»), в светлой — луну.
const icon = computed(() =>
  theme.value === 'dark' ? '/buttons/theme/sun.webp' : '/buttons/theme/moon.webp'
)
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
    @click="toggle"
  >
    <Transition name="icon" mode="out-in">
      <img :key="theme" :src="icon" alt="" width="30" height="30" class="icon" />
    </Transition>
  </button>
</template>

<style scoped>
/* Тот же «звёздный» фон и бортики, что у подложки переключателя метода (MethodSelector .thumb) */
.theme-toggle {
  position: relative;
  isolation: isolate;
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  background-image: var(--btn-bg-image);
  background-size: cover;
  background-position: center;
  box-shadow:
    0 0 0 1px var(--btn-edge),
    inset 0 1px 0 var(--btn-rim),
    inset 0 -2px 6px var(--btn-depth),
    0 6px 14px -6px var(--btn-glow);
  transition: transform 0.15s ease, filter 0.25s ease;
}

.theme-toggle::before {
  content: '';
  position: absolute;
  inset: 1px 3px 50% 3px;
  z-index: -1;
  border-radius: 999px 999px 50% 50% / 100% 100% 30% 30%;
  background: linear-gradient(180deg, var(--btn-gloss), rgba(255, 255, 255, 0.04));
  pointer-events: none;
}

/* Иконки чёрные: в тёмной теме инвертируются в белые, в светлой остаются чёрными */
.icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  filter: var(--icon-adaptive-filter);
  pointer-events: none;
}

.theme-toggle:hover { filter: brightness(var(--btn-hover)); }
.theme-toggle:active { transform: scale(0.94); }

.icon-enter-active, .icon-leave-active { transition: opacity 0.18s ease, transform 0.25s ease; }
.icon-enter-from { opacity: 0; transform: rotate(-70deg) scale(0.6); }
.icon-leave-to { opacity: 0; transform: rotate(70deg) scale(0.6); }
</style>
