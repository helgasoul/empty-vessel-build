
import { useEffect } from 'react';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Set security headers via meta tags (for what we can control client-side)
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Content Security Policy (basic client-side implementation)
    setMetaTag('referrer', 'strict-origin-when-cross-origin');
    
    // Add security-related meta tags
    setMetaTag('X-Content-Type-Options', 'nosniff');
    setMetaTag('X-Frame-Options', 'DENY');
    
    // Disable right-click context menu on sensitive elements
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.sensitive-data')) {
        e.preventDefault();
      }
    };

    // Disable text selection on sensitive elements
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.no-select')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);

    // Clean up
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);
};
