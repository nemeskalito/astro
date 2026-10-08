<script setup lang="ts">
import type { SelectOption } from '~/types/ui'

const { themeNames, themeName, setTheme, previewIcon, isAdaptive } = useIcons()

const model = computed({
  get: () => themeName.value,
  set: setTheme
})

const options = computed<SelectOption<string>[]>(() =>
  themeNames.map(name => ({
    value: name,
    label: name,
    icon: previewIcon(name),
    iconFilter: isAdaptive(name) ? 'adaptive' : 'none'
  }))
)
</script>

<template>
  <UiSelect v-model="model" :options="options" aria-label="Тема иконок" />
</template>
