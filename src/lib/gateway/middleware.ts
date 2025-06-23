
import { GatewayRequest, GatewayResponse } from './types';

export class GatewayMiddleware {
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();

  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async rateLimit(req: GatewayRequest, maxRequests = 100, windowMs = 15 * 60 * 1000): Promise<void> {
    const clientId = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    let clientData = this.requestCounts.get(clientId);
    
    if (!clientData || clientData.resetTime < windowStart) {
      clientData = { count: 0, resetTime: now + windowMs };
      this.requestCounts.set(clientId, clientData);
    }

    clientData.count++;

    if (clientData.count > maxRequests) {
      throw new Error(`Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000} seconds`);
    }
  }

  static logRequest(req: GatewayRequest, requestId: string): void {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
      timestamp,
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id,
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip']
    }));
  }

  static logResponse(response: GatewayResponse, requestId: string, startTime: number): void {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    
    console.log(JSON.stringify({
      timestamp,
      requestId,
      status: response.status,
      duration,
      hasError: !!response.error
    }));
  }

  static formatErrorResponse(error: Error, requestId: string): GatewayResponse {
    console.error(`Request ${requestId} failed:`, error);
    
    return {
      status: error.message.includes('authentication') || error.message.includes('authorization') ? 401 :
              error.message.includes('permission') ? 403 :
              error.message.includes('not found') ? 404 :
              error.message.includes('rate limit') ? 429 : 500,
      error: error.message,
      timestamp: new Date().toISOString(),
      requestId
    };
  }

  static formatSuccessResponse(data: any, requestId: string): GatewayResponse {
    return {
      status: 200,
      data,
      timestamp: new Date().toISOString(),
      requestId
    };
  }
}
