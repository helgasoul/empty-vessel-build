
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Info, Menu, X, Crown, Languages } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ru');

  const navigationItems = [
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
    navigate(path);
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
                          onClick={() => handleNavClick(item.path)}
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
              onClick={() => handleNavClick('/about')}
              className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 font-medium"
            >
              О нас
            </Button>

            <Button 
              variant="outline" 
              onClick={() => handleNavClick('/subscription')}
              className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700 hover:text-purple-700 transition-all duration-200 font-medium flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Планы
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-purple-700">
                  <Languages className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleLanguageChange('ru')}
                  className={currentLanguage === 'ru' ? 'bg-purple-50 text-purple-700' : ''}
                >
                  🇷🇺 Русский
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleLanguageChange('en')}
                  className={currentLanguage === 'en' ? 'bg-purple-50 text-purple-700' : ''}
                >
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => handleNavClick('/auth')}
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
              onClick={() => handleNavClick('/auth')}
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
                  handleNavClick(item.path);
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
                handleNavClick('/about');
                setMobileMenuOpen(false);
              }}
            >
              О нас
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-purple-700 hover:bg-purple-50 flex items-center gap-2"
              onClick={() => {
                handleNavClick('/subscription');
                setMobileMenuOpen(false);
              }}
            >
              <Crown className="w-4 h-4" />
              Планы подписки
            </Button>

            <div className="pt-2 border-t border-purple-200/30">
              <p className="text-sm text-gray-600 mb-2 px-4">Язык / Language</p>
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${currentLanguage === 'ru' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'}`}
                  onClick={() => {
                    handleLanguageChange('ru');
                  }}
                >
                  🇷🇺 Русский
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${currentLanguage === 'en' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'}`}
                  onClick={() => {
                    handleLanguageChange('en');
                  }}
                >
                  🇺🇸 English
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-200/30 flex items-center justify-between">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => {
                  handleNavClick('/auth');
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
