<script setup lang="ts" generic="T extends string | number">
import type { SelectOption } from '~/types/ui'

const props = defineProps<{
  options: SelectOption<T>[]
  ariaLabel?: string
}>()
const model = defineModel<T>({ required: true })

const uid = useId()
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const list = ref<HTMLElement>()

const isOpen = ref(false)
const active = ref(-1)
const dropUp = ref(false)

const selectedIdx = computed(() => props.options.findIndex(o => o.value === model.value))
const selected = computed(() => props.options[selectedIdx.value])
const optionId = (i: number) => `${uid}-opt-${i}`

function scrollToActive() {
  nextTick(() => {
    list.value?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  })
}

/** Открываем вверх, если снизу не хватает места, а сверху его больше */
function place() {
  if (!root.value || !list.value) return
  const rect = root.value.getBoundingClientRect()
  const below = window.innerHeight - rect.bottom
  const need = Math.min(list.value.scrollHeight, 320) + 16
  dropUp.value = below < need && rect.top > below
}

async function openList() {
  if (isOpen.value) return
  isOpen.value = true
  active.value = Math.max(selectedIdx.value, 0)
  await nextTick()
  place()
  scrollToActive()
}

function close(refocus = true) {
  isOpen.value = false
  if (refocus) trigger.value?.focus()
}

function choose(i: number) {
  const option = props.options[i]
  if (option) model.value = option.value
  close()
}

function move(delta: number) {
  const last = props.options.length - 1
  active.value = Math.min(Math.max(active.value + delta, 0), last)
  scrollToActive()
}

let buffer = ''
let bufferTimer: ReturnType<typeof setTimeout> | undefined

/** Быстрый поиск по первым буквам/цифрам (удобно для годов) */
function typeahead(char: string) {
  buffer += char.toLowerCase()
  clearTimeout(bufferTimer)
  bufferTimer = setTimeout(() => (buffer = ''), 600)
  const i = props.options.findIndex(o => o.label.toLowerCase().startsWith(buffer))
  if (i === -1) return
  if (!isOpen.value) openList()
  active.value = i
  scrollToActive()
}

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      isOpen.value ? move(1) : openList()
      break
    case 'ArrowUp':
      e.preventDefault()
      isOpen.value ? move(-1) : openList()
      break
    case 'Home':
      if (!isOpen.value) return
      e.preventDefault()
      active.value = 0
      scrollToActive()
      break
    case 'End':
      if (!isOpen.value) return
      e.preventDefault()
      active.value = props.options.length - 1
      scrollToActive()
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      isOpen.value ? choose(active.value) : openList()
      break
    case 'Escape':
      if (!isOpen.value) return
      e.preventDefault()
      close()
      break
    case 'Tab':
      if (isOpen.value) close(false)
      break
    default:
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) typeahead(e.key)
  }
}

function onOutside(e: PointerEvent) {
  if (isOpen.value && root.value && !root.value.contains(e.target as Node)) close(false)
}

onMounted(() => document.addEventListener('pointerdown', onOutside))
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onOutside)
  clearTimeout(bufferTimer)
})
</script>

<template>
  <div ref="root" class="ui-select" :class="{ open: isOpen }">
    <button
      ref="trigger"
      type="button"
      class="control"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-controls="`${uid}-list`"
      :aria-activedescendant="isOpen && active >= 0 ? optionId(active) : undefined"
      :aria-label="ariaLabel"
      @click="isOpen ? close() : openList()"
      @keydown="onKeydown"
    >
      <img v-if="selected?.icon" :src="selected.icon" alt="" width="22" height="22" class="icon" />
      <span class="label">{{ selected?.label }}</span>
      <svg class="chevron" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true">
        <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="pop">
      <ul
        v-if="isOpen"
        :id="`${uid}-list`"
        ref="list"
        role="listbox"
        tabindex="-1"
        class="list"
        :class="{ up: dropUp }"
        :aria-label="ariaLabel"
      >
        <li
          v-for="(option, i) in options"
          :id="optionId(i)"
          :key="option.value"
          role="option"
          class="option"
          :aria-selected="option.value === model"
          :data-active="i === active"
          @pointerdown.prevent
          @pointermove="active = i"
          @click="choose(i)"
        >
          <img v-if="option.icon" :src="option.icon" alt="" width="22" height="22" class="icon" />
          <span class="option-label">{{ option.label }}</span>
          <svg v-if="option.value === model" class="check" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.ui-select { position: relative; width: 100%; min-width: 0; }

.control {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  background: var(--field-bg);
  border: 1px solid var(--field-border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font: 500 15px/1.2 var(--font);
  padding: 13px 36px 13px 14px;
  cursor: pointer;
  box-shadow: inset 0 1px 2px rgba(20, 10, 70, 0.10);
  transition: border-color 0.15s, box-shadow 0.15s, background 0.3s;
}

.control:hover { border-color: var(--border-hover); }

.control:focus-visible,
.open .control {
  outline: none;
  border-color: var(--accent-strong);
  box-shadow: inset 0 1px 2px rgba(20, 10, 70, 0.10), 0 0 0 3px var(--accent-glow);
}

.label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.icon { flex-shrink: 0; filter: var(--icon-filter, invert(1)); }

.chevron {
  position: absolute;
  top: 50%;
  right: 14px;
  margin-top: -4px;
  color: var(--text-faint);
  pointer-events: none;
  transition: transform 0.2s ease, color 0.15s;
}

.control:hover .chevron { color: var(--text-dim); }
.open .chevron { transform: rotate(180deg); color: var(--accent); }

/* ---------- Выпадающий список ---------- */
.list {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  z-index: 40;
  max-height: 320px;
  margin: 0;
  padding: 6px;
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
  background: var(--pop-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow:
    inset 0 1px 0 var(--glass-hi),
    0 0 0 1px var(--accent-glow),
    0 28px 60px -18px rgba(0, 0, 0, 0.7);
  transform-origin: top center;
}

.list.up {
  top: auto;
  bottom: calc(100% + 8px);
  transform-origin: bottom center;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--text-dim);
  font-size: 15px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}

.option-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.option[data-active='true'] {
  background: var(--accent-glow);
  color: var(--text);
}

.option[aria-selected='true'] { color: var(--text); font-weight: 600; }

.check { flex-shrink: 0; color: var(--accent); }

@media (max-width: 480px) {
  .control { padding: 13px 26px 13px 10px; gap: 8px; font-size: 14px; }
  .chevron { right: 9px; }
}

.pop-enter-active, .pop-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
.list.up.pop-enter-from, .list.up.pop-leave-to { transform: translateY(6px) scale(0.98); }
</style>
