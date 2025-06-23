
import { GatewayRequest, GatewayResponse, ApiModule } from './types';
import { AuthMiddleware } from './auth-middleware';
import { GatewayMiddleware } from './middleware';

export class GatewayRouter {
  private modules = new Map<string, ApiModule>();
  private publicRoutes = new Set<string>([
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/health'
  ]);

  registerModule(module: ApiModule): void {
    this.modules.set(module.name, module);
    console.log(`Registered module: ${module.name} v${module.version}`);
  }

  async route(req: GatewayRequest): Promise<GatewayResponse> {
    const requestId = GatewayMiddleware.generateRequestId();
    const startTime = Date.now();

    try {
      // Логирование входящего запроса
      GatewayMiddleware.logRequest(req, requestId);

      // Rate limiting
      await GatewayMiddleware.rateLimit(req);

      // Парсинг пути
      const pathParts = req.url.split('/').filter(Boolean);
      
      if (pathParts.length < 2) {
        throw new Error('Invalid API path format. Expected: /api/module/action');
      }

      const [, moduleName, ...actionParts] = pathParts; // Пропускаем 'api'
      const action = actionParts.join('/');

      // Проверка, что модуль существует
      const module = this.modules.get(moduleName);
      if (!module) {
        throw new Error(`Module '${moduleName}' not found`);
      }

      // Аутентификация (если путь не публичный)
      if (!this.isPublicRoute(req.url)) {
        req = await AuthMiddleware.authenticate(req);
      }

      // Поиск обработчика маршрута
      const routeHandler = module.routes[`${req.method.toUpperCase()}:${action}`] || 
                          module.routes[action] || 
                          module.routes['*']; // Fallback handler

      if (!routeHandler) {
        throw new Error(`Route '${req.method} ${action}' not found in module '${moduleName}'`);
      }

      // Выполнение запроса
      const result = await routeHandler(req);
      
      const response = GatewayMiddleware.formatSuccessResponse(result, requestId);
      GatewayMiddleware.logResponse(response, requestId, startTime);
      
      return response;
    } catch (error) {
      const errorResponse = GatewayMiddleware.formatErrorResponse(error as Error, requestId);
      GatewayMiddleware.logResponse(errorResponse, requestId, startTime);
      
      return errorResponse;
    }
  }

  private isPublicRoute(url: string): boolean {
    return this.publicRoutes.has(url) || this.publicRoutes.has(url.split('?')[0]);
  }

  async healthCheck(): Promise<{ status: string; modules: Record<string, any> }> {
    const moduleHealth: Record<string, any> = {};
    
    for (const [name, module] of this.modules) {
      try {
        moduleHealth[name] = await module.healthCheck();
      } catch (error) {
        moduleHealth[name] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }

    const allHealthy = Object.values(moduleHealth).every(
      (health: any) => health.status === 'healthy'
    );

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      modules: moduleHealth
    };
  }
}
