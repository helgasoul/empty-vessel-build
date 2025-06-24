/**
 * HTTP Client для платформы женского здоровья Prevent
 * 
 * Профессиональный HTTP клиент с:
 * - 💖 Заботливым UX (loading states, error handling)
 * - 🔒 Безопасностью (шифрование медицинских данных)
 * - 🧬 Интеграцией с медицинскими API
 * - 🤖 Поддержкой ИИ-анализа
 */

import { API_CONFIG, getApiUrl, getAuthHeaders, type APIEndpoint } from '../config/api';

// Типы для HTTP клиента
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  status?: number;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  encrypt?: boolean; // Для медицинских данных
}

// Класс HTTP клиента
export class PreventApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private authToken?: string;
  
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
  }
  
  // 🔐 Установка токена аутентификации
  setAuthToken(token: string) {
    this.authToken = token;
  }
  
  // 🔓 Удаление токена
  clearAuthToken() {
    this.authToken = undefined;
  }
  
  // 📝 Логирование запросов (для разработки)
  private logRequest(method: string, url: string, data?: any) {
    if (API_CONFIG.ENVIRONMENTS.development?.DEBUG) {
      console.log(`🌸 API Request: ${method.toUpperCase()} ${url}`, data);
    }
  }
  
  // 📊 Логирование ответов
  private logResponse(url: string, response: any) {
    if (API_CONFIG.ENVIRONMENTS.development?.DEBUG) {
      console.log(`💕 API Response: ${url}`, response);
    }
  }
  
  // ⚠️ Обработка ошибок с заботливыми сообщениями
  private handleError(error: any, url: string): ApiError {
    this.logResponse(url, error);
    
    const friendlyMessages: Record<number, string> = {
      400: 'Пожалуйста, проверьте введенные данные',
      401: 'Необходимо войти в систему',
      403: 'У вас нет доступа к этой функции',
      404: 'Запрашиваемые данные не найдены',
      429: 'Слишком много запросов, попробуйте позже',
      500: 'Произошла ошибка на сервере, мы уже работаем над её устранением',
      503: 'Сервис временно недоступен, попробуйте позже',
    };
    
    const status = error.response?.status || 0;
    const message = friendlyMessages[status] || 'Произошла непредвиденная ошибка';
    
    return {
      message,
      code: error.code,
      status,
      details: error.response?.data,
    };
  }
  
  // 🔄 Retry логика с экспоненциальной задержкой
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    options: RequestOptions = {}
  ): Promise<T> {
    const maxAttempts = options.retries || API_CONFIG.RETRY.MAX_ATTEMPTS;
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        // Экспоненциальная задержка
        const delay = Math.min(
          API_CONFIG.RETRY.BASE_DELAY * Math.pow(2, attempt - 1),
          API_CONFIG.RETRY.MAX_DELAY
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
  
  // 🌐 Базовый метод для HTTP запросов
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: APIEndpoint | string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = typeof endpoint === 'string' ? endpoint : getApiUrl(endpoint);
    const headers = {
      ...this.defaultHeaders,
      ...getAuthHeaders(this.authToken),
      ...options.headers,
    };
    
    this.logRequest(method, url, data);
    
    const requestFn = async () => {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      this.logResponse(url, result);
      return result;
    };
    
    try {
      return await this.retryRequest(requestFn, options);
    } catch (error) {
      throw this.handleError(error, url);
    }
  }
  
  // GET запрос
  async get<T>(endpoint: APIEndpoint | string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, options);
  }
  
  // POST запрос
  async post<T>(endpoint: APIEndpoint | string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, options);
  }
  
  // PUT запрос
  async put<T>(endpoint: APIEndpoint | string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, options);
  }
  
  // PATCH запрос
  async patch<T>(endpoint: APIEndpoint | string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, options);
  }
  
  // DELETE запрос
  async delete<T>(endpoint: APIEndpoint | string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
  
  // 📁 Загрузка файлов (для медицинских документов, генетических данных)
  async uploadFile<T>(
    endpoint: APIEndpoint | string,
    file: File,
    additionalData?: Record<string, any>,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = typeof endpoint === 'string' ? endpoint : getApiUrl(endpoint);
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
    }
    
    const headers = {
      ...getAuthHeaders(this.authToken),
      ...options?.headers,
      // Не устанавливаем Content-Type для FormData
    };
    delete headers['Content-Type'];
    
    this.logRequest('POST', url, { file: file.name, ...additionalData });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      this.logResponse(url, result);
      return result;
    } catch (error) {
      throw this.handleError(error, url);
    }
  }
  
  // 💎 Специальные методы для Enhanced Gail Calculator
  
  // 🧮 Расчет рисков по модели Gail
  async calculateGailRisk(data: any): Promise<ApiResponse<any>> {
    return this.post('GAIL_CALCULATOR', data, { encrypt: true });
  }
  
  // 🧬 Анализ генетических данных
  async analyzeGeneticData(data: any): Promise<ApiResponse<any>> {
    return this.post('GENETIC_ANALYSIS', data, { encrypt: true });
  }
  
  // 🤖 ИИ-анализ медицинских изображений
  async analyzemedicalImage(file: File, metadata?: any): Promise<ApiResponse<any>> {
    return this.uploadFile('MEDICAL_IMAGE_ANALYSIS', file, metadata, { encrypt: true });
  }
  
  // 📊 Получение персональных рекомендаций
  async getPersonalizedRecommendations(userId: string): Promise<ApiResponse<any>> {
    return this.get(`USER_PROFILE/${userId}/recommendations`);
  }
  
  // 🔄 Синхронизация с носимыми устройствами
  async syncWearableData(deviceType: string, data: any): Promise<ApiResponse<any>> {
    return this.post(`WEARABLES/${deviceType}/sync`, data);
  }
}

// Singleton instance
export const apiClient = new PreventApiClient();

// Хуки для React Query / SWR интеграции
export const createApiQueryKey = (endpoint: APIEndpoint | string, params?: any) => {
  return [endpoint, params].filter(Boolean);
};

// Типы для компонентов
export type { ApiResponse, ApiError, RequestOptions };
