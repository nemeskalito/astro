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
- `theme.json` (необязательно): `{ "adaptive": true }` — для одноцветных чёрных иконок: в тёмной теме они
  автоматически инвертируются в белые. Без этого файла иконки показываются как есть (цветные).

## theme.json

```json
{ "adaptive": true, "scale": { "zodiac": 1.3, "planets": 1 } }
```

- `adaptive` — в тёмной теме любые иконки темы становятся чисто белыми (для одноцветных знаков).
  Для цветных тем (как monkik) не включайте: знаки превратятся в белые силуэты.
- `scale` — множитель размера иконок группы (0.5–3). Нужен, если у знака большие пустые поля вокруг.
