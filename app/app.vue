<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'ru' },
  title: 'Астрологический калькулятор',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap'
    }
  ],
  // Тема ставится до первой отрисовки — без вспышки неверной темы
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
  <div class="toggle-slot"><ThemeToggle /></div>
  <NuxtPage />
</template>

<style>
.toggle-slot {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 50;
}
</style>
