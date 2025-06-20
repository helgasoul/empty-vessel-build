interface SecurityEvent {
  actionType: string;
  resourceType: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
  timestamp?: string;
  userId?: string;
}

interface RateLimitConfig {
  [key: string]: {
    count: number;
    lastReset: number;
  };
}

class SecurityServiceClass {
  private rateLimits: RateLimitConfig = {};

  logSecurityEvent(event: SecurityEvent): void {
    const enrichedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', enrichedEvent);
    }

    // Store security events in localStorage for now
    // In production, this would be sent to a security monitoring service
    const existingEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
    existingEvents.push(enrichedEvent);
    
    // Keep only last 100 events to prevent localStorage bloat
    if (existingEvents.length > 100) {
      existingEvents.splice(0, existingEvents.length - 100);
    }
    
    localStorage.setItem('security_events', JSON.stringify(existingEvents));

    // Send critical events to monitoring service (placeholder)
    if (event.severity === 'high') {
      this.sendCriticalAlert(enrichedEvent);
    }
  }

  validateFile(
    file: File, 
    allowedMimeTypes: string[] = [], 
    maxSizeBytes: number = 50 * 1024 * 1024
  ): boolean {
    // Check file size
    if (file.size > maxSizeBytes) {
      this.logSecurityEvent({
        actionType: 'file_size_exceeded',
        resourceType: 'file',
        details: { 
          fileName: file.name, 
          fileSize: file.size, 
          maxSize: maxSizeBytes 
        },
        severity: 'medium'
      });
      return false;
    }

    // Check MIME type
    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
      this.logSecurityEvent({
        actionType: 'invalid_file_type',
        resourceType: 'file',
        details: { 
          fileName: file.name, 
          fileType: file.type, 
          allowedTypes: allowedMimeTypes 
        },
        severity: 'medium'
      });
      return false;
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.pif$/i,
      /\.com$/i,
      /\.vbs$/i,
      /\.js$/i,
      /\.jar$/i,
      /\.\./,
      /<script/i,
      /javascript:/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      this.logSecurityEvent({
        actionType: 'suspicious_file_name',
        resourceType: 'file',
        details: { fileName: file.name },
        severity: 'high'
      });
      return false;
    }

    return true;
  }

  sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    // Remove potential XSS vectors
    const sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '')
      .trim();

    // Log if sanitization occurred
    if (sanitized !== input) {
      this.logSecurityEvent({
        actionType: 'input_sanitized',
        resourceType: 'input',
        details: { 
          original: input.substring(0, 100), 
          sanitized: sanitized.substring(0, 100) 
        },
        severity: 'medium'
      });
    }

    return sanitized;
  }

  checkRateLimit(
    action: string, 
    maxRequests: number = 10, 
    windowMinutes: number = 15
  ): boolean {
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    const key = `${action}_${this.getCurrentUserId() || 'anonymous'}`;

    if (!this.rateLimits[key]) {
      this.rateLimits[key] = { count: 0, lastReset: now };
    }

    const limit = this.rateLimits[key];

    // Reset window if expired
    if (now - limit.lastReset > windowMs) {
      limit.count = 0;
      limit.lastReset = now;
    }

    // Check if limit exceeded
    if (limit.count >= maxRequests) {
      this.logSecurityEvent({
        actionType: 'rate_limit_exceeded',
        resourceType: 'rate_limit',
        details: { 
          action, 
          count: limit.count, 
          maxRequests, 
          windowMinutes 
        },
        severity: 'high'
      });
      return false;
    }

    // Increment counter
    limit.count++;
    return true;
  }

  private getCurrentUserId(): string | null {
    // Try to get user ID from various sources
    try {
      const userData = localStorage.getItem('supabase.auth.token');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed?.user?.id || null;
      }
    } catch (error) {
      // Ignore parsing errors
    }
    return null;
  }

  private sendCriticalAlert(event: SecurityEvent): void {
    // In production, this would send alerts to security monitoring
    console.warn('CRITICAL SECURITY EVENT:', event);
    
    // Could integrate with services like:
    // - Sentry
    // - DataDog
    // - Custom webhook
    // - Email alerts
  }

  // Method to get security events for admin dashboard
  getSecurityEvents(): SecurityEvent[] {
    try {
      return JSON.parse(localStorage.getItem('security_events') || '[]');
    } catch (error) {
      return [];
    }
  }

  // Method to clear security events
  clearSecurityEvents(): void {
    localStorage.removeItem('security_events');
    this.logSecurityEvent({
      actionType: 'security_events_cleared',
      resourceType: 'admin',
      details: {},
      severity: 'low'
    });
  }
}

export const SecurityService = new SecurityServiceClass();
