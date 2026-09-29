<script setup lang="ts">
import type { CalculationResult } from '~/types/astro'
import { formatDms } from '~/composables/useAstroCalc'

const props = defineProps<{ result: CalculationResult | null }>()
</script>

<template>
  <div v-if="props.result" class="result">
    <strong>{{ props.result.planet }}</strong>
    {{ formatDms(props.result.position) }}
    <strong>{{ props.result.sign }}</strong>.
  </div>
</template>