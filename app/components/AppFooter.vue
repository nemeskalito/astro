<template>
  <footer class="footer">
    <div class="container inner">
      <span class="brand"><span aria-hidden="true">✦</span> Astro</span>
      <p>Расчёты выполняются прямо в браузере — данные никуда не отправляются.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer { padding: 40px 0 48px; border-top: 1px solid var(--glass-border); }

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 32px;
  flex-wrap: wrap;
  color: var(--text-faint);
  font-size: 14px;
}

.brand { color: var(--text-dim); font-weight: 600; }
.brand span { color: var(--gold); }
</style>
