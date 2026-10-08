<script setup lang="ts">
const { adaptive } = useIcons()

useHead({
  htmlAttrs: {
    lang: 'ru',
    // Режим фильтра иконок выбранной темы (см. main.css)
    'data-icons': computed(() => (adaptive.value ? 'adaptive' : 'fixed'))
  },
  title: 'Астрологический калькулятор',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&display=swap'
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
