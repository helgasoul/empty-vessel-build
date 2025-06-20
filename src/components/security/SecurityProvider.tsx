
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SecurityService } from '@/services/securityService';
import { useSecurityHeaders } from '@/hooks/useSecurityHeaders';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';

interface SecurityContextType {
  isSecurityEnabled: boolean;
  logSecurityEvent: (event: any) => void;
  validateFile: (file: File, allowedMimeTypes?: string[], maxSizeBytes?: number) => boolean;
  sanitizeInput: (input: string) => string;
  checkRateLimit: (action: string, maxRequests?: number, windowMinutes?: number) => boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
  enableSessionSecurity?: boolean;
  sessionConfig?: {
    maxIdleTime?: number;
    enableAutoLogout?: boolean;
    trackActivity?: boolean;
  };
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
  enableSessionSecurity = true,
  sessionConfig = {}
}) => {
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);

  // Initialize security hooks
  useSecurityHeaders();
  
  if (enableSessionSecurity) {
    useSessionSecurity(sessionConfig);
  }

  useEffect(() => {
    // Log security provider initialization
    SecurityService.logSecurityEvent({
      actionType: 'security_provider_initialized',
      resourceType: 'security',
      details: { 
        sessionSecurityEnabled: enableSessionSecurity,
        sessionConfig 
      },
      severity: 'low'
    });
  }, [enableSessionSecurity, sessionConfig]);

  const contextValue: SecurityContextType = {
    isSecurityEnabled,
    logSecurityEvent: SecurityService.logSecurityEvent,
    validateFile: (file: File, allowedMimeTypes?: string[], maxSizeBytes?: number) => {
      const defaultAllowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      const defaultMaxSize = 50 * 1024 * 1024; // 50MB
      
      return SecurityService.validateFile(
        file,
        allowedMimeTypes || defaultAllowedTypes,
        maxSizeBytes || defaultMaxSize
      );
    },
    sanitizeInput: SecurityService.sanitizeInput,
    checkRateLimit: SecurityService.checkRateLimit
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
