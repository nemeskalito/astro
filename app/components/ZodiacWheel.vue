<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'   // + ref, onMounted, onBeforeUnmount
import { ZODIAC, ZODIAC_SYMBOLS } from '~/types/astro'
import {
  describeAnnularSector,
  polarToCartesian,
  degreeToAngle
} from '~/composables/useZodiacGeometry'
import type { CalculationResult } from '~/types/astro'

const props = defineProps<{
  selectedSignIndex: number
  startPosition: {
    signIndex: number
    degrees: number
    minutes: number
    seconds: number
  }
  result: CalculationResult | null
}>()

const SIZE = 500
const CX = SIZE / 2
const CY = SIZE / 2

const R_OUTER = 200
const R_INNER = 152
const R_LABEL = 176
const R_INNER_TICK = 138

const SECTOR_GAP = 0.8

/* ---------- Вращение ---------- */

const rotation = ref(0)
const isDragging = ref(false)
const dragStartPointerAngle = ref(0)
const dragStartRotation = ref(0)
const svgEl = ref<SVGSVGElement>()

/** Угол указателя относительно центра SVG (в градусах) */
function pointerAngle(e: PointerEvent): number {
  if (!svgEl.value) return 0
  const rect = svgEl.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  return (Math.atan2(-dy, dx) * 180) / Math.PI
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 && e.pointerType === 'mouse') return
  isDragging.value = true
  dragStartPointerAngle.value = pointerAngle(e)
  dragStartRotation.value = rotation.value
  ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  const current = pointerAngle(e)
  let delta = current - dragStartPointerAngle.value
  // нормализация в (-180, 180]
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  // знак минус — компенсация зеркалирования системы по X
  rotation.value = dragStartRotation.value - delta
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  ;(e.currentTarget as Element).releasePointerCapture(e.pointerId)
}

function resetRotation() {
  rotation.value = 0
}

function preventSelect(e: Event) {
  if (isDragging.value) e.preventDefault()
}

onMounted(() => {
  document.addEventListener('selectstart', preventSelect)
})

onBeforeUnmount(() => {
  document.removeEventListener('selectstart', preventSelect)
})

/* ---------- Секторы и деления ---------- */

const sectors = computed(() =>
  ZODIAC.map((name, i) => {
    const start = i * 30 + SECTOR_GAP / 2
    const end = (i + 1) * 30 - SECTOR_GAP / 2

    return {
      name,
      symbol: ZODIAC_SYMBOLS[name],
      index: i,
      path: describeAnnularSector(CX, CY, R_INNER, R_OUTER, start, end),
      labelPos: polarToCartesian(CX, CY, R_LABEL, i * 30 + 15)
    }
  })
)

const ticks = computed(() => {
  const result: Array<{ x1: number; y1: number; x2: number; y2: number; major: boolean }> = []
  for (let deg = 0; deg < 360; deg += 5) {
    const major = deg % 30 === 0
    const outer = polarToCartesian(CX, CY, R_INNER_TICK, deg)
    const inner = polarToCartesian(CX, CY, R_INNER_TICK - (major ? 10 : 5), deg)
    result.push({ x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y, major })
  }
  return result
})

/* ---------- Ось 0°–180° ---------- */

const AXIS_OVERHANG = 22

const axisTop    = computed(() => polarToCartesian(CX, CY, R_OUTER + AXIS_OVERHANG, 0))
const axisBottom = computed(() => polarToCartesian(CX, CY, R_OUTER + AXIS_OVERHANG, 180))

const labelTop    = computed(() => polarToCartesian(CX, CY, R_OUTER + AXIS_OVERHANG + 14, 0))
const labelBottom = computed(() => polarToCartesian(CX, CY, R_OUTER + AXIS_OVERHANG + 14, 180))

/* ---------- Положение планеты ---------- */

const startAngle = computed(() =>
  degreeToAngle(
    props.startPosition.signIndex,
    props.startPosition.degrees
      + props.startPosition.minutes / 60
      + props.startPosition.seconds / 3600
  )
)

const endAngle = computed(() => {
  if (!props.result) return null
  const signIndex = ZODIAC.indexOf(props.result.sign)
  return degreeToAngle(
    signIndex,
    props.result.position.degrees
      + props.result.position.minutes / 60
      + props.result.position.seconds / 3600
  )
})

const startPoint = computed(() =>
  polarToCartesian(CX, CY, R_INNER_TICK, startAngle.value)
)

const endPoint = computed(() => {
  if (endAngle.value === null) return null
  return polarToCartesian(CX, CY, R_INNER_TICK, endAngle.value)
})
</script>

<template>
  <div class="wheel-container">
    <svg
      ref="svgEl"
      :viewBox="`0 0 ${SIZE} ${SIZE}`"
      class="wheel"
      :class="{ dragging: isDragging }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <defs>
        <radialGradient id="activeGradient" cx="50%" cy="50%" r="50%">
          <stop offset="55%" style="stop-color: var(--wheel-active-1)" />
          <stop offset="100%" style="stop-color: var(--wheel-active-2)" />
        </radialGradient>
      </defs>

      <!-- Всё содержимое вращается вокруг центра -->
      <g :transform="`rotate(${rotation} ${CX} ${CY})`">

        <!-- Внешняя рамка -->
        <circle
          :cx="CX" :cy="CY" :r="R_OUTER + 2"
          fill="none" stroke="var(--wheel-outer-ring)" stroke-width="1"
        />

        <!-- Ось 0°–180° -->
        <line
          :x1="axisTop.x" :y1="axisTop.y"
          :x2="axisBottom.x" :y2="axisBottom.y"
          class="axis-line"
        />
        <text
          :x="labelTop.x" :y="labelTop.y"
          text-anchor="middle" dominant-baseline="auto"
          class="axis-label"
        >0°</text>
        <text
          :x="labelBottom.x" :y="labelBottom.y"
          text-anchor="middle" dominant-baseline="hanging"
          class="axis-label"
        >180°</text>

        <!-- Секторы знаков -->
        <g>
          <path
            v-for="s in sectors"
            :key="s.name"
            :d="s.path"
            :class="['sector', { active: s.index === props.selectedSignIndex }]"
          />
        </g>

        <!-- Символы знаков -->
        <g>
          <text
            v-for="s in sectors"
            :key="'t-' + s.name"
            :x="s.labelPos.x"
            :y="s.labelPos.y"
            text-anchor="middle"
            dominant-baseline="central"
            :class="['sign-symbol', { active: s.index === props.selectedSignIndex }]"
          >
            {{ s.symbol }}
          </text>
        </g>

        <!-- Внутренний круг с делениями -->
        <circle
          :cx="CX" :cy="CY" :r="R_INNER_TICK"
          fill="none" stroke="var(--wheel-inner-circle)" stroke-width="1"
        />
        <g>
          <line
            v-for="(t, i) in ticks"
            :key="i"
            :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
            :class="['tick', { major: t.major }]"
          />
        </g>

        <!-- Линия старта -->
        <line
          :x1="CX" :y1="CY"
          :x2="startPoint.x" :y2="startPoint.y"
          class="line-start"
        />
        <circle :cx="startPoint.x" :cy="startPoint.y" r="4" class="dot-start" />

        <!-- Линия финиша -->
        <template v-if="endPoint">
          <line
            :x1="CX" :y1="CY"
            :x2="endPoint.x" :y2="endPoint.y"
            class="line-end"
          />
          <circle :cx="endPoint.x" :cy="endPoint.y" r="5.5" class="dot-end" />
        </template>

        <!-- Центральная точка -->
        <circle :cx="CX" :cy="CY" r="2.5" fill="#9aa0b8" />
      </g>
    </svg>

    <button type="button" class="reset-btn" @click="resetRotation">
      Сбросить поворот
    </button>
  </div>
</template>

<style scoped>
.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.wheel {
  width: 100%;
  max-width: 440px;
  height: auto;
  display: block;
  margin: 0 auto;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.wheel.dragging { cursor: grabbing; }

.sector {
  fill: var(--wheel-sector);
  stroke: var(--wheel-sector-stroke);
  stroke-width: 0.8;
  transition: fill 0.3s ease, stroke 0.3s ease;
}

.sector.active { fill: url(#activeGradient); }

.sign-symbol {
  fill: var(--wheel-sign-symbol);
  font-size: 16px;
  font-weight: 500;
  user-select: none;
  transition: fill 0.3s ease;
}

.sign-symbol.active { fill: var(--wheel-sign-symbol-active); }

.tick { stroke: var(--wheel-tick); stroke-width: 0.6; transition: stroke 0.3s ease; }
.tick.major { stroke: var(--wheel-tick-major); stroke-width: 1; }

.line-start { stroke: var(--wheel-line-start); stroke-width: 2; opacity: 0.95; transition: stroke 0.3s ease; }
.dot-start { fill: var(--wheel-line-start); transition: fill 0.3s ease; }

.line-end { stroke: var(--wheel-line-end); stroke-width: 2.2; transition: stroke 0.3s ease; }
.dot-end { fill: var(--wheel-line-end); filter: drop-shadow(0 0 6px var(--gold-glow)); transition: fill 0.3s ease; }

.axis-line {
  stroke: var(--wheel-axis);
  stroke-width: 1;
  opacity: 0.55;
  pointer-events: none;
  transition: stroke 0.3s ease;
}

.axis-label {
  fill: var(--wheel-axis-label);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  user-select: none;
  pointer-events: none;
  transition: fill 0.3s ease;
}

.reset-btn {
  background: var(--bg-cell);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-dim);
  font-size: 11px;
  font-family: inherit;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.reset-btn:hover {
  border-color: var(--accent-strong);
  color: var(--accent);
}
</style>