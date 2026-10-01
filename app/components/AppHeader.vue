<template>
  <header class="header">
    <div class="container bar glass">
      <a href="#top" class="brand" aria-label="Astro — в начало">
        <span class="brand-mark" aria-hidden="true">✦</span>
        Astro
      </a>

      <nav class="nav" aria-label="Разделы">
        <a href="#calculator">Калькулятор</a>
        <a href="#how">Как это работает</a>
      </nav>

      <div class="actions">
        <UiButton href="#calculator" class="cta">Рассчитать</UiButton>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding-top: 14px;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px 10px 20px;
  border-radius: 999px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  font-weight: 650;
  font-size: 18px;
  letter-spacing: -0.01em;
  text-decoration: none;
}

.brand-mark {
  color: var(--gold);
  text-shadow: 0 0 14px var(--gold-glow);
}

.nav { display: flex; gap: 28px; }

.nav a {
  color: var(--text-dim);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;
}

.nav a:hover { color: var(--text); }

.actions { display: flex; align-items: center; gap: 10px; }

@media (max-width: 720px) {
  .nav { display: none; }
  .cta { display: none; }
}
</style>
