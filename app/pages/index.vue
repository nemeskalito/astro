<template>
  <main class="shell">
    <CalculatorSection />
  </main>
</template>

<style scoped>
.shell {
  min-height: 100dvh;
  display: grid;
  align-items: start;
  justify-items: center;
  /* Карточка стоит выше геометрического центра: отступ сверху зависит от высоты экрана */
  padding: clamp(28px, 7vh, 80px) 16px 40px;
}

/* На узких экранах сверху справа лежит кнопка темы — оставляем под неё место */
@media (max-width: 1060px) {
  .shell { padding-top: 76px; }
}
</style>
