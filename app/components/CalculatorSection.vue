<script setup lang="ts">
import { getPlanet, getSign } from '~/types/astro'
import type { Method, DMS, CalculationResult } from '~/types/astro'
import { calculatePosition } from '~/composables/useAstroCalc'

const method = ref<Method>('direct')
const birth = ref({ day: 1, month: 0, year: 2000 })
const event = ref({ day: 1, month: 0, year: 2000 })
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
  <section class="calc glass" aria-labelledby="calc-title">
    <h1 id="calc-title" class="title">Астрологический калькулятор</h1>

    <ResultDisplay :result="result" :error="error" />

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

      <FormField label="Градус положения">
        <DegreeInput v-model="position" />
      </FormField>

      <UiButton type="submit" size="lg" class="submit">Рассчитать</UiButton>
    </form>
  </section>
</template>

<style scoped>
.calc {
  width: min(520px, 100%);
  padding: 26px;
  display: grid;
  gap: 20px;
}

.title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text);
}

.form { display: grid; gap: 20px; }

.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.submit { margin-top: 4px; width: 100%; }

@media (max-width: 480px) {
  .calc { padding: 20px 16px; }
}
</style>
