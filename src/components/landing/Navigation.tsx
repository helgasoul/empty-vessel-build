
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Crown, Info, User } from "lucide-react";
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

  // Единый стиль для навигационных кнопок
  const navigationButtonStyle = "bg-white/80 hover:bg-white border border-purple-200/50 text-purple-700 hover:text-purple-800 transition-all duration-200 hover:shadow-md backdrop-blur-sm font-medium";

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

  const handleAboutClick = () => {
    console.log('Переход на страницу "О нас"');
    try {
      navigate('/about');
    } catch (error) {
      console.error('About navigation error:', error);
      window.location.href = '/about';
    }
  };

  const handleSubscriptionClick = () => {
    console.log('Переход на страницу планов');
    try {
      navigate('/subscription');
    } catch (error) {
      console.error('Subscription navigation error:', error);
      window.location.href = '/subscription';
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
          <div className="flex items-center space-x-3">
            <DesktopMenu
              navigationItems={navigationItems}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              onNavClick={handleNavClick}
            />
            
            <Button 
              onClick={handleAboutClick}
              className={navigationButtonStyle}
            >
              <Info className="w-4 h-4 mr-2" />
              О нас
            </Button>

            <Button 
              onClick={handleSubscriptionClick}
              className={navigationButtonStyle}
            >
              <Crown className="w-4 h-4 mr-2" />
              Планы
            </Button>

            <ThemeToggle />
            
            <Button 
              onClick={handleAuthClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-200 hover:shadow-lg font-medium"
            >
              <User className="w-4 h-4 mr-2" />
              Войти
            </Button>
          </div>
        )}

        {/* Mobile Actions - when menu is closed */}
        {isMobile && !mobileMenuOpen && (
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              onClick={handleAuthClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-200 hover:shadow-lg font-medium text-sm"
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
