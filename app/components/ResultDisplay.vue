<script setup lang="ts">
import type { CalculationResult } from '~/types/astro'
import { formatDms } from '~/composables/useAstroCalc'

defineProps<{
  result: CalculationResult | null
  error?: string
}>()

const { planetIcon, zodiacIcon, planetIconStyle, zodiacIconStyle } = useIcons()
</script>

<template>
  <div class="result-panel" aria-live="polite">
    <h2 class="result-heading">Градус и знак положения планеты на дату события:</h2>
    <div class="display">
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <Transition v-else name="swap" mode="out-in">
      <div v-if="result" :key="`${result.planet}-${result.sign}-${formatDms(result.position)}`" class="data">
        <p class="meta">
          <img :src="planetIcon(result.planet)" :style="planetIconStyle(result.planet)" alt="" width="20" height="20" />
          <span class="planet">{{ result.planet }}</span>
        </p>
        <p class="pos">{{ formatDms(result.position) }}</p>
        <p class="meta sign">
          <img :src="zodiacIcon(result.sign)" :style="zodiacIconStyle(result.sign)" alt="" width="20" height="20" />
          {{ result.sign }}
        </p>
      </div>

      <div v-else class="empty">
        <p class="pos muted">—</p>
        <p class="hint">Результат появится здесь</p>
      </div>
    </Transition>
    </div>
  </div>
</template>

<style scoped>
.result-panel { display: grid; gap: 12px; }
.result-heading { font-size: 17px; line-height: 1.35; font-weight: 650; text-align: center; color: var(--text); }
.data .meta { font-size: 21px; }
.data .meta img { width: 32px; height: 32px; }
.data .pos { font-size: clamp(42px, 10vw, 56px); }
.display {
  display: grid;
  place-items: center;
  min-height: 184px;
  padding: 22px 16px;
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
  font-size: 21px;
  font-weight: 600;
}

.meta img { object-fit: contain; }
.planet { color: var(--gold); }
.sign { color: var(--accent); }

.pos {
  margin: 8px 0 10px;
  font-size: clamp(42px, 10vw, 56px);
  font-weight: 500;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.muted { color: var(--text-faint); margin-bottom: 4px; }
.hint { font-size: 14px; color: var(--text-faint); }
.error { color: var(--error); font-size: 17px; font-weight: 500; max-width: 32ch; }

.swap-enter-active, .swap-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to { opacity: 0; }
</style>
