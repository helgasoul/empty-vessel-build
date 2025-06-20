
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityService } from '@/services/securityService';

interface SessionConfig {
  maxIdleTime?: number; // in minutes
  enableAutoLogout?: boolean;
  trackActivity?: boolean;
}

export const useSessionSecurity = (config: SessionConfig = {}) => {
  const { user, signOut } = useAuth();
  const {
    maxIdleTime = 60, // 1 hour default
    enableAutoLogout = true,
    trackActivity = true
  } = config;

  const updateLastActivity = useCallback(() => {
    if (user && trackActivity) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  }, [user, trackActivity]);

  const checkSession = useCallback(() => {
    if (!user || !enableAutoLogout) return;

    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) {
      updateLastActivity();
      return;
    }

    const now = Date.now();
    const lastActivityTime = parseInt(lastActivity);
    const idleTime = (now - lastActivityTime) / (1000 * 60); // in minutes

    if (idleTime > maxIdleTime) {
      SecurityService.logSecurityEvent({
        actionType: 'session_timeout',
        resourceType: 'session',
        details: { idleTime, maxIdleTime },
        severity: 'low'
      });
      
      signOut();
      localStorage.removeItem('lastActivity');
    }
  }, [user, enableAutoLogout, maxIdleTime, signOut, updateLastActivity]);

  useEffect(() => {
    if (!user) return;

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateLastActivity();
    };

    if (trackActivity) {
      activityEvents.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });
    }

    // Check session periodically
    const sessionInterval = setInterval(checkSession, 60000); // Check every minute

    // Initial activity update
    updateLastActivity();

    return () => {
      if (trackActivity) {
        activityEvents.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
      }
      clearInterval(sessionInterval);
    };
  }, [user, trackActivity, updateLastActivity, checkSession]);

  // Detect suspicious login patterns
  useEffect(() => {
    if (!user) return;

    const detectSuspiciousActivity = () => {
      const userAgent = navigator.userAgent;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const deviceFingerprint = btoa(`${userAgent}-${screenResolution}-${timezone}`);
      const storedFingerprint = localStorage.getItem('deviceFingerprint');
      
      if (storedFingerprint && storedFingerprint !== deviceFingerprint) {
        SecurityService.logSecurityEvent({
          actionType: 'suspicious_login',
          resourceType: 'session',
          details: { 
            previousFingerprint: storedFingerprint,
            currentFingerprint: deviceFingerprint
          },
          severity: 'high'
        });
      }
      
      localStorage.setItem('deviceFingerprint', deviceFingerprint);
    };

    detectSuspiciousActivity();
  }, [user]);

  return {
    updateLastActivity,
    checkSession
  };
};
