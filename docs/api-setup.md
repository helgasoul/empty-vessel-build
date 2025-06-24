# 🌸 API Setup - Enhanced Gail Calculator

Настройка API для платформы женского здоровья **Prevent** с Enhanced Gail Calculator.

## 🎯 Что было создано в Пункте 2

### ✅ Файлы API конфигурации:

1. **`src/config/api.ts`** - Конфигурация API endpoints и настроек
2. **`src/lib/api/http-client.ts`** - HTTP клиент с заботливым UX
3. **`src/services/enhanced-gail-calculator.service.ts`** - Специализированный сервис
4. **`.env.example`** - Шаблон переменных окружения

### 🔧 Основные возможности:

- 🧮 **Enhanced Gail Calculator API** - расширенная модель рисков
- 🧬 **Генетический анализ** - интеграция с Genotek, Genetico
- 🤖 **ИИ-анализ** - медицинские изображения и документы
- 📱 **Носимые устройства** - Apple Health, Google Fit, Oura, Whoop
- 🌍 **Экологические факторы** - качество воздуха, УФ-излучение
- 💖 **Заботливый UX** - понятные сообщения об ошибках
- 🔒 **Безопасность** - HIPAA/GDPR compliance, шифрование

## 🚀 Настройка для разработки

### 1. Установка переменных окружения

```bash
# Скопируйте шаблон
cp .env.example .env.local

# Заполните необходимые ключи в .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
OPENAI_API_KEY=your_openai_key
GENOTEK_API_KEY=your_genotek_key
# ... другие ключи
```

### 2. Использование в компонентах

```typescript
import { enhancedGailService } from '@/services/enhanced-gail-calculator.service';
import { apiClient } from '@/lib/api/http-client';

// Пример использования Enhanced Gail Calculator
const calculateRisk = async (patientData) => {
  try {
    const result = await enhancedGailService.calculateRisk(patientData);
    console.log('💕 Результат анализа:', result.data);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
};

// Пример загрузки генетических данных
const uploadGenetics = async (file: File, userId: string) => {
  const result = await enhancedGailService.uploadGeneticData(
    file, 
    userId, 
    'genotek'
  );
  return result;
};
```

### 3. Типы данных (TypeScript)

```typescript
import type {
  GailCalculatorInput,
  GailCalculatorResult,
  EnhancedRiskAssessment,
  GeneticRiskFactors,
} from '@/types/gail-calculator';

// Все типы уже созданы и готовы к использованию
```

## 🏥 Медицинские интеграции

### Поддерживаемые сервисы:

- **Генетические лаборатории**: Genotek, Genetico, 23andMe
- **Носимые устройства**: Apple Health, Google Fit, Fitbit, Oura, Whoop
- **ИИ-анализ**: OpenAI, Anthropic, Google Cloud Healthcare
- **Приложения для женщин**: Clue, Flo, Glow, Natural Cycles
- **Экологические данные**: OpenWeather, Air Quality APIs

### Пример конфигурации:

```typescript
// Автоматическая настройка на основе окружения
const apiUrl = getApiUrl('GAIL_CALCULATOR'); 
// Development: http://localhost:3001/api/v1/gail-calculator
// Production: https://api.prevent-health.com/v1/gail-calculator

// Заботливые заголовки
const headers = getAuthHeaders(userToken);
// Включает: Content-Type, Authorization, X-Platform, X-Version
```

## 🔒 Безопасность и соответствие

### HIPAA/GDPR Compliance:

- ✅ Шифрование медицинских данных
- ✅ Аудит всех действий 
- ✅ Локализация данных в ЕС
- ✅ Контроль доступа
- ✅ Анонимизация для исследований

### Обработка ошибок:

```typescript
// Заботливые сообщения вместо технических ошибок
const friendlyMessages = {
  400: 'Пожалуйста, проверьте введенные данные',
  401: 'Необходимо войти в систему',
  403: 'У вас нет доступа к этой функции',
  500: 'Произошла ошибка на сервере, мы уже работаем над её устранением',
};
```

## 📊 Мониторинг и аналитика

### Встроенные возможности:

- 📈 **Трекинг производительности** - время ответа API
- 🐛 **Отчеты об ошибках** - автоматическая отправка в Sentry
- 📋 **Логирование запросов** - детальные логи для разработки
- 🔄 **Retry логика** - автоматические повторы с экспоненциальной задержкой

## 🚦 Следующие шаги

### Готово для Пункта 3: React Hooks

Теперь можно создавать:

1. **`useGailCalculator`** - хук для расчета рисков
2. **`useGeneticData`** - хук для работы с генетическими данными  
3. **`useWearableSync`** - хук для синхронизации с устройствами
4. **`usePersonalizedRecommendations`** - хук для рекомендаций

### Пример использования:

```typescript
// В компоненте
const { calculateRisk, loading, error } = useGailCalculator();
const { uploadGenetics } = useGeneticData();
const { syncDevice } = useWearableSync();

// Простое использование
const handleCalculate = async () => {
  const result = await calculateRisk(formData);
  // Автоматический loading state и error handling
};
```

## 💖 Философия платформы

**Prevent** создан с заботой о женщинах:

- **Теплые цвета** - нежно-розовый, лавандовый, коралловый
- **Понятные сообщения** - без медицинского жаргона
- **Безопасность данных** - полное соответствие стандартам
- **Персонализация** - учет индивидуальных особенностей
- **Поддержка** - доступная помощь на каждом шаге

---

## 🔗 Полезные ссылки

- [Типы данных](/src/types/gail-calculator.ts)
- [Медицинские константы](/src/lib/constants/medical-constants.ts)
- [UI константы](/src/lib/constants/ui-constants.ts)
- [Документация API](https://api.prevent-health.com/docs)

**Создано с 💖 для женского здоровья**