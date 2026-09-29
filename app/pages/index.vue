<script setup lang="ts">
import { getPlanet, getSign, PLANET_SYMBOLS, ZODIAC_SYMBOLS } from '~/types/astro'
import type { Method, DMS, CalculationResult } from '~/types/astro'
import { calculatePosition } from '~/composables/useAstroCalc'

const method = ref<Method>('direct')
const birth = ref({ day: 25, month: 6, year: 2000 })
const event = ref({ day: 10, month: 9, year: 2026 })
const planetIdx = ref(2)
const signIdx = ref(4)
const position = ref<DMS>({ degrees: 14, minutes: 38, seconds: 4 })

const result = ref<CalculationResult | null>(null)
const error = ref('')

function onCalculate() {
  error.value = ''
  try {
    result.value = calculatePosition(
      {
        ...birth.value,
        planet: getPlanet(planetIdx.value),
        sign: getSign(signIdx.value),
        position: position.value
      },
      event.value,
      method.value
    )
  } catch (e) {
    error.value = (e as Error).message
    result.value = null
  }
}
</script>

<template>
  <main class="page">
    <header class="header">
      <div class="ornament">✦</div>
      <h1>Астрологический калькулятор</h1>
      <p class="subtitle">Расчёт положения планеты на заданную дату</p>
    </header>

    <div class="layout">
      <form class="form" @submit.prevent="onCalculate">
        <MethodSelector v-model="method" />

        <section class="card">
          <label class="label">Дата рождения</label>
          <DateInput v-model="birth" />
        </section>

        <section class="card">
          <label class="label">Дата события</label>
          <DateInput v-model="event" />
        </section>

        <section class="card">
          <label class="label">Планета</label>
          <PlanetSelect v-model="planetIdx" />
        </section>

        <section class="card">
          <label class="label">Знак положения</label>
          <ZodiacSelect v-model="signIdx" />
        </section>

        <section class="card">
          <label class="label">Градус положения</label>
          <DegreeInput v-model="position" />
        </section>

        <button type="submit" class="calc-btn">Рассчитать</button>

        <p v-if="error" class="error">{{ error }}</p>

        <Transition name="result">
          <div v-if="result" class="result">
            <div class="result-row">
              <span class="result-symbol">{{ PLANET_SYMBOLS[result.planet] }}</span>
              <span class="result-planet">{{ result.planet }}</span>
            </div>
            <div class="result-row main">
              <span class="result-pos">
                {{ result.position.degrees }}°&thinsp;{{ String(result.position.minutes).padStart(2, '0') }}′&thinsp;{{ String(result.position.seconds).padStart(2, '0') }}″
              </span>
              <span class="result-sign">
                <span class="result-sign-symbol">{{ ZODIAC_SYMBOLS[result.sign] }}</span>
                {{ result.sign }}
              </span>
            </div>
          </div>
        </Transition>
      </form>

      <div class="wheel-wrap">
        <ZodiacWheel
          :selected-sign-index="signIdx"
          :start-position="{ signIndex: signIdx, ...position }"
          :result="result"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.header { text-align: center; margin-bottom: 36px; }

.ornament {
  color: var(--accent);
  font-size: 16px;
  opacity: 0.6;
  margin-bottom: 8px;
  letter-spacing: 8px;
}

.header h1 {
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 1.5px;
  margin: 0 0 6px;
  color: var(--text);
  text-transform: uppercase;
}

.subtitle {
  font-size: 12px;
  color: var(--text-faint);
  margin: 0;
  letter-spacing: 0.5px;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 40px;
  align-items: start;
}

@media (max-width: 860px) {
  .layout { grid-template-columns: 1fr; gap: 32px; }
  .wheel-wrap { order: -1; }
}

.form { display: flex; flex-direction: column; gap: 14px; }

.card {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px 14px;
  transition: border-color 0.2s ease, background 0.3s ease;
}

.card:focus-within { border-color: var(--accent-strong); }

.label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--text-faint);
  margin-bottom: 10px;
}

.calc-btn {
  margin-top: 8px;
  padding: 13px 20px;
  background: var(--button-bg);
  border: none;
  border-radius: var(--radius);
  color: var(--button-text);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calc-btn:hover { background: var(--button-hover); }

.error {
  color: var(--error);
  font-size: 12px;
  margin: 4px 0 0;
  text-align: center;
}

.result {
  margin-top: 10px;
  padding: 18px 20px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-align: center;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.result-row.main {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.result-symbol { font-size: 22px; color: var(--gold); line-height: 1; }

.result-planet {
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
}

.result-pos {
  font-size: 20px;
  font-variant-numeric: tabular-nums;
  color: var(--text);
  font-weight: 300;
}

.result-sign {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: var(--accent);
}

.result-sign-symbol { font-size: 18px; line-height: 1; }

.result-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.result-enter-from { opacity: 0; transform: translateY(6px); }

.wheel-wrap {
  position: sticky;
  top: 40px;
  padding: 20px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: background 0.3s ease, border-color 0.3s ease;
}
</style>