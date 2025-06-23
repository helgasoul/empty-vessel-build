
import { supabase } from '@/integrations/supabase/client';
import { GatewayRequest } from './types';

export class AuthMiddleware {
  static async authenticate(req: GatewayRequest): Promise<GatewayRequest> {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No valid authorization token provided');
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      // Валидация токена через Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new Error('Invalid authentication token');
      }

      // Получаем роль пользователя из user_roles таблицы
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      // Добавляем пользователя в запрос
      req.user = {
        id: user.id,
        email: user.email!,
        role: userRole?.role || 'patient'
      };

      return req;
    } catch (error: any) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }

  static async validatePermissions(req: GatewayRequest, requiredRole?: string): Promise<boolean> {
    if (!req.user) {
      return false;
    }

    if (!requiredRole) {
      return true; // Если роль не требуется, любой авторизованный пользователь может получить доступ
    }

    // Проверка ролей (admin > doctor > patient)
    const roleHierarchy = { admin: 3, doctor: 2, patient: 1 };
    const userRoleLevel = roleHierarchy[req.user.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userRoleLevel >= requiredRoleLevel;
  }
}
