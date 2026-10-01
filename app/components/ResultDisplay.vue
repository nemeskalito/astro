<script setup lang="ts">
import { PLANET_ICONS, ZODIAC_ICONS } from '~/types/astro'
import type { CalculationResult } from '~/types/astro'
import { formatDms } from '~/composables/useAstroCalc'

defineProps<{
  result: CalculationResult | null
  error?: string
}>()
</script>

<template>
  <aside class="result glass" aria-live="polite">
    <p v-if="error" class="state error" role="alert">{{ error }}</p>

    <Transition name="swap" mode="out-in">
      <div v-if="result && !error" :key="`${result.planet}-${result.sign}-${formatDms(result.position)}`" class="data">
        <p class="caption">Положение на дату события</p>

        <div class="planet">
          <span class="orb">
            <img :src="PLANET_ICONS[result.planet]" alt="" width="36" height="36" />
          </span>
          <span class="planet-name">{{ result.planet }}</span>
        </div>

        <p class="pos">{{ formatDms(result.position) }}</p>

        <p class="sign">
          <img :src="ZODIAC_ICONS[result.sign]" alt="" width="26" height="26" />
          {{ result.sign }}
        </p>
      </div>

      <div v-else-if="!error" class="state empty">
        <span class="empty-mark" aria-hidden="true">✦</span>
        <p>Здесь появится результат</p>
        <p class="hint">Заполните форму и нажмите «Рассчитать положение».</p>
      </div>
    </Transition>
  </aside>
</template>

<style scoped>
.result {
  display: grid;
  align-content: center;
  min-height: 320px;
  padding: 32px;
  text-align: center;
}

.state { color: var(--text-dim); }
.state.error { color: var(--error); font-weight: 500; margin-bottom: 8px; }

.empty-mark {
  display: block;
  font-size: 28px;
  color: var(--gold);
  opacity: 0.7;
  margin-bottom: 12px;
}

.hint { margin-top: 6px; font-size: 14px; color: var(--text-faint); }

.caption { font-size: 14px; color: var(--text-faint); margin-bottom: 20px; }

.planet { display: inline-flex; align-items: center; gap: 12px; }

.orb {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, var(--glass-hi), var(--field-bg) 70%);
  border: 1px solid var(--glass-border);
  box-shadow: 0 0 30px -4px var(--gold-glow);
}

.orb img { filter: var(--icon-filter, invert(1)); }

.planet-name { font-size: 20px; font-weight: 600; color: var(--gold); }

.pos {
  margin: 20px 0 8px;
  font-size: clamp(34px, 5vw, 46px);
  font-weight: 500;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.sign {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 500;
  color: var(--accent);
}

.sign img { filter: var(--icon-filter, invert(1)); }

.swap-enter-active, .swap-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.swap-enter-from { opacity: 0; transform: translateY(8px) scale(0.98); }
.swap-leave-to { opacity: 0; }
</style>
