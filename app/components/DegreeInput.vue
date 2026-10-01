<script setup lang="ts">
import type { DMS } from '~/types/astro'
const model = defineModel<DMS>({ required: true })

const degStr = ref(String(model.value.degrees))
const minStr = ref(String(model.value.minutes).padStart(2, '0'))
const secStr = ref(String(model.value.seconds).padStart(2, '0'))

const minEl = ref<HTMLInputElement>()
const secEl = ref<HTMLInputElement>()

watch([degStr, minStr, secStr], () => {
  model.value = {
    degrees: clampInt(degStr.value, 0, 29),
    minutes: clampInt(minStr.value, 0, 59),
    seconds: clampInt(secStr.value, 0, 59)
  }
})

function clampInt(v: string, min: number, max: number) {
  const n = Number(v.replace(/\D/g, ''))
  if (Number.isNaN(n)) return min
  return Math.min(Math.max(n, min), max)
}

function onInput(e: Event, field: 'deg' | 'min' | 'sec', next?: HTMLInputElement) {
  const el = e.target as HTMLInputElement
  el.value = el.value.replace(/\D/g, '')
  if (field === 'deg') degStr.value = el.value
  if (field === 'min') minStr.value = el.value
  if (field === 'sec') secStr.value = el.value
  if (el.value.length >= 2 && next) next.focus()
}

function onBlur(field: 'deg' | 'min' | 'sec') {
  if (field === 'deg') degStr.value = String(clampInt(degStr.value, 0, 29))
  else if (field === 'min') minStr.value = String(clampInt(minStr.value, 0, 59)).padStart(2, '0')
  else secStr.value = String(clampInt(secStr.value, 0, 59)).padStart(2, '0')
}
</script>

<template>
  <div class="degree-input">
    <div class="group">
      <input
        :value="degStr" aria-label="Градусы"
        inputmode="numeric" maxlength="2" placeholder="0"
        @input="onInput($event, 'deg', minEl)"
        @blur="onBlur('deg')"
      />
      <span class="unit">°</span>
    </div>

    <div class="group">
      <input
        ref="minEl" :value="minStr" aria-label="Минуты"
        inputmode="numeric" maxlength="2" placeholder="00"
        @input="onInput($event, 'min', secEl)"
        @blur="onBlur('min')"
      />
      <span class="unit">′</span>
    </div>

    <div class="group">
      <input
        ref="secEl" :value="secStr" aria-label="Секунды"
        inputmode="numeric" maxlength="2" placeholder="00"
        @input="onInput($event, 'sec')"
        @blur="onBlur('sec')"
      />
      <span class="unit">″</span>
    </div>
  </div>
</template>

<style scoped>
.degree-input {
  display: flex;
  align-items: center;
  gap: 8px;
  font-variant-numeric: tabular-nums;
}

.group { display: flex; align-items: baseline; gap: 3px; }

input {
  background: var(--field-bg);
  border: 1px solid var(--field-border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font: 500 15px/1.2 var(--font);
  padding: 13px 0;
  width: 60px;
  box-shadow: inset 0 1px 2px rgba(20, 10, 70, 0.10);
  text-align: center;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.3s ease, color 0.3s ease;
}

input:focus-visible {
  border-color: var(--accent-strong);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

input::placeholder { color: var(--text-faint); }

.unit { color: var(--text-dim); font-size: 20px; line-height: 1; }
</style>