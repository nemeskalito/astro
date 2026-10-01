<script setup lang="ts">
import type { Method } from '~/types/astro'
const model = defineModel<Method>({ required: true })
</script>

<template>
  <UiSelect v-model="model" aria-label="Метод расчёта">
    <option value="direct">Прямой метод</option>
    <option value="reverse">Обратный метод</option>
  </UiSelect>
</template>
