
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/ui/logo';

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <nav className="w-full px-4 md:px-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-purple-200/30 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo size={isMobile ? 'sm' : 'md'} />
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {!isMobile && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/about')}
              className="flex items-center gap-2 hover:bg-purple-100/50 transition-all duration-200 font-medium text-sm md:text-base text-gray-700 hover:text-purple-700"
            >
              <Info className="w-4 h-4" />
              О нас
            </Button>
          )}
          <ThemeToggle />
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="prevent-button-soft border-purple-200 hover:border-purple-300 text-gray-700 transition-all duration-200 font-medium text-sm md:text-base"
          >
            Войти
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
