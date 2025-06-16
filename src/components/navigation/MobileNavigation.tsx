
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Activity, Brain, FlaskConical, Users, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const navigationItems = [
  { name: 'Главная', href: '/dashboard', icon: Home },
  { name: 'Анализ рисков', href: '/risk-assessment', icon: Brain },
  { name: 'Женское здоровье', href: '/womens-health', icon: Activity },
  { name: 'Экология', href: '/environmental-health', icon: FlaskConical },
  { name: 'Сообщество', href: '/community', icon: Users },
  { name: 'Эксперты', href: '/experts', icon: User },
];

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  if (!isMobile) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-background">
        <div className="flex flex-col space-y-4 mt-6">
          <div className="px-2 py-4">
            <h2 className="text-lg font-montserrat font-semibold">PREVENT</h2>
            <p className="text-sm text-muted-foreground">Навигация</p>
          </div>
          
          <nav className="flex flex-col space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`justify-start h-12 px-4 ${
                    isActive ? 'bg-primary/10 text-primary font-medium' : ''
                  }`}
                  onClick={() => {
                    navigate(item.href);
                    setOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};
