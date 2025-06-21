
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SymptomCard from './SymptomCard';
import { 
  Thermometer, 
  Moon, 
  Brain, 
  Smile
} from "lucide-react";

interface MonitoringTabProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
}

const MonitoringTab = ({ selectedPeriod, setSelectedPeriod }: MonitoringTabProps) => {
  const symptoms = [
    { 
      name: 'Приливы', 
      icon: Thermometer, 
      intensity: 3, 
      frequency: 4, 
      color: '#D2691E',
      description: 'Частота и интенсивность приливов'
    },
    { 
      name: 'Сон', 
      icon: Moon, 
      intensity: 2, 
      frequency: 5, 
      color: '#8B4F99',
      description: 'Качество и продолжительность сна'
    },
    { 
      name: 'Концентрация', 
      icon: Brain, 
      intensity: 4, 
      frequency: 3, 
      color: '#CD853F',
      description: 'Когнитивные функции и память'
    },
    { 
      name: 'Настроение', 
      icon: Smile, 
      intensity: 3, 
      frequency: 4, 
      color: '#BC8F8F',
      description: 'Эмоциональное состояние'
    }
  ];

  const symptomsData = [
    { day: 'Пн', hot_flashes: 3, sleep: 2, mood: 4, concentration: 3 },
    { day: 'Вт', hot_flashes: 4, sleep: 3, mood: 3, concentration: 4 },
    { day: 'Ср', hot_flashes: 2, sleep: 2, mood: 5, concentration: 2 },
    { day: 'Чт', hot_flashes: 5, sleep: 4, mood: 2, concentration: 5 },
    { day: 'Пт', hot_flashes: 3, sleep: 3, mood: 4, concentration: 3 },
    { day: 'Сб', hot_flashes: 2, sleep: 2, mood: 5, concentration: 2 },
    { day: 'Вс', hot_flashes: 3, sleep: 3, mood: 4, concentration: 3 }
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Фильтр по периоду */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['day', 'week', 'month'].map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
            className={`text-xs sm:text-sm ${
              selectedPeriod === period 
                ? "bg-amber-600 hover:bg-amber-700" 
                : "border-amber-300 text-amber-700"
            }`}
          >
            {period === 'day' ? 'День' : period === 'week' ? 'Неделя' : 'Месяц'}
          </Button>
        ))}
      </div>

      {/* Карточки симптомов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {symptoms.map((symptom, index) => (
          <SymptomCard key={index} {...symptom} />
        ))}
      </div>

      {/* График динамики симптомов */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 text-base sm:text-lg">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Динамика симптомов за неделю
          </CardTitle>
          <CardDescription className="text-sm">
            Отслеживание изменений для выявления паттернов
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={symptomsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Line type="monotone" dataKey="hot_flashes" stroke="#D2691E" strokeWidth={2} name="Приливы" />
                <Line type="monotone" dataKey="sleep" stroke="#8B4F99" strokeWidth={2} name="Сон" />
                <Line type="monotone" dataKey="mood" stroke="#BC8F8F" strokeWidth={2} name="Настроение" />
                <Line type="monotone" dataKey="concentration" stroke="#CD853F" strokeWidth={2} name="Концентрация" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Инсайт недели */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-amber-900 mb-1 text-sm sm:text-base">Инсайт недели</h4>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed break-words">
                Приливы усиливаются в середине недели. Рекомендуем добавить дыхательные практики 
                и ограничить кофеин в эти дни.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringTab;
