
import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown, Info, User } from "lucide-react";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from './LanguageSelector';
import { MobileMenuProps } from './types';

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navigationItems,
  currentLanguage,
  onLanguageChange,
  onNavClick
}) => {
  const handleNavClick = (path: string) => {
    onNavClick(path);
    onClose();
  };

  const handleAboutClick = () => {
    console.log('Переход на страницу "О нас"');
    handleNavClick('/about');
  };

  const handleSubscriptionClick = () => {
    console.log('Переход на страницу планов');
    handleNavClick('/subscription');
  };

  const handleAuthClick = () => {
    console.log('Переход на страницу входа');
    handleNavClick('/auth');
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 border-t border-purple-200/30 pt-4">
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-purple-700 hover:bg-purple-50"
            onClick={() => handleNavClick(item.path)}
          >
            {item.title}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-purple-700 hover:bg-purple-50 flex items-center gap-2"
          onClick={handleAboutClick}
        >
          <Info className="w-4 h-4" />
          О нас
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-purple-700 hover:bg-purple-50 flex items-center gap-2"
          onClick={handleSubscriptionClick}
        >
          <Crown className="w-4 h-4" />
          Планы подписки
        </Button>

        <LanguageSelector 
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          isMobile={true}
        />

        <div className="pt-4 border-t border-purple-200/30 flex items-center justify-between">
          <ThemeToggle />
          <Button 
            onClick={handleAuthClick}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-200 hover:shadow-lg font-medium flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
};
