<script setup lang="ts">
import { MONTHS } from '~/types/astro'

interface DateValue { day: number; month: number; year: number }
const model = defineModel<DateValue>({ required: true })

const dayStr = ref(String(model.value.day).padStart(2, '0'))
const monthStr = ref(String(model.value.month + 1).padStart(2, '0'))
const yearStr = ref(String(model.value.year))

const dayEl = ref<HTMLInputElement>()
const monthEl = ref<HTMLInputElement>()
const yearEl = ref<HTMLInputElement>()

watch([dayStr, monthStr, yearStr], () => {
  const d = Number(dayStr.value)
  const m = Number(monthStr.value)
  const y = Number(yearStr.value)

  if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2200) {
    const maxDay = new Date(y, m, 0).getDate()
    model.value = { day: Math.min(d, maxDay), month: m - 1, year: y }
  }
})

function onInput(e: Event, field: 'day' | 'month' | 'year', next?: HTMLInputElement) {
  const el = e.target as HTMLInputElement
  el.value = el.value.replace(/\D/g, '')
  if (field === 'day') dayStr.value = el.value
  if (field === 'month') monthStr.value = el.value
  if (field === 'year') yearStr.value = el.value
  const max = field === 'year' ? 4 : 2
  if (el.value.length >= max && next) next.focus()
}

function onBlur(field: 'day' | 'month' | 'year') {
  if (field === 'day' && !dayStr.value) dayStr.value = '01'
  if (field === 'month' && !monthStr.value) monthStr.value = '01'
  if (field === 'year' && yearStr.value.length < 4) yearStr.value = '2000'
}
</script>

<template>
  <div class="date-input">
    <div class="fields">
      <input
        ref="dayEl" :value="dayStr"
        inputmode="numeric" maxlength="2" placeholder="ДД"
        @input="onInput($event, 'day', monthEl)"
        @blur="onBlur('day')"
      />
      <span class="sep">.</span>
      <input
        ref="monthEl" :value="monthStr"
        inputmode="numeric" maxlength="2" placeholder="ММ"
        @input="onInput($event, 'month', yearEl)"
        @blur="onBlur('month')"
      />
      <span class="sep">.</span>
      <input
        ref="yearEl" :value="yearStr"
        inputmode="numeric" maxlength="4" placeholder="ГГГГ"
        @input="onInput($event, 'year')"
        @blur="onBlur('year')"
      />
    </div>
    <div class="month-hint">{{ MONTHS[model.month] }}</div>
  </div>
</template>

<style scoped>
.date-input { display: flex; flex-direction: column; gap: 4px; }

.fields {
  display: flex;
  align-items: center;
  gap: 5px;
  font-variant-numeric: tabular-nums;
}

input {
  background: var(--bg-cell);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  padding: 9px 0;
  text-align: center;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.3s ease, color 0.3s ease;
  font-variant-numeric: tabular-nums;
}

input:focus {
  border-color: var(--accent-strong);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

input::placeholder { color: var(--text-faint); }

.fields input:nth-child(1) { width: 56px; }
.fields input:nth-child(3) { width: 56px; }
.fields input:nth-child(5) { width: 76px; }

.sep { color: var(--text-faint); font-size: 15px; }

.month-hint {
  font-size: 11px;
  color: var(--accent);
  opacity: 0.7;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  padding-left: 2px;
  min-height: 14px;
}
</style>