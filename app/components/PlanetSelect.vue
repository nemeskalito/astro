<script setup lang="ts">
import { PLANETS, PLANET_SYMBOLS } from '~/types/astro'
const model = defineModel<number>({ required: true })
</script>

<template>
  <div class="planet-grid">
    <button
      v-for="(planet, i) in PLANETS"
      :key="planet"
      type="button"
      :class="['cell', { active: i === model }]"
      @click="model = i"
    >
      <span class="symbol">{{ PLANET_SYMBOLS[planet] }}</span>
      <span class="name">{{ planet }}</span>
    </button>
  </div>
</template>

<style scoped>
.planet-grid {
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
  padding: 8px 4px 6px;
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

.symbol { font-size: 18px; line-height: 1; }

.name {
  font-size: 10px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  opacity: 0.75;
}
</style>