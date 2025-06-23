
export interface GatewayRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface GatewayResponse {
  status: number;
  data?: any;
  error?: string;
  timestamp: string;
  requestId: string;
}

export interface RouteHandler {
  (req: GatewayRequest): Promise<GatewayResponse>;
}

export interface ModuleRoutes {
  [key: string]: RouteHandler;
}

export interface ApiModule {
  name: string;
  version: string;
  routes: ModuleRoutes;
  healthCheck: () => Promise<{ status: 'healthy' | 'unhealthy'; details?: any }>;
}
