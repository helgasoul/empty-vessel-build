
import { NextApiRequest, NextApiResponse } from 'next';
import { gatewayRouter } from '@/lib/gateway';
import { GatewayRequest } from '@/lib/gateway/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Преобразуем NextJS запрос в Gateway запрос
    const gatewayReq: GatewayRequest = {
      method: req.method || 'GET',
      url: req.url || '',
      headers: req.headers as Record<string, string>,
      body: req.body,
      query: req.query as Record<string, string>
    };

    // Обрабатываем запрос через роутер
    const response = await gatewayRouter.route(gatewayReq);

    // Возвращаем ответ
    res.status(response.status).json(response);
  } catch (error) {
    console.error('Gateway error:', error);
    res.status(500).json({
      status: 500,
      error: 'Internal gateway error',
      timestamp: new Date().toISOString(),
      requestId: 'unknown'
    });
  }
}
