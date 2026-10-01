<script setup lang="ts">
import { ZODIAC, ZODIAC_ICONS, getSign } from '~/types/astro'

const model = defineModel<number>({ required: true })
</script>

<template>
  <div class="row">
    <img :src="ZODIAC_ICONS[getSign(model)]" alt="" width="32" height="32" class="icon" />
    <UiSelect v-model="model" aria-label="Знак зодиака">
      <option v-for="(sign, i) in ZODIAC" :key="sign" :value="i">{{ sign }}</option>
    </UiSelect>
  </div>
</template>

<style scoped>
.row { display: flex; align-items: center; gap: 10px; }

.icon {
  flex-shrink: 0;
  object-fit: contain;
  filter: var(--icon-filter, invert(1));
  transition: filter 0.3s ease;
}
</style>
