<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost'
    size?: 'md' | 'lg'
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' }
)
</script>

<template>
  <button class="btn" :class="[`btn--${variant}`, `btn--${size}`]" :type="type">
    <slot />
  </button>
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
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.btn--md { padding: 13px 22px; }
.btn--lg { padding: 17px 32px; font-size: 16px; }

/* Верхний блик */
.btn::before {
  content: '';
  position: absolute;
  inset: 1px 2px 48% 2px;
  z-index: -1;
  border-radius: 999px 999px 50% 50% / 100% 100% 30% 30%;
  background: linear-gradient(180deg, var(--btn-gloss), rgba(255, 255, 255, 0.04));
  pointer-events: none;
}

/* Полоса блика по hover */
.btn::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -70%;
  z-index: -1;
  width: 40%;
  transform: skewX(-22deg);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  transition: left 0.7s ease;
  pointer-events: none;
}

.btn:hover::after { left: 130%; }

/* ---------- Primary ---------- */
.btn--primary {
  color: var(--btn-text);
  text-shadow: var(--btn-text-shadow);
  background: var(--btn-primary-bg);
  box-shadow:
    0 0 0 1px var(--btn-edge),
    inset 0 1px 0 var(--btn-rim),
    inset 0 -2px 6px var(--btn-depth),
    0 10px 24px -12px var(--btn-glow);
 
}

.btn--primary:hover {
  transform: translateY(-2px);
  filter: brightness(var(--btn-hover)) saturate(1.05);
}

.btn--primary:active {
  transform: translateY(1px);
  filter: brightness(0.97);
  box-shadow:
    0 0 0 1px var(--btn-edge),
    inset 0 2px 6px var(--btn-depth),
    0 6px 14px -6px var(--btn-glow);
}

/* ---------- Ghost ---------- */
.btn--ghost {
  color: var(--text);
  background: var(--btn-ghost-bg);
}

.btn--ghost::before { opacity: 0.3; }
.btn--ghost { box-shadow: 0 0 0 1px var(--ghost-border), inset 0 1px 0 var(--glass-hi), var(--ghost-shadow); }

.btn--ghost:hover {
  transform: translateY(-2px);
}

.btn--ghost:active { transform: translateY(1px); }
</style>
