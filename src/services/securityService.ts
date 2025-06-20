
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  actionType: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityService {
  // Log security events for audit purposes
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // For now, we'll log to console. In production, this would go to audit logs
      console.log('Security Event:', {
        userId: user?.id,
        timestamp: new Date().toISOString(),
        ...event
      });
      
      // TODO: When audit logs table is available, insert into database
      // await supabase.rpc('log_security_event', {
      //   p_action_type: event.actionType,
      //   p_resource_type: event.resourceType,
      //   p_resource_id: event.resourceId,
      //   p_details: event.details || {},
      //   p_severity: event.severity || 'info'
      // });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Rate limiting check (client-side basic implementation)
  static checkRateLimit(action: string, maxRequests: number = 100, windowMinutes: number = 60): boolean {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    
    const stored = localStorage.getItem(key);
    let data = stored ? JSON.parse(stored) : { count: 0, windowStart: now };
    
    // Reset if window has passed
    if (now - data.windowStart > windowMs) {
      data = { count: 1, windowStart: now };
    } else {
      data.count++;
    }
    
    localStorage.setItem(key, JSON.stringify(data));
    
    if (data.count > maxRequests) {
      this.logSecurityEvent({
        actionType: 'rate_limit_exceeded',
        resourceType: 'api',
        details: { action, count: data.count },
        severity: 'medium'
      });
      return false;
    }
    
    return true;
  }

  // Validate file before upload
  static validateFile(file: File, allowedTypes: string[] = [], maxSizeBytes: number = 50 * 1024 * 1024): boolean {
    // Check file size
    if (file.size > maxSizeBytes) {
      this.logSecurityEvent({
        actionType: 'file_upload_rejected',
        resourceType: 'file',
        details: { reason: 'file_too_large', size: file.size, maxSize: maxSizeBytes },
        severity: 'low'
      });
      return false;
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      this.logSecurityEvent({
        actionType: 'file_upload_rejected',
        resourceType: 'file',
        details: { reason: 'invalid_file_type', type: file.type, allowedTypes },
        severity: 'medium'
      });
      return false;
    }
    
    // Check file name for suspicious patterns
    const suspiciousPatterns = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar'];
    const fileName = file.name.toLowerCase();
    
    if (suspiciousPatterns.some(pattern => fileName.includes(pattern))) {
      this.logSecurityEvent({
        actionType: 'file_upload_rejected',
        resourceType: 'file',
        details: { reason: 'suspicious_file_name', fileName },
        severity: 'high'
      });
      return false;
    }
    
    return true;
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Generate secure token
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
