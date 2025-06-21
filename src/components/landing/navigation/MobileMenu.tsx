
import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
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
          className="w-full justify-start text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          onClick={() => handleNavClick('/about')}
        >
          О нас
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-purple-700 hover:bg-purple-50 flex items-center gap-2"
          onClick={() => handleNavClick('/subscription')}
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
            variant="outline" 
            onClick={() => handleNavClick('/auth')}
            className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700"
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
};
