<script setup lang="ts">
import { ZODIAC, ZODIAC_ICONS } from '~/types/astro'
import type { SelectOption } from '~/types/ui'

const model = defineModel<number>({ required: true })

const options: SelectOption<number>[] = ZODIAC.map((sign, i) => ({
  value: i,
  label: sign,
  icon: ZODIAC_ICONS[sign]
}))
</script>

<template>
  <UiSelect v-model="model" :options="options" aria-label="Знак зодиака" />
</template>
