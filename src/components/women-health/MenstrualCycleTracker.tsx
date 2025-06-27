
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Droplet, Moon, Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CycleDay {
  date: Date;
  type: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'normal';
  symptoms?: string[];
  notes?: string;
}

interface MenstrualCycleTrackerProps {
  className?: string;
}

const phaseInfo = {
  menstrual: {
    name: 'Менструация',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Droplet,
    description: 'Период менструального кровотечения'
  },
  follicular: {
    name: 'Фолликулярная',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Moon,
    description: 'Подготовка к овуляции'
  },
  ovulation: {
    name: 'Овуляция',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Flower2,
    description: 'Период наивысшей фертильности'
  },
  luteal: {
    name: 'Лютеиновая',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Calendar,
    description: 'Период после овуляции'
  },
  normal: {
    name: 'Обычный день',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Calendar,
    description: ''
  }
};

export const MenstrualCycleTracker: React.FC<MenstrualCycleTrackerProps> = ({
  className
}) => {
  const [currentPhase, setCurrentPhase] = useState<keyof typeof phaseInfo>('follicular');
  const [cycleDay, setCycleDay] = useState(12);
  const [nextPeriod, setNextPeriod] = useState(16);

  const CurrentPhaseIcon = phaseInfo[currentPhase].icon;

  return (
    <Card className={cn('prevent-card', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <span>Менструальный цикл</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Текущая фаза */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className={cn(
              'p-4 rounded-full',
              phaseInfo[currentPhase].color.replace('text-', 'text-').replace('border-', 'bg-')
            )}>
              <CurrentPhaseIcon className="w-8 h-8" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {phaseInfo[currentPhase].name}
            </h3>
            <p className="text-sm text-gray-600">
              {phaseInfo[currentPhase].description}
            </p>
          </div>
          
          <Badge variant="outline" className={phaseInfo[currentPhase].color}>
            День цикла: {cycleDay}
          </Badge>
        </div>

        {/* Статистика цикла */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-pink-200">
            <div className="text-2xl font-bold text-pink-600">{nextPeriod}</div>
            <div className="text-sm text-gray-600">дней до менструации</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">28</div>
            <div className="text-sm text-gray-600">средняя длина цикла</div>
          </div>
        </div>

        {/* Прогноз фертильности */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Flower2 className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Фертильность</span>
          </div>
          <p className="text-sm text-blue-700">
            {currentPhase === 'ovulation' ? 
              'Высокая вероятность зачатия' :
              currentPhase === 'follicular' && cycleDay > 10 ?
              'Приближается период фертильности' :
              'Низкая вероятность зачатия'
            }
          </p>
        </div>

        {/* Действия */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {/* Логика записи симптомов */}}
          >
            Записать симптомы
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {/* Логика просмотра календаря */}}
          >
            Календарь
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenstrualCycleTracker;
