# NeoBank MVP - Frontend

Современное веб-приложение, стилизованное под мобильный банк (как Monobank).

## 📁 Структура проекта

```
neobank/
├── public/
│   └── index.html           # HTML точка входа
├── src/
│   ├── styles/
│   │   └── globals.css      # Глобальные стили, CSS reset, анимации
│   ├── components/
│   │   ├── BalanceCard/     # Карточка баланса
│   │   │   ├── BalanceCard.js
│   │   │   └── BalanceCard.css
│   │   ├── ActionButtons/   # Кнопки действий
│   │   │   ├── ActionButtons.js
│   │   │   └── ActionButtons.css
│   │   ├── TransactionsList/# История операций
│   │   │   ├── TransactionsList.js
│   │   │   └── TransactionsList.css
│   │   └── BottomNavigation/# Нижняя навигация
│   │       ├── BottomNavigation.js
│   │       └── BottomNavigation.css
│   ├── App.js               # Главный компонент
│   ├── App.css              # Стили App
│   └── index.js             # Точка входа React
├── package.json
└── README.md
```

## 🚀 Как запустить

### 1. Установить зависимости
```bash
npm install
```

### 2. Запустить на локальном хосте
```bash
npm start
```

Приложение откроется на `http://localhost:3000`

### 3. Собрать для production
```bash
npm run build
```

## 🎨 Особенности

- ✅ Центрированный контейнер 390px (как мобильный телефон)
- ✅ Скругления и эффект "notch" как у телефона
- ✅ Тёмный градиентный фон (современный дизайн)
- ✅ Компонентная архитектура
- ✅ Гладкие анимации (fadeIn, slideInUp, hover-эффекты)
- ✅ Шрифт Inter с Google Fonts
- ✅ CSS reset и глобальные стили
- ✅ Адаптивный скролл с кастомным scrollbar
- ✅ Интерактивные элементы с переходами

## 📦 Компоненты

### BalanceCard
Отображает основной баланс счёта с информацией о карте.

### ActionButtons
Кнопки быстрых действий: Отправить, Получить, Пополнить, Больше.

### TransactionsList
История последних операций с иконками категорий и временем.

### BottomNavigation
Нижняя навигация с 4 основными разделами (Главная, Карты, Отправить, Профиль).

## 🎯 Следующие шаги

- [ ] Добавить backend интеграцию (Node.js + Express)
- [ ] Реализовать реальную логику переводов
- [ ] Добавить KYC форму
- [ ] Интегрировать базу данных (PostgreSQL)
- [ ] Добавить админку

## 📝 Лицензия

MIT
