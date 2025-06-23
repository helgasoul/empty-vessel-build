
// Server-side gateway functionality for client-side implementation
import { GatewayRequest, GatewayResponse } from './types';
import { gatewayRouter } from './index';

export class GatewayServer {
  static async handleRequest(req: GatewayRequest): Promise<GatewayResponse> {
    try {
      // Process the request through the gateway router
      const response = await gatewayRouter.route(req);
      return response;
    } catch (error) {
      console.error('Gateway server error:', error);
      return {
        status: 500,
        error: 'Internal gateway error',
        timestamp: new Date().toISOString(),
        requestId: 'unknown'
      };
    }
  }

  static async healthCheck(): Promise<any> {
    try {
      const startTime = Date.now();
      
      // Check modules through Gateway
      const moduleHealth = await gatewayRouter.healthCheck();
      
      const responseTime = Date.now() - startTime;
      
      const healthReport = {
        timestamp: new Date().toISOString(),
        status: moduleHealth.status === 'healthy' ? 'healthy' : 'degraded',
        responseTime,
        services: {
          gateway: moduleHealth
        },
        system: {
          uptime: Date.now() // Browser uptime approximation
        }
      };

      return healthReport;
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message
      };
    }
  }
}
