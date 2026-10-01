<script setup lang="ts">
import { PLANETS, PLANET_ICONS, getPlanet } from '~/types/astro'

const model = defineModel<number>({ required: true })
</script>

<template>
  <div class="row">
    <img :src="PLANET_ICONS[getPlanet(model)]" alt="" width="32" height="32" class="icon" />
    <UiSelect v-model="model" aria-label="Планета">
      <option v-for="(planet, i) in PLANETS" :key="planet" :value="i">{{ planet }}</option>
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
