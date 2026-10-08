<script setup lang="ts">
import type { CalculationResult } from '~/types/astro'
import { formatDms } from '~/composables/useAstroCalc'

defineProps<{
  result: CalculationResult | null
  error?: string
}>()

const { planetIcon, zodiacIcon, planetIconAdaptive, zodiacIconAdaptive } = useIcons()
</script>

<template>
  <div class="display" aria-live="polite">
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <Transition v-else name="swap" mode="out-in">
      <div v-if="result" :key="`${result.planet}-${result.sign}-${formatDms(result.position)}`" class="data">
        <p class="meta">
          <img :src="planetIcon(result.planet)" :style="{ filter: planetIconAdaptive(result.planet) ? 'var(--icon-adaptive-filter)' : 'none' }" alt="" width="20" height="20" />
          <span class="planet">{{ result.planet }}</span>
        </p>
        <p class="pos">{{ formatDms(result.position) }}</p>
        <p class="meta sign">
          <img :src="zodiacIcon(result.sign)" :style="{ filter: zodiacIconAdaptive(result.sign) ? 'var(--icon-adaptive-filter)' : 'none' }" alt="" width="20" height="20" />
          {{ result.sign }}
        </p>
      </div>

      <div v-else class="empty">
        <p class="pos muted">—</p>
        <p class="hint">Результат появится здесь</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.display {
  display: grid;
  place-items: center;
  min-height: 152px;
  padding: 20px;
  text-align: center;
  background: var(--display-bg);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  box-shadow: inset 0 2px 8px rgba(20, 10, 70, 0.14), 0 1px 0 var(--glass-hi);
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
}

.meta img { object-fit: contain; }
.planet { color: var(--gold); }
.sign { color: var(--accent); }

.pos {
  margin: 8px 0 10px;
  font-size: clamp(34px, 9vw, 44px);
  font-weight: 500;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.muted { color: var(--text-faint); margin-bottom: 4px; }
.hint { font-size: 13px; color: var(--text-faint); }
.error { color: var(--error); font-size: 15px; font-weight: 500; max-width: 32ch; }

.swap-enter-active, .swap-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to { opacity: 0; }
</style>
