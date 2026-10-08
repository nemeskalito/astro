<template>
  <section id="how" class="section container">
    <div class="section-head">
      <h2>Как это работает</h2>
      <p>Три шага — и результат готов. Дату рождения и дату события можно менять сколько угодно раз.</p>
    </div>

    <ol class="steps glass">
      <li>
        <span class="num">1</span>
        <h3>Выберите метод</h3>
        <p>Прямой метод сдвигает планету вперёд от исходного градуса, обратный — назад.</p>
      </li>
      <li>
        <span class="num">2</span>
        <h3>Введите данные</h3>
        <p>Две даты, планета, знак и градус её положения в момент рождения.</p>
      </li>
      <li>
        <span class="num">3</span>
        <h3>Получите положение</h3>
        <p>Новый знак и градус на дату события — в градусах, минутах и секундах.</p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.steps {
  display: grid;
  list-style: none;
  margin: 0;
  padding: 8px;
}

li { padding: 24px; }
li + li { border-top: 1px solid var(--glass-border); }

.num {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-bottom: 16px;
  border-radius: 50%;
  font-weight: 650;
  color: var(--btn-text);
  background-image: var(--btn-bg-image);
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 0 1px var(--btn-edge), inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 8px 18px -8px var(--btn-shadow);
}

h3 { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
p { color: var(--text-dim); font-size: 15px; }

@media (min-width: 800px) {
  .steps { grid-template-columns: repeat(3, 1fr); }
  li + li { border-top: 0; border-left: 1px solid var(--glass-border); }
}
</style>
