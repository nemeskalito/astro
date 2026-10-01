<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'ru' },
  title: 'Астрологический калькулятор',
  meta: [
    { name: 'description', content: 'Рассчитайте положение планеты на нужную дату: прямым или обратным методом.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap'
    }
  ],
  // Ставим тему до первой отрисовки — без вспышки тёмной темы у пользователей светлой
  script: [
    {
      innerHTML: `(function(){try{var t=localStorage.getItem('astro-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
      tagPosition: 'head'
    }
  ]
})
</script>

<template>
  <div class="sky" aria-hidden="true" />
  <AppHeader />
  <NuxtPage />
  <AppFooter />
</template>
