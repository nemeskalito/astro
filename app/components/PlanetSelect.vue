<script setup lang="ts">
import { PLANETS } from '~/types/astro'
import type { SelectOption } from '~/types/ui'

const model = defineModel<number>({ required: true })
const { planetIcon, planetIconAdaptive } = useIcons()

const selectedIcon = computed(() => planetIcon(PLANETS[model.value]!))
const selectedIconFilter = computed(() => planetIconAdaptive(PLANETS[model.value]!) ? 'adaptive' : 'none')

const options = computed<SelectOption<number>[]>(() =>
  PLANETS.map((planet, i) => ({
    value: i,
    label: planet
  }))
)
</script>

<template>
  <div class="icon-select">
    <img
      class="outside-icon"
      :src="selectedIcon"
      :style="{ filter: selectedIconFilter === 'adaptive' ? 'var(--icon-adaptive-filter)' : 'none' }"
      alt=""
      width="32"
      height="32"
    />
    <UiSelect v-model="model" :options="options" :show-trigger-icon="false" aria-label="Планета" />
  </div>
</template>

<style scoped>
.icon-select {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}

.outside-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  justify-self: center;
  flex-shrink: 0;
}
</style>
