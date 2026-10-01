<script setup lang="ts">
import { ZODIAC, ZODIAC_ICONS } from '~/types/astro'
</script>

<template>
  <div class="ring-wrap" aria-hidden="true">
    <div class="ring">
      <div v-for="(sign, i) in ZODIAC" :key="sign" class="slot" :style="{ '--i': i }">
        <div class="upright">
          <div class="counter">
            <span class="chip">
              <img :src="ZODIAC_ICONS[sign]" alt="" width="22" height="22" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="orbit" />
    <div class="orb" />
  </div>
</template>

<style scoped>
.ring-wrap {
  --size: min(86vw, 460px);
  position: relative;
  width: var(--size);
  aspect-ratio: 1;
  margin-inline: auto;
}

.ring, .orbit {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.ring { animation: spin 140s linear infinite; }

/* Тонкое кольцо с градиентной окантовкой */
.ring::before {
  content: '';
  position: absolute;
  inset: 22px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  box-shadow: 0 0 60px -10px var(--accent-glow), inset 0 0 60px -20px var(--accent-glow);
}

.orbit {
  inset: 24%;
  border: 1px dashed var(--glass-border);
}

.slot { position: absolute; inset: 0; transform: rotate(calc(var(--i) * 30deg)); }

.upright {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) rotate(calc(var(--i) * -30deg));
}

/* Контр-вращение: значки остаются «вертикальными» */
.counter { animation: spin 140s linear infinite reverse; }

.chip {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hi), 0 8px 20px -10px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.chip img { filter: var(--icon-filter, invert(1)); }

/* Центральная глянцевая «планета» */
.orb {
  position: absolute;
  inset: 36%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 26%, rgba(255, 255, 255, 0.95) 0 6%, rgba(255, 255, 255, 0) 24%),
    radial-gradient(circle at 40% 35%, #ffe3a3, #f0c878 45%, #b9822f 100%);
  box-shadow:
    inset -10px -14px 26px rgba(90, 50, 0, 0.45),
    0 0 70px 6px var(--gold-glow),
    0 30px 50px -20px rgba(0, 0, 0, 0.5);
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 480px) {
  .chip { width: 38px; height: 38px; }
  .chip img { width: 18px; height: 18px; }
}
</style>
