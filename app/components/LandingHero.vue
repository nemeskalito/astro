<template>
  <section id="top" class="hero container">
    <div class="copy">
      <h1>Положение планеты на любую дату</h1>
      <p class="lead">
        Укажите, где стояла планета в момент рождения, и выберите дату события.
        Калькулятор покажет знак зодиака и точный градус.
      </p>
      <div class="cta-row">
        <UiButton href="#calculator" size="lg">Рассчитать положение</UiButton>
        <UiButton href="#how" variant="ghost" size="lg">Как это работает</UiButton>
      </div>
      <ul class="facts">
        <li>7 планет</li>
        <li>12 знаков</li>
        <li>Точность до секунды дуги</li>
      </ul>
    </div>

    <ZodiacRing />
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  align-items: center;
  gap: 48px;
  padding-block: 64px 40px;
}

h1 {
  font-size: clamp(38px, 6.4vw, 68px);
  font-weight: 650;
  line-height: 1.04;
  letter-spacing: -0.035em;
  text-wrap: balance;
  margin-bottom: 20px;
}

.lead {
  max-width: 480px;
  font-size: clamp(16px, 2vw, 19px);
  color: var(--text-dim);
  margin-bottom: 32px;
}

.cta-row { display: flex; flex-wrap: wrap; gap: 14px; }

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  list-style: none;
  padding: 0;
  margin: 36px 0 0;
  color: var(--text-faint);
  font-size: 14px;
}

@media (min-width: 900px) {
  .hero { grid-template-columns: 1.1fr 0.9fr; padding-block: 88px 56px; }
}
</style>
