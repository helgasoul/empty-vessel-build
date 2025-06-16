
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <nav className="w-full px-4 md:px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl md:text-2xl font-montserrat font-bold text-gray-900 dark:text-white">PREVENT</span>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-roboto">
              {isMobile ? 'Персонализированная медицина' : 'Персонализированная медицина'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {!isMobile && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/about')}
              className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 font-medium text-sm md:text-base"
            >
              <Info className="w-4 h-4" />
              О нас
            </Button>
          )}
          <ThemeToggle />
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="hover:bg-primary/10 hover:border-primary transition-all duration-200 font-medium text-sm md:text-base"
          >
            Войти
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
