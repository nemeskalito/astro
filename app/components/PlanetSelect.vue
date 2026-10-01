<script setup lang="ts">
import { PLANETS, PLANET_ICONS } from '~/types/astro'
import type { SelectOption } from '~/types/ui'

const model = defineModel<number>({ required: true })

const options: SelectOption<number>[] = PLANETS.map((planet, i) => ({
  value: i,
  label: planet,
  icon: PLANET_ICONS[planet]
}))
</script>

<template>
  <UiSelect v-model="model" :options="options" aria-label="Планета" />
</template>
