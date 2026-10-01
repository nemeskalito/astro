<script setup lang="ts" generic="T extends string | number">
const model = defineModel<T>({ required: true })
defineProps<{ ariaLabel?: string }>()
</script>

<template>
  <div class="ui-select">
    <select v-model="model" :aria-label="ariaLabel" class="control">
      <slot />
    </select>
    <svg class="chevron" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true">
      <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<style scoped>
.ui-select { position: relative; width: 100%; min-width: 0; }

.control {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  background: var(--field-bg);
  border: 1px solid var(--field-border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font: 500 15px/1.2 var(--font);
  padding: 13px 36px 13px 14px;
  cursor: pointer;
  outline: none;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.18);
  transition: border-color 0.15s, box-shadow 0.15s, background 0.3s;
}

.control:hover { border-color: var(--border-hover); }

.control:focus-visible {
  border-color: var(--accent-strong);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.18), 0 0 0 3px var(--accent-glow);
}

.control option { background: var(--bg-elev); color: var(--text); }

.chevron {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-faint);
  transition: color 0.15s;
}

.control:hover + .chevron { color: var(--text-dim); }
</style>
