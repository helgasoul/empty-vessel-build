
import React from 'react';
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelectorProps } from './types';

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  isMobile = false
}) => {
  if (isMobile) {
    return (
      <div className="pt-2 border-t border-purple-200/30">
        <p className="text-sm text-gray-600 mb-2 px-4">Язык / Language</p>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className={`w-full justify-start ${currentLanguage === 'ru' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'}`}
            onClick={() => onLanguageChange('ru')}
          >
            🇷🇺 Русский
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${currentLanguage === 'en' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'}`}
            onClick={() => onLanguageChange('en')}
          >
            🇺🇸 English
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-700 hover:text-purple-700">
          <Languages className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => onLanguageChange('ru')}
          className={currentLanguage === 'ru' ? 'bg-purple-50 text-purple-700' : ''}
        >
          🇷🇺 Русский
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onLanguageChange('en')}
          className={currentLanguage === 'en' ? 'bg-purple-50 text-purple-700' : ''}
        >
          🇺🇸 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
