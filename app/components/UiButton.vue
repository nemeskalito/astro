<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost'
    size?: 'md' | 'lg'
    type?: 'button' | 'submit'
    /** Если задан — рендерится ссылкой (якорь или URL) */
    href?: string
  }>(),
  { variant: 'primary', size: 'md', type: 'button', href: undefined }
)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  border: 0;
  border-radius: 999px;
  font: 600 15px/1 var(--font);
  letter-spacing: 0.01em;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.btn--md { padding: 13px 22px; }
.btn--lg { padding: 18px 34px; font-size: 16px; }

/* Верхний блик — «стеклянная» половина кнопки */
.btn::before {
  content: '';
  position: absolute;
  inset: 1px 2px 48% 2px;
  z-index: -1;
  border-radius: 999px 999px 50% 50% / 100% 100% 30% 30%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.06));
  pointer-events: none;
}

/* Полоса блика, пробегающая по hover */
.btn::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -70%;
  z-index: -1;
  width: 40%;
  transform: skewX(-22deg);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transition: left 0.7s ease;
  pointer-events: none;
}

.btn:hover::after { left: 130%; }

.btn--primary {
  color: var(--btn-text);
  background: linear-gradient(180deg, var(--btn-top) 0%, var(--btn-bottom) 100%);
  text-shadow: 0 1px 1px rgba(30, 15, 110, 0.45);
  box-shadow:
    0 0 0 1px var(--btn-edge),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -3px 8px rgba(25, 10, 100, 0.4),
    0 12px 30px -8px var(--btn-shadow);
}

.btn--primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.07) saturate(1.05);
  box-shadow:
    0 0 0 1px var(--btn-edge),
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    inset 0 -3px 8px rgba(25, 10, 100, 0.4),
    0 18px 38px -8px var(--btn-shadow);
}

.btn--primary:active {
  transform: translateY(1px);
  filter: brightness(0.97);
  box-shadow:
    0 0 0 1px var(--btn-edge),
    inset 0 2px 6px rgba(25, 10, 100, 0.5),
    0 6px 16px -6px var(--btn-shadow);
}

.btn--ghost {
  color: var(--text);
  background: var(--glass);
  box-shadow:
    0 0 0 1px var(--glass-border),
    inset 0 1px 0 var(--glass-hi),
    0 8px 24px -14px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.btn--ghost::before { opacity: 0.35; }

.btn--ghost:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 1px var(--accent-strong),
    inset 0 1px 0 var(--glass-hi),
    0 12px 28px -12px var(--accent-glow);
}

.btn--ghost:active { transform: translateY(1px); }
</style>
