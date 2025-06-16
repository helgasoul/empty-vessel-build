
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, TrendingUp, MessageCircle, Apple, Dumbbell } from "lucide-react";
import EnhancedHealthAIAssistant from "@/components/ai/EnhancedHealthAIAssistant";
import PersonalizedNutritionPlans from "@/components/nutrition/PersonalizedNutritionPlans";
import EnhancedFitnessPrograms from "@/components/fitness/EnhancedFitnessPrograms";
import PredictiveSymptomAnalysis from "@/components/analytics/PredictiveSymptomAnalysis";
import PredictiveTrends from "@/components/analytics/PredictiveTrends";
import { useHealthData } from "@/hooks/useHealthData";
import { useSymptomMoodLog } from "@/hooks/useSymptomMoodLog";
import { useMenstrualCycle } from "@/hooks/useMenstrualCycle";

const AIHealth = () => {
  const { healthData } = useHealthData();
  const { logs } = useSymptomMoodLog();
  const { cycles } = useMenstrualCycle();

  // Подготавливаем исторические данные для аналитики
  const historicalData = React.useMemo(() => {
    const combinedData = [];
    
    // Группируем данные по дням
    const dataByDate: { [date: string]: any } = {};
    
    healthData.forEach(item => {
      const date = item.recorded_at.split('T')[0];
      if (!dataByDate[date]) {
        dataByDate[date] = { date };
      }
      
      if (item.data_type === 'steps') {
        dataByDate[date].steps = item.data_value;
      } else if (item.data_type === 'heart_rate') {
        dataByDate[date].heartRate = item.data_value;
      } else if (item.data_type === 'sleep') {
        dataByDate[date].sleepHours = item.data_value;
      }
    });

    // Добавляем данные из дневника настроения
    logs.forEach(log => {
      const date = log.log_date;
      if (!dataByDate[date]) {
        dataByDate[date] = { date };
      }
      
      dataByDate[date].mood = log.mood_rating;
      dataByDate[date].stress = log.stress_level;
      dataByDate[date].energy = log.energy_level;
      dataByDate[date].symptoms = log.symptoms;
    });

    return Object.values(dataByDate).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [healthData, logs]);

  const userProfile = {
    age: 30, // Можно получить из профиля пользователя
    cycleLength: cycles.length > 0 ? cycles[0].cycle_length : 28,
    healthGoals: ['improve_mood', 'regular_cycle', 'better_sleep']
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Заголовок */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-montserrat text-gray-900">
              ИИ-Экосистема здоровья
            </h1>
            <p className="text-gray-600 font-roboto">
              Персонализированная аналитика, питание, фитнес и рекомендации на основе ваших данных
            </p>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {historicalData.length}
                </div>
                <div className="text-sm text-gray-600">Дней данных</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {logs.length}
                </div>
                <div className="text-sm text-gray-600">Записей симптомов</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {cycles.length}
                </div>
                <div className="text-sm text-gray-600">Записей циклов</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  95
                </div>
                <div className="text-sm text-gray-600">% точность ИИ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Основной контент */}
      <Tabs defaultValue="assistant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assistant" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>ИИ-Ассистент</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center space-x-2">
            <Apple className="w-4 h-4" />
            <span>Питание</span>
          </TabsTrigger>
          <TabsTrigger value="fitness" className="flex items-center space-x-2">
            <Dumbbell className="w-4 h-4" />
            <span>Фитнес</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Прогнозы</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Тренды</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant">
          <EnhancedHealthAIAssistant />
        </TabsContent>

        <TabsContent value="nutrition">
          <PersonalizedNutritionPlans />
        </TabsContent>

        <TabsContent value="fitness">
          <EnhancedFitnessPrograms />
        </TabsContent>

        <TabsContent value="predictions">
          <PredictiveSymptomAnalysis />
        </TabsContent>

        <TabsContent value="trends">
          <PredictiveTrends 
            historicalData={historicalData}
            userProfile={userProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIHealth;
