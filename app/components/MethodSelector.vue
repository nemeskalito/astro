<script setup lang="ts">
import type { Method } from '~/types/astro'
import type { SelectOption } from '~/types/ui'

const model = defineModel<Method>({ required: true })

const options: SelectOption<Method>[] = [
  { value: 'direct', label: 'Прямой' },
  { value: 'reverse', label: 'Обратный' }
]

const index = computed(() => options.findIndex(o => o.value === model.value))

function onKeydown(e: KeyboardEvent) {
  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  e.preventDefault()
  const next = options[(index.value + step + options.length) % options.length]
  if (next) model.value = next.value
}
</script>

<template>
  <div class="seg" role="radiogroup" aria-label="Метод расчёта" @keydown="onKeydown">
    <span class="thumb" :style="{ transform: `translateX(${index * 100}%)` }" aria-hidden="true" />
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      class="seg-btn"
      :aria-checked="option.value === model"
      :tabindex="option.value === model ? 0 : -1"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.seg {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  background: var(--seg-bg);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  box-shadow: inset 0 1px 3px rgba(20, 10, 70, 0.12);
}

.thumb {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  border-radius: 10px;
  background: var(--seg-thumb);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 4px 12px -4px rgba(0, 0, 0, 0.45);
  transition: transform 0.28s cubic-bezier(0.3, 0.8, 0.3, 1);
}

.seg-btn {
  position: relative;
  padding: 10px 12px;
  background: none;
  border: 0;
  border-radius: 10px;
  color: var(--text-faint);
  font: 500 14px/1.2 var(--font);
  cursor: pointer;
  transition: color 0.2s;
}

.seg-btn:hover { color: var(--text-dim); }
.seg-btn[aria-checked='true'] { color: var(--text); }
</style>
