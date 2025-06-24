/**
 * API Configuration для платформы женского здоровья Prevent
 * 
 * Конфигурация для подключения к backend сервисам:
 * - Enhanced Gail Calculator
 * - Генетическое тестирование
 * - ИИ-анализ медицинских данных
 * - Интеграция с носимыми устройствами
 */

export const API_CONFIG = {
  // Базовые настройки API
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.prevent-health.com',
  VERSION: 'v1',
  TIMEOUT: 30000, // 30 секунд
  
  // Эндпоинты для Enhanced Gail Calculator
  ENDPOINTS: {
    // 🧮 Калькулятор рисков
    GAIL_CALCULATOR: '/gail-calculator',
    RISK_ASSESSMENT: '/risk-assessment',
    MULTI_FACTOR_ANALYSIS: '/multi-factor-analysis',
    
    // 🧬 Генетические данные
    GENETIC_DATA: '/genetic-data',
    GENETIC_UPLOAD: '/genetic-upload',
    GENETIC_ANALYSIS: '/genetic-analysis',
    
    // 🤖 ИИ сервисы
    AI_ANALYSIS: '/ai-analysis',
    MEDICAL_IMAGE_ANALYSIS: '/medical-images/analysis',
    DOCUMENT_ANALYSIS: '/documents/analysis',
    
    // 📊 Персональные данные
    USER_PROFILE: '/user/profile',
    HEALTH_METRICS: '/user/health-metrics',
    MEDICAL_HISTORY: '/user/medical-history',
    
    // 🔄 Интеграции
    WEARABLES: '/integrations/wearables',
    APPLE_HEALTH: '/integrations/apple-health',
    GOOGLE_FIT: '/integrations/google-fit',
    
    // 📈 Мониторинг и рекомендации
    RECOMMENDATIONS: '/recommendations',
    LIFESTYLE_PLAN: '/lifestyle-plan',
    MONITORING: '/monitoring',
    
    // 🔐 Аутентификация
    AUTH: '/auth',
    REFRESH_TOKEN: '/auth/refresh',
  },
  
  // Заголовки по умолчанию
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Platform': 'prevent-health-web',
    'X-Version': '1.0.0',
  },
  
  // Настройки безопасности
  SECURITY: {
    // Шифрование медицинских данных
    ENCRYPTION_ENABLED: true,
    
    // HIPAA compliance
    HIPAA_COMPLIANCE: true,
    
    // Локализация данных (GDPR)
    DATA_RESIDENCY: 'EU',
    
    // Аудит действий
    AUDIT_ENABLED: true,
  },
  
  // Настройки для различных окружений
  ENVIRONMENTS: {
    development: {
      BASE_URL: 'http://localhost:3001/api',
      DEBUG: true,
      MOCK_DATA: true,
    },
    staging: {
      BASE_URL: 'https://staging-api.prevent-health.com',
      DEBUG: true,
      MOCK_DATA: false,
    },
    production: {
      BASE_URL: 'https://api.prevent-health.com',
      DEBUG: false,
      MOCK_DATA: false,
    },
  },
  
  // Настройки кэширования
  CACHE: {
    // Кэш для статических данных (факторы риска, референсные значения)
    STATIC_DATA_TTL: 24 * 60 * 60 * 1000, // 24 часа
    
    // Кэш для пользовательских данных
    USER_DATA_TTL: 5 * 60 * 1000, // 5 минут
    
    // Кэш для результатов ИИ-анализа
    AI_RESULTS_TTL: 60 * 60 * 1000, // 1 час
  },
  
  // Настройки retry логики
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000, // 1 секунда
    MAX_DELAY: 10000, // 10 секунд
    EXPONENTIAL_BACKOFF: true,
  },
  
  // Мониторинг и аналитика
  MONITORING: {
    PERFORMANCE_TRACKING: true,
    ERROR_REPORTING: true,
    USER_ANALYTICS: true,
  },
} as const;

// Типы для TypeScript
export type APIEndpoint = keyof typeof API_CONFIG.ENDPOINTS;
export type Environment = keyof typeof API_CONFIG.ENVIRONMENTS;

// Хелпер для получения полного URL
export const getApiUrl = (endpoint: APIEndpoint, environment?: Environment) => {
  const env = environment || (process.env.NODE_ENV as Environment) || 'development';
  const baseUrl = API_CONFIG.ENVIRONMENTS[env]?.BASE_URL || API_CONFIG.BASE_URL;
  return `${baseUrl}/${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

// Хелпер для получения заголовков с аутентификацией
export const getAuthHeaders = (token?: string) => ({
  ...API_CONFIG.DEFAULT_HEADERS,
  ...(token && { Authorization: `Bearer ${token}` }),
});

// Валидация конфигурации
export const validateApiConfig = () => {
  const requiredVars = [
    'NEXT_PUBLIC_API_BASE_URL',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Отсутствуют переменные окружения: ${missingVars.join(', ')}`);
  }
  
  return missingVars.length === 0;
};
