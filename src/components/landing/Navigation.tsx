
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/ui/logo';
import { DesktopMenu } from './navigation/DesktopMenu';
import { MobileMenu } from './navigation/MobileMenu';
import { NavigationItem } from './navigation/types';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ru');

  const navigationItems: NavigationItem[] = [
    { title: 'Персональный план', path: '/personal-plan' },
    { title: 'Оценка рисков', path: '/risk-assessment-demo' },
    { title: 'Женское здоровье', path: '/womens-health-demo' },
    { title: 'Экология здоровья', path: '/environmental-health-demo' },
    { title: 'Сообщество', path: '/community-demo' }
  ];

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    console.log('Language changed to:', language);
  };

  const handleNavClick = (path: string) => {
    console.log('Navigation clicked:', path, 'Current location:', location.pathname);
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location for published sites
      window.location.href = path;
    }
  };

  const handleAuthClick = () => {
    console.log('Auth button clicked');
    try {
      navigate('/auth');
    } catch (error) {
      console.error('Auth navigation error:', error);
      window.location.href = '/auth';
    }
  };

  return (
    <nav className="w-full px-4 md:px-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-purple-200/30 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/">
          <Logo size={isMobile ? 'sm' : 'md'} />
        </Link>
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        )}
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <DesktopMenu
            navigationItems={navigationItems}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onNavClick={handleNavClick}
          />
        )}

        {/* Mobile Actions - when menu is closed */}
        {isMobile && !mobileMenuOpen && (
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAuthClick}
              className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700 transition-all duration-200 font-medium"
            >
              Войти
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navigationItems={navigationItems}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onNavClick={handleNavClick}
        />
      )}
    </nav>
  );
};

export default Navigation;
