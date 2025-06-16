
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Pill, TrendingUp, Smartphone } from 'lucide-react';
import MenstrualCycleTracker from './MenstrualCycleTracker';
import SymptomMoodLogger from './SymptomMoodLogger';
import MedicationReminders from './MedicationReminders';
import HealthAppIntegrations from './HealthAppIntegrations';

const WomensHealthDashboard = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'cycle' | 'symptoms' | 'medications' | 'integrations'>('overview');

  const sections = [
    {
      key: 'overview',
      title: 'Обзор',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Общий обзор здоровья'
    },
    {
      key: 'cycle',
      title: 'Менструальный цикл',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Трекер цикла и симптомов'
    },
    {
      key: 'symptoms',
      title: 'Симптомы и настроение',
      icon: <Heart className="w-5 h-5" />,
      description: 'Дневник состояния'
    },
    {
      key: 'medications',
      title: 'Лекарства',
      icon: <Pill className="w-5 h-5" />,
      description: 'Напоминания и планы лечения'
    },
    {
      key: 'integrations',
      title: 'Интеграции',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Подключение приложений'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Женское здоровье</h1>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {sections.map(section => (
          <Card 
            key={section.key}
            className={`cursor-pointer transition-all ${
              activeSection === section.key 
                ? 'border-#F0A1C0 bg-#F0A1C0/5' 
                : 'hover:border-#F0A1C0/50'
            }`}
            onClick={() => setActiveSection(section.key as any)}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className={`p-2 rounded-lg ${
                  activeSection === section.key 
                    ? 'bg-#F0A1C0 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{section.title}</h3>
                  <p className="text-xs text-gray-600">{section.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Добро пожаловать в раздел женского здоровья</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Этот раздел поможет вам отслеживать различные аспекты женского здоровья, 
                  включая менструальный цикл, симптомы, настроение и лекарства.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-#F0A1C0/10 rounded-lg">
                    <Calendar className="w-8 h-8 text-#F0A1C0 mb-2" />
                    <h4 className="font-medium">Трекер цикла</h4>
                    <p className="text-sm text-gray-600">
                      Отслеживайте менструальный цикл и связанные симптомы
                    </p>
                  </div>
                  <div className="p-4 bg-#61D5A4/10 rounded-lg">
                    <Heart className="w-8 h-8 text-#61D5A4 mb-2" />
                    <h4 className="font-medium">Дневник состояния</h4>
                    <p className="text-sm text-gray-600">
                      Записывайте симптомы, настроение и самочувствие
                    </p>
                  </div>
                  <div className="p-4 bg-#4A90E2/10 rounded-lg">
                    <Pill className="w-8 h-8 text-#4A90E2 mb-2" />
                    <h4 className="font-medium">Управление лекарствами</h4>
                    <p className="text-sm text-gray-600">
                      Напоминания о приеме и планы лечения
                    </p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <Smartphone className="w-8 h-8 text-purple-500 mb-2" />
                    <h4 className="font-medium">Интеграции</h4>
                    <p className="text-sm text-gray-600">
                      Подключение с Flo, MAAM и другими приложениями
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => setActiveSection('cycle')}
                    className="bg-#F0A1C0 hover:bg-#F0A1C0/90"
                  >
                    Добавить цикл
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('symptoms')}
                    className="bg-#61D5A4 hover:bg-#61D5A4/90"
                  >
                    Записать симптомы
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('medications')}
                    className="bg-#4A90E2 hover:bg-#4A90E2/90"
                  >
                    Управление лекарствами
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('integrations')}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Подключить приложения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'cycle' && <MenstrualCycleTracker />}
        {activeSection === 'symptoms' && <SymptomMoodLogger />}
        {activeSection === 'medications' && <MedicationReminders />}
        {activeSection === 'integrations' && <HealthAppIntegrations />}
      </div>
    </div>
  );
};

export default WomensHealthDashboard;
