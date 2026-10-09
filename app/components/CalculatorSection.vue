<script setup lang="ts">
import { getPlanet, getSign } from '~/types/astro'
import type { Method, DMS, CalculationResult } from '~/types/astro'
import { calculatePosition } from '~/composables/useAstroCalc'

const method = ref<Method>('direct')
const birth = ref({ day: 1, month: 0, year: 2000 })
const event = ref({ day: 1, month: 0, year: 2000 })
const planetIdx = ref(0)
const signIdx = ref(0)
const position = ref<DMS>({ degrees: 0, minutes: 0, seconds: 0 })

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
  <section class="calc glass" aria-labelledby="calc-title">
    <header class="head">
      <h1 id="calc-title" class="title">Астрологический калькулятор</h1>
      <p class="subtitle">Гибридный метод прогностики</p>
    </header>

    <div class="form-wrap">
      <form class="form" @submit.prevent="onCalculate">
      <MethodSelector v-model="method" />

      <FormField label="Дата рождения">
        <DateInput v-model="birth" />
      </FormField>

      <FormField label="Дата события">
        <DateInput v-model="event" />
      </FormField>

      <div class="pair">
        <FormField label="Планета">
          <PlanetSelect v-model="planetIdx" />
        </FormField>
        <FormField label="Знак">
          <ZodiacSelect v-model="signIdx" />
        </FormField>
      </div>

      <div class="pair lower-pair">
        <FormField label="Градус положения">
          <DegreeInput v-model="position" />
        </FormField>
        <FormField label="Тема знаков">
          <IconThemeSelect />
        </FormField>
      </div>

        <UiButton type="submit" size="lg" class="submit">Рассчитать</UiButton>
      </form>
    </div>

    <div class="result-wrap">
      <ResultDisplay :result="result" :error="error" />
    </div>
  </section>
</template>

<style scoped>
.calc {
  width: min(920px, 100%);
  padding: 26px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
  grid-template-areas:
    "head head"
    "form result";
  gap: 20px 28px;
  align-items: start;
}

.head { grid-area: head; display: grid; gap: 4px; }
.form-wrap { grid-area: form; min-width: 0; }
.result-wrap {
  grid-area: result;
  position: sticky;
  top: 20px;
  min-width: 0;
}

.title {
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text);
}

.subtitle {
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.01em;
  color: var(--text-dim);
}

.form { display: grid; gap: 20px; }
.lower-pair { align-items: start; }

.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.submit { margin-top: 4px; width: 100%; }

@media (max-width: 720px) {
  .calc {
    width: min(520px, 100%);
    grid-template-columns: 1fr;
    grid-template-areas:
      "head"
      "result"
      "form";
  }

  .result-wrap { position: static; }
}

@media (max-width: 480px) {
  .calc { padding: 20px 16px; }
}
</style>
