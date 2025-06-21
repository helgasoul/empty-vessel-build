
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  Crown, 
  Info, 
  User, 
  ChevronDown,
  Users, 
  Stethoscope, 
  BookOpen, 
  Heart,
  Brain,
  Calendar,
  UserCheck,
  Building2,
  FileText,
  Database,
  Dna,
  Leaf
} from "lucide-react";
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

  const navigationSections = [
    {
      label: "Здоровье и анализы",
      items: [
        {
          title: 'Оценка рисков',
          path: '/risk-assessment-demo',
          icon: Brain,
          description: 'ИИ-анализ рисков здоровья'
        },
        {
          title: 'Женское здоровье',
          path: '/womens-health-demo',
          icon: Heart,
          description: 'Комплексная диагностика'
        },
        {
          title: 'Экология здоровья',
          path: '/environmental-health-demo',
          icon: Leaf,
          description: 'Влияние окружающей среды'
        },
        {
          title: 'Персональный план',
          path: '/personal-plan',
          icon: Calendar,
          description: 'Индивидуальные рекомендации'
        }
      ]
    },
    {
      label: "Семейные данные",
      items: [
        {
          title: 'Семейный банк данных',
          path: '/family-data-bank',
          icon: Database,
          description: 'База данных здоровья семьи'
        },
        {
          title: 'История здоровья семьи',
          path: '/family-health-history',
          icon: FileText,
          description: 'Медицинская история родственников'
        },
        {
          title: 'Генетические риски',
          path: '/genetic-risks',
          icon: Dna,
          description: 'Наследственные предрасположенности'
        }
      ]
    },
    {
      label: "Эксперты и партнеры",
      items: [
        {
          title: 'Врачи-эксперты',
          path: '/experts',
          icon: Stethoscope,
          description: 'Наша команда специалистов'
        },
        {
          title: 'Блог экспертов',
          path: '/expert-blog',
          icon: BookOpen,
          description: 'Статьи и рекомендации врачей'
        },
        {
          title: 'Партнеры платформы',
          path: '/partners',
          icon: Building2,
          description: 'Медицинские центры и клиники'
        },
        {
          title: 'О команде',
          path: '/team',
          icon: Users,
          description: 'Кто создает PREVENT'
        }
      ]
    },
    {
      label: "Сообщество и поддержка",
      items: [
        {
          title: 'Сообщество',
          path: '/community-demo',
          icon: Users,
          description: 'Общение и взаимоподдержка'
        },
        {
          title: 'Подписки и планы',
          path: '/subscription',
          icon: UserCheck,
          description: 'Тарифные планы'
        },
        {
          title: 'О платформе',
          path: '/about',
          icon: FileText,
          description: 'Миссия и ценности PREVENT'
        }
      ]
    }
  ];

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
            {/* Разделы Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-purple-700 hover:text-purple-800 hover:bg-purple-50/80 transition-all duration-200"
                >
                  Разделы
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-[80vh] overflow-y-auto bg-white border border-purple-200/50 shadow-xl rounded-xl">
                {navigationSections.map((section, sectionIndex) => (
                  <div key={section.label}>
                    <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-3 py-2 bg-gray-50/80">
                      {section.label}
                    </DropdownMenuLabel>
                    {section.items.map((item) => (
                      <DropdownMenuItem
                        key={item.path}
                        className="px-3 py-3 cursor-pointer transition-colors bg-white hover:bg-purple-50"
                        onClick={() => handleNavClick(item.path)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="prevent-icon-container bg-purple-100 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500 truncate">{item.description}</div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    {sectionIndex < navigationSections.length - 1 && (
                      <DropdownMenuSeparator className="my-2 bg-gray-200/50" />
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={handleAboutClick}
              className={navigationButtonStyle}
            >
              <Info className="w-4 h-4 mr-2" />
              О нас
            </Button>

            <Button 
              onClick={() => handleNavClick('/experts')}
              className={navigationButtonStyle}
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Эксперты
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
