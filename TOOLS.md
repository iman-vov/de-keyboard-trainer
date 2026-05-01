# de-keyboard-trainer — Інструменти і технології

## Core залежності

| Інструмент | Версія | Призначення |
|---|---|---|
| [Phaser 3](https://phaser.io/) | 3.80+ | 2D ігровий рушій (рендер, спрайти, фізика, аудіо) |
| [Vite](https://vitejs.dev/) | 5.x | Dev server + bundler |
| JavaScript | ES2022 | Мова розробки (без TypeScript) |

**Чому Phaser 3, не Three.js:**
Three.js — 3D рушій, надлишок для 2D гри. Phaser 3 має вбудовану підтримку
спрайт-аркад, групових об'єктів, анімацій, фізики, аудіо — все що потрібно.

---

## Графіка

| Інструмент | Використання | Посилання |
|---|---|---|
| ChatGPT DALL-E 3 | Персонажі, фони планет, ігрові об'єкти | chat.openai.com |
| kenney.nl | UI кнопки, зірки, іконки, шрифти | kenney.nl/assets |
| remove.bg | Видалення фону зі згенерованих спрайтів | remove.bg |
| Piskel | Дрібна правка пікселів (опційно) | piskelapp.com |

**Workflow для спрайтів:**
1. Генерувати в DALL-E 3 з промптом із PROJECT.md
2. Видалити фон через remove.bg
3. Нарізати sprite sheet у будь-якому редакторі (навіть Paint.NET)
4. Покласти в `/assets/characters/` або `/assets/backgrounds/`

---

## Звук

| Інструмент | Використання | Посилання |
|---|---|---|
| freesound.org | Безкоштовні SFX (CC0/CC-BY ліцензія) | freesound.org |
| Phaser Audio | Вбудований звуковий рушій | — |

**Які звуки потрібні:**
- `sword_swing.mp3` — удар мечем (правильна клавіша)
- `sword_miss.mp3` або `stumble.mp3` — промах
- `level_complete.mp3` — завершення рівня
- `planet_unlock.mp3` — розблокування планети
- `bg_tatooine.mp3`, `bg_hoth.mp3` тощо — фонова музика

> Пошук на freesound.org: "lightsaber swing", "lightsaber hum", "jedi"
> Або генерувати аналоги — уникати точних копій зі Star Wars через авторські права.

---

## Деплой

| Інструмент | Використання |
|---|---|
| GitHub | Репозиторій коду |
| GitHub Pages | Безкоштовний хостинг (статичний сайт) |
| GitHub Actions | Автодеплой: push → build → deploy |

**GitHub Actions конфіг** (`/.github/workflows/deploy.yml`):
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Структура директорій

```
de-keyboard-trainer/
├── src/
│   ├── scenes/
│   │   ├── BootScene.js        # завантаження всіх ассетів
│   │   ├── MenuScene.js        # головне меню + карта планет
│   │   ├── GameScene.js        # основна ігрова сцена
│   │   └── ResultScene.js      # екран результатів (зірки)
│   ├── objects/
│   │   ├── Jedi.js             # персонаж-джедай (стани, анімації)
│   │   ├── FallingLetter.js    # падаюча буква (Phaser GameObject)
│   │   └── KeyboardDisplay.js  # екранна QWERTZ клавіатура
│   ├── data/
│   │   ├── levels.js           # конфіг рівнів: планета, швидкість, набір літер
│   │   ├── qwertz.js           # German QWERTZ layout map
│   │   └── locales/
│   │       ├── de.json         # Deutsch (primary)
│   │       ├── ru.json         # Русский
│   │       └── uk.json         # Українська
│   ├── utils/
│   │   ├── progress.js         # localStorage: read/write/reset
│   │   └── i18n.js             # локалізація: t('key')
│   └── main.js                 # Phaser.Game config + scene list
├── assets/
│   ├── characters/
│   │   └── jedi_spritesheet.png
│   ├── backgrounds/
│   │   ├── coruscant.png
│   │   ├── tatooine.png
│   │   ├── hoth.png
│   │   ├── dagobah.png
│   │   └── endor.png
│   ├── ui/
│   │   ├── buttons/
│   │   ├── stars/
│   │   └── letter_tile.png
│   └── sounds/
│       ├── sword_swing.mp3
│       ├── stumble.mp3
│       ├── level_complete.mp3
│       └── bg_tatooine.mp3
├── index.html
├── vite.config.js
├── package.json
├── CLAUDE.md
├── PROJECT.md
└── TOOLS.md
```

---

## German QWERTZ Layout (джерело правди)

```
Ряд 0 (цифри):  ^ 1 2 3 4 5 6 7 8 9 0 ß ´
Ряд 1:          q w e r t z u i o p ü +
Ряд 2 (home):   a s d f g h j k l ö ä #
Ряд 3:          < y x c v b n m , . -
```

**Порівняння QWERTZ vs QWERTY:**
- `y` і `z` — переставлені місцями
- Додаткові клавіші: `ä`, `ö`, `ü`, `ß`
- Деякі символи на інших позиціях

**Порядок навчання (від простого):**
1. Home row: `a s d f g h j k l`
2. Top row: `q w e r t z u i o p`
3. Bottom row: `y x c v b n m`
4. Спеціальні: `ä ö ü ß`
5. Цифри та символи

---

## Команди розробки

```bash
# Встановлення
npm install

# Dev server (localhost:5173)
npm run dev

# Build для деплою
npm run build

# Preview build
npm run preview
```
