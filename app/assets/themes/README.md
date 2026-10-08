# Темы иконок

Каждая папка здесь — отдельная тема. Название папки = название в списке «Тема иконок».
Добавить тему: создайте папку, положите иконки, перезагрузите страницу. Код менять не нужно.

```
themes/
  my-theme/
    theme.json          (необязательно)
    planets/
      sun.webp  moon.webp  mercury.webp  venus.webp
      mars.webp  jupiter.webp  saturn.webp
    zodiac/
      aries.webp  taurus.webp  gemini.webp  cancer.webp  leo.webp  virgo.webp
      libra.webp  scorpio.webp  sagittarius.webp  capricorn.webp  aquarius.webp  pisces.webp
```

- Форматы: webp, png, svg, jpg. Имена файлов — строчными, как выше.
- Если какой-то иконки в теме нет, подставится иконка из `default`.
- `theme.json`: `{ "adaptive": true }` — для одноцветных чёрных иконок: в тёмной теме они
  автоматически инвертируются в белые. Без этого файла иконки показываются как есть (цветные).
