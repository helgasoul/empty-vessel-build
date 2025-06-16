import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Send, Sparkles, RefreshCw, User, Bot, Activity, TrendingUp, Heart, Zap, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMenstrualCycle } from "@/hooks/useMenstrualCycle";
import { useSymptomMoodLog } from "@/hooks/useSymptomMoodLog";
import { useHealthData } from "@/hooks/useHealthData";
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: 'cycle' | 'symptoms' | 'health' | 'general' | 'analysis';
  attachments?: {
    type: 'chart' | 'recommendation' | 'insight';
    data: any;
  }[];
}

interface HealthInsight {
  id: string;
  type: 'trend' | 'correlation' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  data?: any;
}

interface ComprehensiveHealthContext {
  // Базовые метрики
  currentCycleDay?: number;
  cyclePhase?: string;
  cycleTrends?: {
    averageLength: number;
    regularityScore: number;
    symptomPatterns: string[];
  };
  
  // Данные здоровья
  healthMetrics?: {
    steps: number;
    sleep: number;
    heartRate: number;
    stepstrend: 'increasing' | 'stable' | 'decreasing';
    sleepTrend: 'improving' | 'stable' | 'declining';
  };
  
  // Симптомы и настроение
  moodAnalysis?: {
    currentRating: number;
    trend: 'improving' | 'stable' | 'declining';
    stressLevel: number;
    energyLevel: number;
    correlations: { symptom: string; impact: number }[];
  };
  
  // Прогнозы и инсайты
  predictions?: {
    nextCycleStart: string;
    expectedSymptoms: string[];
    optimalWorkoutDays: number[];
    nutritionFocus: string[];
  };
  
  // Персонализированные рекомендации
  recommendations?: {
    immediate: string[];
    weekly: string[];
    lifestyle: string[];
    medical: string[];
  };
}

const EnhancedHealthAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'trends'>('chat');
  const [healthContext, setHealthContext] = useState<ComprehensiveHealthContext>({});
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { cycles } = useMenstrualCycle();
  const { logs } = useSymptomMoodLog();
  const { healthData, getHealthMetrics } = useHealthData();

  // Комплексный анализ здоровья
  useEffect(() => {
    if (cycles.length > 0 && logs.length > 0 && healthData.length > 0) {
      const context = analyzeComprehensiveHealth();
      setHealthContext(context);
      generateHealthInsights(context);
    }
  }, [cycles, logs, healthData]);

  const analyzeComprehensiveHealth = (): ComprehensiveHealthContext => {
    const latestCycle = cycles[0];
    const recentLogs = logs.slice(0, 30); // Последние 30 дней
    const metrics = getHealthMetrics();

    // Анализ цикла
    const cycleStart = new Date(latestCycle.cycle_start_date);
    const currentCycleDay = Math.floor((Date.now() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    let cyclePhase = 'unknown';
    
    if (currentCycleDay <= 5) cyclePhase = 'menstrual';
    else if (currentCycleDay <= 13) cyclePhase = 'follicular';
    else if (currentCycleDay <= 16) cyclePhase = 'ovulatory';
    else cyclePhase = 'luteal';

    // Анализ трендов цикла
    const cycleLengths = cycles.slice(0, 6).map(c => c.cycle_length).filter(Boolean);
    const averageLength = cycleLengths.reduce((sum, len) => sum + (len || 28), 0) / cycleLengths.length;
    const regularityScore = calculateRegularityScore(cycleLengths);

    // Анализ симптомов
    const allSymptoms = recentLogs.flatMap(log => log.symptoms || []);
    const symptomPatterns = analyzeSymptomPatterns(recentLogs);

    // Анализ настроения
    const moodRatings = recentLogs.map(log => log.mood_rating || 0).filter(rating => rating > 0);
    const currentMoodRating = moodRatings[0] || 5;
    const moodTrend = analyzeTrend(moodRatings);
    
    const stressLevels = recentLogs.map(log => log.stress_level || 0).filter(level => level > 0);
    const currentStressLevel = stressLevels[0] || 5;
    
    const energyLevels = recentLogs.map(log => log.energy_level || 0).filter(level => level > 0);
    const currentEnergyLevel = energyLevels[0] || 5;

    // Анализ корреляций
    const correlations = analyzeSymptomMoodCorrelations(recentLogs);

    // Анализ трендов здоровья
    const stepsData = healthData.filter(d => d.data_type === 'steps').slice(0, 14);
    const stepsValues = stepsData.map(d => d.data_value);
    const stepstrend = analyzeStepsTrend(stepsValues);

    const sleepData = healthData.filter(d => d.data_type === 'sleep').slice(0, 14);
    const sleepValues = sleepData.map(d => d.data_value);
    const sleepTrend = analyzeTrend(sleepValues);

    // Генерация прогнозов
    const nextCycleStart = new Date(cycleStart);
    nextCycleStart.setDate(nextCycleStart.getDate() + averageLength);
    
    const predictions = generatePredictions({
      cyclePhase,
      currentCycleDay,
      averageLength,
      symptomPatterns,
      stressLevel: currentStressLevel,
      energyLevel: currentEnergyLevel
    });

    return {
      currentCycleDay,
      cyclePhase,
      cycleTrends: {
        averageLength,
        regularityScore,
        symptomPatterns
      },
      healthMetrics: {
        steps: metrics.steps,
        sleep: metrics.sleepHours,
        heartRate: metrics.avgHeartRate,
        stepstrend: stepstrend as any,
        sleepTrend: sleepTrend as any
      },
      moodAnalysis: {
        currentRating: currentMoodRating,
        trend: moodTrend as any,
        stressLevel: currentStressLevel,
        energyLevel: currentEnergyLevel,
        correlations
      },
      predictions,
      recommendations: generatePersonalizedRecommendations({
        cyclePhase,
        stressLevel: currentStressLevel,
        energyLevel: currentEnergyLevel,
        symptomPatterns,
        stepsAverage: metrics.steps,
        sleepQuality: metrics.sleepHours
      })
    };
  };

  const calculateRegularityScore = (lengths: number[]): number => {
    if (lengths.length < 3) return 50;
    const variance = lengths.reduce((sum, len, _, arr) => {
      const mean = arr.reduce((s, l) => s + l, 0) / arr.length;
      return sum + Math.pow(len - mean, 2);
    }, 0) / lengths.length;
    return Math.max(0, 100 - (variance * 3));
  };

  const analyzeSymptomPatterns = (logs: any[]): string[] => {
    const symptomCounts: { [key: string]: number } = {};
    logs.forEach(log => {
      (log.symptoms || []).forEach((symptom: string) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });
    
    return Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symptom]) => symptom);
  };

  const analyzeTrend = (values: number[]): 'improving' | 'stable' | 'declining' => {
    if (values.length < 3) return 'stable';
    const firstHalf = values.slice(0, Math.ceil(values.length / 2));
    const secondHalf = values.slice(Math.ceil(values.length / 2));
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const threshold = Math.abs(firstAvg) * 0.1;
    if (secondAvg > firstAvg + threshold) return 'improving';
    if (secondAvg < firstAvg - threshold) return 'declining';
    return 'stable';
  };

  const analyzeStepsTrend = (values: number[]): 'increasing' | 'stable' | 'decreasing' => {
    if (values.length < 3) return 'stable';
    const firstHalf = values.slice(0, Math.ceil(values.length / 2));
    const secondHalf = values.slice(Math.ceil(values.length / 2));
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const threshold = Math.abs(firstAvg) * 0.1;
    if (secondAvg > firstAvg + threshold) return 'increasing';
    if (secondAvg < firstAvg - threshold) return 'decreasing';
    return 'stable';
  };

  const analyzeSymptomMoodCorrelations = (logs: any[]) => {
    const correlations: { symptom: string; impact: number }[] = [];
    const symptomImpacts: { [key: string]: number[] } = {};

    logs.forEach(log => {
      const moodRating = log.mood_rating || 5;
      (log.symptoms || []).forEach((symptom: string) => {
        if (!symptomImpacts[symptom]) symptomImpacts[symptom] = [];
        symptomImpacts[symptom].push(moodRating);
      });
    });

    Object.entries(symptomImpacts).forEach(([symptom, ratings]) => {
      if (ratings.length > 2) {
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        const impact = 5 - avgRating; // Чем ниже настроение, тем выше негативное влияние
        correlations.push({ symptom, impact });
      }
    });

    return correlations.sort((a, b) => b.impact - a.impact).slice(0, 3);
  };

  const generatePredictions = (data: any) => {
    const predictions = {
      nextCycleStart: new Date(Date.now() + data.averageLength * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expectedSymptoms: data.symptomPatterns.slice(0, 3),
      optimalWorkoutDays: [] as number[],
      nutritionFocus: [] as string[]
    };

    // Оптимальные дни для тренировок в зависимости от фазы
    if (data.cyclePhase === 'follicular') {
      predictions.optimalWorkoutDays = [8, 10, 12];
    } else if (data.cyclePhase === 'ovulatory') {
      predictions.optimalWorkoutDays = [14, 15, 16];
    } else if (data.cyclePhase === 'luteal') {
      predictions.optimalWorkoutDays = [20, 22, 24];
    }

    // Фокус питания
    if (data.stressLevel > 6) {
      predictions.nutritionFocus.push('Магний', 'Адаптогены');
    }
    if (data.energyLevel < 5) {
      predictions.nutritionFocus.push('Железо', 'B-витамины');
    }

    return predictions;
  };

  const generatePersonalizedRecommendations = (data: any) => ({
    immediate: [
      data.cyclePhase === 'menstrual' ? 'Увеличьте потребление железа' : 'Планируйте интенсивные тренировки',
      data.stressLevel > 6 ? 'Попробуйте 10-минутную медитацию' : 'Отличное время для новых челленджей',
      data.energyLevel < 5 ? 'Сделайте легкую прогулку на свежем воздухе' : 'Используйте высокую энергию для продуктивности'
    ],
    weekly: [
      'Запланируйте 3-4 тренировки умеренной интенсивности',
      'Добавьте в рацион больше листовых зеленых овощей',
      'Обеспечьте 7-8 часов качественного сна'
    ],
    lifestyle: [
      'Ведите дневник симптомов для лучшего понимания паттернов',
      'Практикуйте техники управления стрессом',
      'Поддерживайте социальные связи'
    ],
    medical: data.stressLevel > 8 || data.energyLevel < 3 ? [
      'Рассмотрите консультацию с гинекологом-эндокринологом',
      'Сдайте анализы на гормоны щитовидной железы'
    ] : []
  });

  const generateHealthInsights = (context: ComprehensiveHealthContext) => {
    const insights: HealthInsight[] = [];

    // Инсайт о тренде цикла
    if (context.cycleTrends?.regularityScore !== undefined) {
      insights.push({
        id: '1',
        type: 'trend',
        title: 'Регулярность цикла',
        description: `Ваш цикл регулярен на ${context.cycleTrends.regularityScore.toFixed(0)}%. ${
          context.cycleTrends.regularityScore > 80 ? 'Отличный показатель!' : 
          context.cycleTrends.regularityScore > 60 ? 'Хороший уровень регулярности.' : 
          'Стоит обратить внимание на факторы, влияющие на регулярность.'
        }`,
        confidence: 85,
        actionable: context.cycleTrends.regularityScore < 70
      });
    }

    // Инсайт о корреляциях
    if (context.moodAnalysis?.correlations && context.moodAnalysis.correlations.length > 0) {
      const topCorrelation = context.moodAnalysis.correlations[0];
      insights.push({
        id: '2',
        type: 'correlation',
        title: 'Влияние симптомов на настроение',
        description: `"${topCorrelation.symptom}" наиболее сильно влияет на ваше настроение. Обратите внимание на способы смягчения этого симптома.`,
        confidence: 78,
        actionable: true
      });
    }

    // Инсайт о здоровье
    if (context.healthMetrics?.steps !== undefined) {
      const stepsGoal = 8000;
      const percentage = (context.healthMetrics.steps / stepsGoal) * 100;
      insights.push({
        id: '3',
        type: 'recommendation',
        title: 'Физическая активность',
        description: `Вы достигли ${percentage.toFixed(0)}% от рекомендуемой нормы активности. ${
          percentage >= 100 ? 'Отличная работа!' : 
          percentage >= 75 ? 'Почти достигли цели!' : 
          'Попробуйте увеличить ежедневную активность.'
        }`,
        confidence: 90,
        actionable: percentage < 100
      });
    }

    // Предиктивный инсайт
    if (context.predictions) {
      insights.push({
        id: '4',
        type: 'prediction',
        title: 'Прогноз симптомов',
        description: `На основе ваших данных, в следующем цикле возможны: ${context.predictions.expectedSymptoms.join(', ')}. Подготовьтесь заранее!`,
        confidence: 72,
        actionable: true
      });
    }

    setHealthInsights(insights);
  };

  const generateAdvancedAIResponse = async (userMessage: string): Promise<Message> => {
    const contextString = `
Комплексный контекст здоровья:
- День цикла: ${healthContext.currentCycleDay || 'неизвестно'} (${healthContext.cyclePhase} фаза)
- Регулярность цикла: ${healthContext.cycleTrends?.regularityScore?.toFixed(0) || 'неизвестно'}%
- Активность: ${healthContext.healthMetrics?.steps || 'нет данных'} шагов (тренд: ${healthContext.healthMetrics?.stepstrend || 'стабильный'})
- Сон: ${healthContext.healthMetrics?.sleep || 'нет данных'} часов (тренд: ${healthContext.healthMetrics?.sleepTrend || 'стабильный'})
- Настроение: ${healthContext.moodAnalysis?.currentRating || 'неизвестно'}/10 (тренд: ${healthContext.moodAnalysis?.trend || 'стабильное'})
- Стресс: ${healthContext.moodAnalysis?.stressLevel || 'неизвестно'}/10
- Энергия: ${healthContext.moodAnalysis?.energyLevel || 'неизвестно'}/10
- Основные симптомы: ${healthContext.cycleTrends?.symptomPatterns?.join(', ') || 'нет данных'}
- Корреляции: ${healthContext.moodAnalysis?.correlations?.map(c => `${c.symptom} (влияние: ${c.impact.toFixed(1)})`).join(', ') || 'нет данных'}

Прогнозы:
- Следующий цикл: ${healthContext.predictions?.nextCycleStart || 'неизвестно'}
- Ожидаемые симптомы: ${healthContext.predictions?.expectedSymptoms?.join(', ') || 'нет прогноза'}
- Оптимальные дни для тренировок: ${healthContext.predictions?.optimalWorkoutDays?.join(', ') || 'нет данных'}

Вопрос пользователя: ${userMessage}
`;

    try {
      const response = await generateAdvancedMockResponse(userMessage, healthContext);
      
      return {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        context: response.context as 'cycle' | 'symptoms' | 'health' | 'general' | 'analysis',
        attachments: response.attachments
      };
    } catch (error) {
      console.error('Ошибка при обращении к ИИ:', error);
      return {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте переформулировать вопрос.',
        timestamp: new Date()
      };
    }
  };

  const generateAdvancedMockResponse = async (message: string, context: ComprehensiveHealthContext) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('анализ') || lowerMessage.includes('состояние')) {
      return {
        content: `На основе анализа ваших данных за последние 30 дней:

🔍 **Общее состояние**: ${context.cycleTrends?.regularityScore && context.cycleTrends.regularityScore > 70 ? 'Хорошее' : 'Требует внимания'}

📊 **Ключевые показатели**:
• Регулярность цикла: ${context.cycleTrends?.regularityScore?.toFixed(0) || 'н/д'}%
• Текущая фаза: ${context.cyclePhase} (день ${context.currentCycleDay})
• Средняя активность: ${context.healthMetrics?.steps || 'н/д'} шагов/день
• Качество сна: ${context.healthMetrics?.sleep || 'н/д'} часов

🎯 **Главные рекомендации**:
${context.recommendations?.immediate?.map(rec => `• ${rec}`).join('\n') || '• Продолжайте ведение дневника здоровья'}

📈 **Прогноз**: Следующий цикл ожидается ${context.predictions?.nextCycleStart || 'через 28 дней'}`,
        context: 'analysis',
        attachments: [{
          type: 'chart' as const,
          data: { type: 'health_overview', metrics: context.healthMetrics }
        }]
      };
    }

    if (lowerMessage.includes('тренировк') || lowerMessage.includes('спорт')) {
      const optimalDays = context.predictions?.optimalWorkoutDays || [];
      return {
        content: `🏃‍♀️ **Персональные рекомендации по тренировкам**:

⚡ **Сейчас (${context.cyclePhase} фаза)**:
${context.cyclePhase === 'follicular' ? '• Отличное время для интенсивных тренировок\n• Высокая энергия и мотивация\n• Силовые и HIIT тренировки' :
  context.cyclePhase === 'ovulatory' ? '• Пиковые возможности организма\n• Максимальная интенсивность\n• Групповые тренировки и соревнования' :
  context.cyclePhase === 'luteal' ? '• Умеренные нагрузки\n• Больше внимания восстановлению\n• Йога, пилатес, растяжка' :
  '• Легкие тренировки\n• Фокус на расслаблении\n• Прогулки, мягкая йога'}

📅 **Оптимальные дни для интенсивных тренировок**: ${optimalDays.length ? optimalDays.join(', ') : 'Определяем...'}

📊 **Ваши показатели**: 
• Средняя активность: ${context.healthMetrics?.steps || 'н/д'} шагов
• Уровень энергии: ${context.moodAnalysis?.energyLevel || 'н/д'}/10
• Тренд активности: ${context.healthMetrics?.stepstrend === 'increasing' ? '📈 Растет' : context.healthMetrics?.stepstrend === 'decreasing' ? '📉 Снижается' : '➡️ Стабильно'}`,
        context: 'health',
        attachments: [{
          type: 'recommendation' as const,
          data: { type: 'workout_plan', phase: context.cyclePhase }
        }]
      };
    }

    if (lowerMessage.includes('питание') || lowerMessage.includes('еда')) {
      const nutritionFocus = context.predictions?.nutritionFocus || [];
      return {
        content: `🍎 **Персональные рекомендации по питанию**:

🎯 **Фокус сейчас** (${context.cyclePhase} фаза):
${context.cyclePhase === 'menstrual' ? '• Железо: красное мясо, шпинат, гранат\n• Магний: темный шоколад, орехи\n• Теплые жидкости и успокаивающие травяные чаи' :
  context.cyclePhase === 'follicular' ? '• Белок для роста тканей\n• Комплексные углеводы для энергии\n• Антиоксиданты: ягоды, зеленый чай' :
  context.cyclePhase === 'ovulatory' ? '• Клетчатка для детоксикации\n• Противовоспалительные продукты\n• Здоровые жиры: авокадо, орехи' :
  '• Кальций и магний для ПМС\n• Сложные углеводы для стабилизации настроения\n• Омега-3: рыба, льняное семя'}

🧪 **Дополнительно на основе ваших данных**:
${nutritionFocus.length ? nutritionFocus.map(focus => `• ${focus}`).join('\n') : '• Базовая сбалансированная диета'}

${context.moodAnalysis?.stressLevel && context.moodAnalysis.stressLevel > 6 ? '\n⚠️ **Антистресс**: Добавьте адаптогены (ашваганда), зеленый чай, избегайте кофеина после 14:00' : ''}`,
        context: 'health'
      };
    }

    if (lowerMessage.includes('симптом') || lowerMessage.includes('самочувств')) {
      const correlations = context.moodAnalysis?.correlations || [];
      return {
        content: `🩺 **Анализ ваших симптомов**:

📋 **Частые симптомы**: ${context.cycleTrends?.symptomPatterns?.join(', ') || 'Данных недостаточно'}

🔗 **Влияние на настроение**:
${correlations.map(corr => `• ${corr.symptom}: влияние ${corr.impact.toFixed(1)}/10`).join('\n') || '• Анализируем закономерности...'}

📊 **Текущее состояние**:
• Настроение: ${healthContext.moodAnalysis?.currentRating || 'н/д'}/10
• Стресс: ${healthContext.moodAnalysis?.stressLevel || 'н/д'}/10  
• Энергия: ${healthContext.moodAnalysis?.energyLevel || 'н/д'}/10

💡 **Рекомендации**:
${context.moodAnalysis?.stressLevel && context.moodAnalysis.stressLevel > 6 ? 
  '• Высокий стресс: практикуйте дыхательные упражнения\n• Рассмотрите медитацию или йогу\n• Обратитесь к специалисту при необходимости' :
  '• Ведите подробный дневник симптомов\n• Обратите внимание на триггеры\n• Поддерживайте здоровый режим сна'}

${correlations.length > 0 ? `\n🎯 **Приоритет**: Работайте над снижением "${correlations[0].symptom}" - это наиболее влияет на ваше самочувствие.` : ''}`,
        context: 'symptoms'
      };
    }

    if (lowerMessage.includes('прогноз') || lowerMessage.includes('предсказ')) {
      return {
        content: `🔮 **Прогнозы на основе ваших данных**:

📅 **Следующий цикл**:
• Ожидается: ${context.predictions?.nextCycleStart || 'через ~28 дней'}
• Длина цикла: ${context.cycleTrends?.averageLength?.toFixed(0) || '28'} дней

⚠️ **Возможные симптомы**: 
${context.predictions?.expectedSymptoms?.map(symptom => `• ${symptom}`).join('\n') || '• На основе данных определяем паттерны...'}

🏃‍♀️ **Оптимальные дни для активности**: 
${context.predictions?.optimalWorkoutDays?.map(day => `• День ${day} цикла`).join('\n') || '• Планируем под вашу фазу цикла'}

🎯 **Подготовка**:
• Запаситесь продуктами с ${context.predictions?.nutritionFocus?.join(', ') || 'железом и магнием'}
• Планируйте расслабляющие активности в первые дни цикла
• Используйте фолликулярную фазу для важных проектов

📊 **Точность прогноза**: ${context.cycleTrends?.regularityScore ? (context.cycleTrends.regularityScore * 0.8).toFixed(0) : '70'}% на основе регулярности ваших циклов`,
        context: 'analysis'
      };
    }

    // Общий ответ
    return {
      content: `Привет! Я анализирую ваши данные и готов дать персонализированные рекомендации по тренировкам, питанию, симптомам и прогнозам. Что вас интересует?`,
      context: 'general'
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const assistantMessage = await generateAdvancedAIResponse(inputMessage);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Ошибка при получении ответа от ИИ-ассистента');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Инициализация приветственного сообщения
  useEffect(() => {
    if (messages.length === 0 && healthContext.currentCycleDay) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        type: 'assistant',
        content: `Привет! Я ваш улучшенный ИИ-ассистент по здоровью 🤖

📊 **Быстрая сводка**:
• День ${healthContext.currentCycleDay} цикла (${healthContext.cyclePhase} фаза)
• Активность: ${healthContext.healthMetrics?.steps || 'н/д'} шагов
• Настроение: ${healthContext.moodAnalysis?.currentRating || 'н/д'}/10

Я проанализировал ваши данные и готов дать персонализированные рекомендации по тренировкам, питанию, симптомам и прогнозам. Что вас интересует?`,
        timestamp: new Date(),
        context: 'general'
      };
      setMessages([welcomeMessage]);
    }
  }, [healthContext, messages.length]);

  const InsightCard = ({ insight }: { insight: HealthInsight }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm">{insight.title}</h4>
          <Badge variant={insight.type === 'trend' ? 'default' : insight.type === 'correlation' ? 'secondary' : 'outline'}>
            {insight.type === 'trend' ? 'Тренд' :
             insight.type === 'correlation' ? 'Связь' :
             insight.type === 'prediction' ? 'Прогноз' : 'Совет'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Точность: {insight.confidence}%</span>
          {insight.actionable && (
            <Badge variant="outline" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Действие
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const quickQuestions = [
    'Проанализируй мое текущее состояние',
    'Какие тренировки подходят сейчас?',
    'Что есть в мою фазу цикла?',
    'Спрогнозируй мои симптомы',
    'Как улучшить качество сна?'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Улучшенный ИИ-Ассистент</span>
              </CardTitle>
              <CardDescription>
                Глубокая аналитика здоровья с персонализированными инсайтами
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Очистить
            </Button>
          </div>
          
          {healthContext.currentCycleDay && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">
                День {healthContext.currentCycleDay} • {healthContext.cyclePhase}
              </Badge>
              <Badge variant="outline">
                {healthContext.healthMetrics?.steps || 0} шагов
              </Badge>
              {healthContext.moodAnalysis?.currentRating && (
                <Badge variant={healthContext.moodAnalysis.currentRating > 6 ? 'default' : 'secondary'}>
                  Настроение: {healthContext.moodAnalysis.currentRating}/10
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">
                <Bot className="w-4 h-4 mr-2" />
                Чат
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Sparkles className="w-4 h-4 mr-2" />
                Инсайты
              </TabsTrigger>
              <TabsTrigger value="trends">
                <TrendingUp className="w-4 h-4 mr-2" />
                Тренды
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="h-[500px] flex flex-col">
                    <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.type === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="flex items-start space-x-2">
                                {message.type === 'assistant' ? (
                                  <Brain className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                                ) : (
                                  <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {message.attachments.map((attachment, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {attachment.type === 'chart' ? '📊 График' :
                                           attachment.type === 'recommendation' ? '💡 Рекомендация' : '🔍 Инсайт'}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg p-3">
                              <div className="flex items-center space-x-2">
                                <Brain className="w-4 h-4 text-purple-600" />
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {messages.length <= 1 && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Попробуйте эти вопросы:</p>
                          <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((question, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => setInputMessage(question)}
                                className="text-xs"
                              >
                                {question}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <Separator className="my-4" />
                      </>
                    )}

                    <div className="flex space-x-2 mt-4">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Спросите о здоровье, тренировках, питании..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Контекст ИИ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-600">Циклов:</span>
                            <span className="font-medium ml-1">{cycles.length}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Записей:</span>
                            <span className="font-medium ml-1">{logs.length}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Данных:</span>
                            <span className="font-medium ml-1">{healthData.length}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Инсайтов:</span>
                            <span className="font-medium ml-1">{healthInsights.length}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Персональные инсайты</h3>
                {healthInsights.length > 0 ? (
                  healthInsights.map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Собираем данные для генерации персональных инсайтов...
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Анализ трендов</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {healthContext.healthMetrics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-medium">Активность</h4>
                          <p className="text-2xl font-bold">{healthContext.healthMetrics.steps}</p>
                          <p className="text-sm text-gray-600">
                            {healthContext.healthMetrics.stepstrend === 'increasing' ? '📈 Растет' :
                             healthContext.healthMetrics.stepstrend === 'decreasing' ? '📉 Снижается' : '➡️ Стабильно'}
                          </p>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <h4 className="font-medium">Пульс</h4>
                          <p className="text-2xl font-bold">{healthContext.healthMetrics.heartRate || 'н/д'}</p>
                          <p className="text-sm text-gray-600">уд/мин</p>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Moon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-medium">Сон</h4>
                          <p className="text-2xl font-bold">{healthContext.healthMetrics.sleep || 'н/д'}</p>
                          <p className="text-sm text-gray-600">
                            {healthContext.healthMetrics.sleepTrend === 'improving' ? '📈 Улучшается' :
                             healthContext.healthMetrics.sleepTrend === 'declining' ? '📉 Ухудшается' : '➡️ Стабильно'}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedHealthAIAssistant;
