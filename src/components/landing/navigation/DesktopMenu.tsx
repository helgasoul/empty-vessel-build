
import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from './LanguageSelector';
import { DesktopMenuProps } from './types';

export const DesktopMenu: React.FC<DesktopMenuProps> = ({
  navigationItems,
  currentLanguage,
  onLanguageChange,
  onNavClick
}) => {
  return (
    <div className="flex items-center space-x-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-700 hover:text-purple-700">
              Разделы
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 w-[400px]">
                {navigationItems.map((item) => (
                  <NavigationMenuLink
                    key={item.path}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                    onClick={() => onNavClick(item.path)}
                  >
                    <div className="text-sm font-medium leading-none">{item.title}</div>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <Button 
        variant="ghost" 
        onClick={() => onNavClick('/about')}
        className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 font-medium"
      >
        О нас
      </Button>

      <Button 
        variant="outline" 
        onClick={() => onNavClick('/subscription')}
        className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700 hover:text-purple-700 transition-all duration-200 font-medium flex items-center gap-2"
      >
        <Crown className="w-4 h-4" />
        Планы
      </Button>

      <LanguageSelector 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      
      <ThemeToggle />
      <Button 
        variant="outline" 
        onClick={() => onNavClick('/auth')}
        className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700 transition-all duration-200 font-medium"
      >
        Войти
      </Button>
    </div>
  );
};
