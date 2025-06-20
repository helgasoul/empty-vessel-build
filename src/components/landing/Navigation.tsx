
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Info, Menu, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/ui/logo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { title: 'Оценка рисков', path: '/risk-assessment-demo' },
    { title: 'Женское здоровье', path: '/womens-health-demo' },
    { title: 'Экология здоровья', path: '/environmental-health-demo' },
    { title: 'Сообщество', path: '/community-demo' }
  ];

  return (
    <nav className="w-full px-4 md:px-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-purple-200/30 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo size={isMobile ? 'sm' : 'md'} />
        
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
        
        {/* Desktop Navigation - moved to right side */}
        {!isMobile && (
          <div className="flex items-center space-x-6">
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
                          onClick={() => navigate(item.path)}
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
              onClick={() => navigate('/about')}
              className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 font-medium"
            >
              О нас
            </Button>
            
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700 transition-all duration-200 font-medium"
            >
              Войти
            </Button>
          </div>
        )}

        {/* Mobile Actions - when menu is closed */}
        {isMobile && !mobileMenuOpen && (
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/auth')}
              className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700 transition-all duration-200 font-medium"
            >
              Войти
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="mt-4 border-t border-purple-200/30 pt-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                {item.title}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => {
                navigate('/about');
                setMobileMenuOpen(false);
              }}
            >
              О нас
            </Button>
            <div className="pt-4 border-t border-purple-200/30 flex items-center justify-between">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}
                className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700"
              >
                Войти
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
