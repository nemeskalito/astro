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
  <section id="calculator" class="section container" aria-labelledby="calc-title">
    <div class="section-head">
      <h2 id="calc-title">Калькулятор</h2>
      <p>Заполните данные слева — результат появится справа.</p>
    </div>

    <div class="calc">
      <form class="form glass" @submit.prevent="onCalculate">
        <FormField label="Метод расчёта" class="span-2">
          <MethodSelector v-model="method" />
        </FormField>

        <FormField label="Дата рождения" class="span-2">
          <DateInput v-model="birth" />
        </FormField>

        <FormField label="Дата события" class="span-2">
          <DateInput v-model="event" />
        </FormField>

        <FormField label="Планета">
          <PlanetSelect v-model="planetIdx" />
        </FormField>

        <FormField label="Знак положения">
          <ZodiacSelect v-model="signIdx" />
        </FormField>

        <FormField label="Градус положения" class="span-2">
          <DegreeInput v-model="position" />
        </FormField>

        <UiButton type="submit" size="lg" class="span-2 submit">Рассчитать положение</UiButton>
      </form>

      <ResultDisplay :result="result" :error="error" class="result-col" />
    </div>
  </section>
</template>

<style scoped>
.calc { display: grid; gap: 20px; align-items: start; }

.form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 16px;
  padding: 28px;
}

.span-2 { grid-column: 1 / -1; }
.submit { margin-top: 6px; }

@media (max-width: 560px) {
  .form { grid-template-columns: 1fr; padding: 20px; }
}

@media (min-width: 960px) {
  .calc { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); }
  .result-col { position: sticky; top: 100px; }
}
</style>
