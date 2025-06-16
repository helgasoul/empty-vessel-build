
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { preferences, resolvedTheme, setTheme } = useTheme();

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Светлая', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Темная', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'Системная', icon: <Monitor className="w-4 h-4" /> },
  ];

  const currentIcon = resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          {currentIcon}
          <span className="sr-only">Переключить тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border shadow-lg">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`flex items-center space-x-2 cursor-pointer ${
              preferences.theme === option.value ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
