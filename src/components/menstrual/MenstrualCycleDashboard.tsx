
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, TrendingUp, Brain, Activity } from 'lucide-react';
import CurrentCycleDashboard from './CurrentCycleDashboard';
import SymptomDiary from './SymptomDiary';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import CycleCalendar from './CycleCalendar';

const MenstrualCycleDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Трекер менструального цикла
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Отслеживайте свой цикл, симптомы и получайте персонализированные рекомендации
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Дашборд
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Календарь
          </TabsTrigger>
          <TabsTrigger value="diary" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Дневник
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Рекомендации
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <CurrentCycleDashboard />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CycleCalendar />
        </TabsContent>

        <TabsContent value="diary" className="mt-6">
          <SymptomDiary />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <PersonalizedRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenstrualCycleDashboard;
