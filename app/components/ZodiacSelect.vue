<script setup lang="ts">
import { ZODIAC } from '~/types/astro'
import type { SelectOption } from '~/types/ui'

const model = defineModel<number>({ required: true })
const { zodiacIcon, zodiacIconAdaptive } = useIcons()

const selectedIcon = computed(() => zodiacIcon(ZODIAC[model.value]!))
const selectedIconFilter = computed(() => zodiacIconAdaptive(ZODIAC[model.value]!) ? 'adaptive' : 'none')

const options = computed<SelectOption<number>[]>(() =>
  ZODIAC.map((sign, i) => ({
    value: i,
    label: sign,
    icon: zodiacIcon(sign),
    iconFilter: zodiacIconAdaptive(sign) ? 'adaptive' : 'none'
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
    <UiSelect v-model="model" :options="options" :show-trigger-icon="false" aria-label="Знак зодиака" />
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
