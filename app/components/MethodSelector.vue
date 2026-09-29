<script setup lang="ts">
import type { Method } from '~/types/astro'
const model = defineModel<Method>({ required: true })
</script>

<template>
  <div class="segment">
    <button
      type="button"
      :class="['seg', { active: model === 'direct' }]"
      @click="model = 'direct'"
    >Прямой</button>
    <button
      type="button"
      :class="['seg', { active: model === 'reverse' }]"
      @click="model = 'reverse'"
    >Обратный</button>
  </div>
</template>

<style scoped>
.segment {
  display: inline-flex;
  background: var(--bg-cell);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 3px;
  gap: 2px;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.seg {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-dim);
  font-size: 12px;
  font-family: inherit;
  padding: 6px 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.seg:hover { color: var(--text); }

.seg.active {
  background: var(--bg-elev);
  border-color: var(--accent-strong);
  color: var(--accent);
}
</style>