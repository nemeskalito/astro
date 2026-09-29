<script setup lang="ts">
import { ZODIAC, ZODIAC_SYMBOLS } from '~/types/astro'
const model = defineModel<number>({ required: true })
</script>

<template>
  <div class="zodiac-grid">
    <button
      v-for="(sign, i) in ZODIAC"
      :key="sign"
      type="button"
      :class="['cell', { active: i === model }]"
      @click="model = i"
      :title="sign"
    >
      <span class="symbol">{{ ZODIAC_SYMBOLS[sign] }}</span>
      <span class="name">{{ sign.slice(0, 3) }}</span>
    </button>
  </div>
</template>

<style scoped>
.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: var(--bg-cell);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-dim);
  padding: 7px 4px 5px;
  cursor: pointer;
  transition: all 0.18s ease;
  user-select: none;
  font-family: inherit;
}

.cell:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.cell.active {
  background: var(--accent-soft);
  border-color: var(--accent-strong);
  color: var(--accent);
}

.symbol { font-size: 17px; line-height: 1; }

.name {
  font-size: 9px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  opacity: 0.7;
}
</style>