
import { NextApiRequest, NextApiResponse } from 'next';
import { gatewayRouter } from '@/lib/gateway';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const startTime = Date.now();
    
    // Проверка модулей через Gateway
    const moduleHealth = await gatewayRouter.healthCheck();
    
    // Проверка базы данных
    const dbHealth = await checkDatabase();
    
    // Проверка внешних сервисов
    const externalHealth = await checkExternalServices();
    
    const responseTime = Date.now() - startTime;
    
    const healthReport = {
      timestamp: new Date().toISOString(),
      status: moduleHealth.status === 'healthy' && dbHealth.status === 'healthy' ? 'healthy' : 'degraded',
      responseTime,
      services: {
        gateway: moduleHealth,
        database: dbHealth,
        external: externalHealth
      },
      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        version: process.version
      }
    };

    const statusCode = healthReport.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthReport);
  } catch (error) {
    res.status(500).json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error.message
    });
  }
}

async function checkDatabase() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      return { status: 'unhealthy', error: error.message };
    }
    
    return { status: 'healthy', details: 'Database connection successful' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkExternalServices() {
  const services = {};
  
  // Проверка Supabase
  try {
    const response = await fetch('https://wbydubxjcdhoinhrozwx.supabase.co/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      }
    });
    
    services['supabase'] = {
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: response.headers.get('x-response-time') || 'unknown'
    };
  } catch (error) {
    services['supabase'] = {
      status: 'unhealthy',
      error: error.message
    };
  }
  
  return services;
}
