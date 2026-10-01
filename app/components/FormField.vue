<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <fieldset class="field">
    <legend class="label">{{ label }}</legend>
    <slot />
  </fieldset>
</template>

<style scoped>
.field { border: 0; margin: 0; padding: 0; min-width: 0; }

.label {
  padding: 0;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-dim);
}
</style>
