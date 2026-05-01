# de-keyboard-trainer — Jedi Training Academy

## Концепція
Юний джедай (хлопчик 7 років) тренується на різних планетах Зоряних Воєн.
Букви летять до нього у вигляді голограм, дроїдів, енергетичних блоків.
Він розбиває їх світловим мечем, натискаючи правильну клавішу на клавіатурі.

**Головний принцип:** гравець завжди відчуває успіх. Немає провалу — є прогрес.

---

## Планети та рівні

| Планета | Тема | Механіка | Складність |
|---------|------|----------|------------|
| Корусант | Академія джедаїв (туторіал) | Знайди клавішу за підсвіткою | ★☆☆ |
| Татуін | Пустеля, два сонця | Letter Rain, 1 буква, повільно | ★★☆ |
| Хот | Крижана планета | Letter Rain, трохи швидше | ★★☆ |
| Дагоба | Йода тренує | 2 букви одночасно | ★★★ |
| Ендор | Ліс евоків | Прості слова (3–4 букви) | ★★★ |
| Зірка Смерті | Фінальний бос | Змішані рівні, спецсимволи | ★★★ |

---

## Фаза 0: Ініціалізація проєкту
**Тривалість: 1–2 дні**

- [ ] `npm create vite@latest` + встановлення Phaser 3
- [ ] Структура директорій (src/, assets/, data/)
- [ ] Базова конфігурація Phaser (GameConfig, responsive canvas)
- [ ] Заглушки для 3 сцен: Boot, Menu, Game
- [ ] Підключення localStorage utils
- [ ] Підключення i18n (DE/RU/UK JSON)
- [ ] QWERTZ layout map (`src/data/qwertz.js`)
- [ ] Деплой на GitHub Pages (автодеплой через Actions)

**Результат:** порожня гра запускається в браузері, деплоїться на GitHub Pages.

---

## Фаза 1: Клавіатурний дисплей (Корусант)
**Тривалість: 2–3 дні**

- [ ] Відображення QWERTZ клавіатури внизу екрана
- [ ] Підсвітка клавіші при фізичному натисканні
- [ ] Режим "Знайди клавішу": показується буква → гравець натискає → підсвітка підказує
- [ ] Правильно → джедай робить удар мечем (анімація + звук)
- [ ] Неправильно → підсвітка правильної клавіші посилюється, ніякого покарання
- [ ] Рівні: спочатку ряд ASDFGHJKL, потім QWERTZUIOP, потім нижній ряд
- [ ] Фон: Корусант (місто, академія)

**Результат:** дитина може знайти будь-яку клавішу QWERTZ з підказкою.

---

## Фаза 2: Letter Rain — базова (Татуін)
**Тривалість: 3–4 дні**

- [ ] Букви падають зверху (1 за раз), час падіння 4–5 секунд
- [ ] Правильна клавіша → удар мечем → буква знищена (ефект частинок + звук)
- [ ] Пропущена буква → персонаж спотикається, секундна пауза, гра йде далі
- [ ] Рівень = 10 букв, прогрес-бар зверху
- [ ] Зірки 1–3 в кінці (≥9/10 = 3★, ≥6/10 = 2★, інше = 1★ — завжди ≥1)
- [ ] Екранна клавіатура завжди видима, підсвітка потрібної клавіші
- [ ] Фон: Татуін (пустеля, два сонця, Jawas вдалині)

**Результат:** основна ігрова механіка працює.

---

## Фаза 3: Прогрес і навігація
**Тривалість: 2 дні**

- [ ] Карта планет (вибір рівня), планети відкриваються по черзі
- [ ] Збереження: зірки, відкриті планети, поточна мова
- [ ] Анімація розблокування нової планети
- [ ] Кнопка вибору мови на головному меню

**Результат:** дитина бачить свій прогрес і куди рухатись далі.

---

## Фаза 4: Додаткові планети
**Тривалість: 4–5 днів**

- [ ] Хот: швидше падіння (3 секунди замість 4–5), сніговий ефект
- [ ] Дагоба: 2 букви одночасно, Йода як тренер (репліки на DE)
- [ ] Ендор: прості слова 3–4 букви падають по одній букві
- [ ] Зірка Смерті: фінальний рівень, ä ö ü ß обов'язково включені
- [ ] Кожна планета: унікальний фон + тематичні "вороги" як носії букв

**Результат:** повний навчальний маршрут від A до Ü.

---

## Фаза 5: Полірування
**Тривалість: 3–4 дні**

- [ ] Звуки: удар мечем, пропуск, перемога, фонова музика (Star Wars ambient)
- [ ] Частинкові ефекти при знищенні букви
- [ ] Анімація перемоги (конфеті, зірки)
- [ ] Екран привітання з іменем (без реєстрації — просто localStorage name)
- [ ] Адаптивність під планшет (мінімум 768px)
- [ ] Тестування з дитиною, корекція складності

**Результат:** гра готова до постійного використання.

---

## Фаза 6: Графіка (паралельно з Фазами 1–4)

### Що генерувати в ChatGPT DALL-E 3

**Персонаж — джедай (хлопчик 7 років)**
```
A cute 7-year-old boy Jedi in Star Wars style, short brown hair,
wearing tan Jedi robes, holding a glowing blue lightsaber.
2D game sprite, flat cartoon style, white outline, transparent PNG background.
4 poses on one sheet: [1] idle standing [2] lightsaber swing [3] stumble/trip [4] victory arms up.
Each pose 200x300px. Child-friendly, bright and friendly look.
```

**Фони планет (1920x600px, side-scrolling layer)**
```
Tatooine:
"Tatooine desert landscape for 2D side-scrolling game, Star Wars style,
sandy dunes, twin suns, distant moisture vaporators and structures.
Flat cartoon illustration, 1920x600, vibrant warm colors, child-friendly."

Hoth:
"Hoth ice planet for 2D side-scrolling game, Star Wars style, snow fields,
ice formations, distant Echo Base entrance, AT-AT silhouette on horizon.
Flat cartoon, 1920x600, blue-white palette, child-friendly."

Dagobah:
"Dagobah swamp planet for 2D side-scrolling game, Star Wars style,
dense jungle, gnarled trees, fog, Yoda's hut in background.
Flat cartoon, 1920x600, dark greens, moody but not scary."

Endor:
"Endor forest moon for 2D side-scrolling game, Star Wars style,
giant redwood trees, Ewok village platforms above, warm sunlight rays.
Flat cartoon, 1920x600, warm greens and browns."

Coruscant:
"Coruscant city-planet for 2D side-scrolling game, Star Wars style,
futuristic skyscrapers, flying vehicles, Jedi Temple in background.
Flat cartoon, 1920x600, blue-purple night sky, glowing lights."
```

**Падаюча буква (Letter tile)**
```
A glowing blue holographic letter tile for a Star Wars game,
hexagonal or rounded square shape, neon blue glow effect,
transparent center showing the letter. PNG, 120x120px, transparent background.
Style: sci-fi hologram from Star Wars universe.
```

### Що брати з kenney.nl
- UI кнопки та рамки: [kenney.nl/assets/ui-pack](https://kenney.nl/assets/ui-pack)
- Зірки для рейтингу: [kenney.nl/assets/ui-pack-space](https://kenney.nl/assets/ui-pack-space)
- Іконки та шрифти: [kenney.nl/assets/kenny-fonts](https://kenney.nl/assets/kenney-fonts)

---

## Ключові рішення по UX для дитини з труднощами моторики

1. **Широке вікно реакції** — літера летить 4–5 сек (не 1–2)
2. **Підсвітка клавіші** — завжди видно куди тягнутись
3. **Одна буква за раз** (перші 2 планети)
4. **Немає штрафного часу** — промах не прискорює гру
5. **Зірки не скидаються** — зберігається найкращий результат
6. **Пауза будь-коли** — кнопка пауза велика і завжди доступна
7. **Звукове підтвердження** — дитина чує успіх навіть без погляду на екран
