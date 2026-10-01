<script setup lang="ts">
import { MONTHS } from '~/types/astro'

interface DateValue { day: number; month: number; year: number }
const model = defineModel<DateValue>({ required: true })

const YEAR_MIN = 1950
const YEAR_MAX = 2070
const CUSTOM = 'custom'   // значение-заглушка для <option>

/** Максимум дней в текущем месяце с учётом года */
const maxDay = computed(() => {
  const y = model.value.year || 2000
  const m = model.value.month
  return new Date(y, m + 1, 0).getDate()
})

const days = computed(() =>
  Array.from({ length: maxDay.value }, (_, i) => i + 1)
)

/** Список годов для <select> */
const years = Array.from(
  { length: YEAR_MAX - YEAR_MIN + 1 },
  (_, i) => YEAR_MIN + i
)

/**
 * Если год в модели вне диапазона [1950, 2030] — включаем режим ручного ввода.
 * Иначе — показываем список.
 */
const customMode = ref(
  model.value.year < YEAR_MIN || model.value.year > YEAR_MAX
)

/** Значение для <select>: либо год, либо 'custom' */
const selectValue = computed<string | number>({
  get() {
    return customMode.value ? CUSTOM : model.value.year
  },
  set(v) {
    if (v === CUSTOM) {
      customMode.value = true
    } else {
      customMode.value = false
      model.value.year = Number(v)
    }
  }
})

/** Ручной ввод года — как строка */
const yearStr = ref(String(model.value.year))

watch(yearStr, (v) => {
  const n = Number(v.replace(/\D/g, ''))
  if (n >= 1 && n <= 9999) model.value.year = n
})

function onYearInput(e: Event) {
  const el = e.target as HTMLInputElement
  el.value = el.value.replace(/\D/g, '').slice(0, 4)
  yearStr.value = el.value
}

function onYearBlur() {
  if (!yearStr.value) {
    yearStr.value = String(YEAR_MIN)
    model.value.year = YEAR_MIN
  }
}

/** Если пользователь вернулся в диапазон — выходим из ручного режима */
watch(
  () => model.value.year,
  (y) => {
    if (y >= YEAR_MIN && y <= YEAR_MAX) {
      customMode.value = false
      // синхронизируем строку
      yearStr.value = String(y)
    }
  }
)

/** Подрезаем день, если он не влезает в новый месяц */
watch(maxDay, (max) => {
  if (model.value.day > max) model.value.day = max
})
</script>

<template>
  <div class="date-input">
    <UiSelect v-model="model.day" aria-label="День">
      <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
    </UiSelect>

    <UiSelect v-model="model.month" aria-label="Месяц">
      <option v-for="(name, i) in MONTHS" :key="name" :value="i">{{ name }}</option>
    </UiSelect>

    <!-- Год: либо список, либо ручной ввод -->
    <UiSelect v-if="!customMode" v-model="selectValue" aria-label="Год">
      <option :value="CUSTOM">Другой год</option>
      <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
    </UiSelect>

    <div v-else class="year-wrap">
      <input
        :value="yearStr"
        inputmode="numeric"
        maxlength="4"
        placeholder="ГГГГ"
        aria-label="Год"
        class="year-input"
        @input="onYearInput"
        @blur="onYearBlur"
      />
      <button
        type="button"
        class="back-btn"
        aria-label="Вернуться к списку годов"
        @click="customMode = false; model.year = YEAR_MIN; yearStr = String(YEAR_MIN)"
      >✕</button>
    </div>
  </div>
</template>

<style scoped>
.date-input {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) 118px;
  gap: 8px;
  align-items: center;
}

.year-wrap { position: relative; }

.year-input {
  width: 100%;
  background: var(--field-bg);
  border: 1px solid var(--accent-strong);
  border-radius: var(--radius-sm);
  color: var(--text);
  font: 500 15px/1.2 var(--font);
  padding: 13px 30px 13px 0;
  text-align: center;
  outline: none;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.year-input::placeholder { color: var(--text-faint); }

.back-btn {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-faint);
  font-size: 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.back-btn:hover { color: var(--text); background: var(--field-bg); }
</style>
