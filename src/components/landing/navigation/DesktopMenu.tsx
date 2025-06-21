
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LanguageSelector } from './LanguageSelector';
import { DesktopMenuProps } from './types';

export const DesktopMenu: React.FC<DesktopMenuProps> = ({
  navigationItems,
  currentLanguage,
  onLanguageChange,
  onNavClick
}) => {
  // Единый стиль для навигационных кнопок
  const navigationButtonStyle = "bg-white/80 hover:bg-white border border-purple-200/50 text-purple-700 hover:text-purple-800 transition-all duration-200 hover:shadow-md backdrop-blur-sm font-medium";

  return (
    <div className="flex items-center space-x-3">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={navigationButtonStyle}>
              <Menu className="w-4 h-4 mr-2" />
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

      <LanguageSelector 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
};
