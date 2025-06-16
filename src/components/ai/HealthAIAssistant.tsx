
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Send, Sparkles, RefreshCw, User, Bot } from "lucide-react";
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
  context?: 'cycle' | 'symptoms' | 'health' | 'general';
}

interface HealthContext {
  currentCycleDay?: number;
  recentSymptoms?: string[];
  moodTrend?: 'improving' | 'stable' | 'declining';
  healthMetrics?: {
    steps: number;
    sleep: number;
    heartRate: number;
  };
}

const HealthAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [healthContext, setHealthContext] = useState<HealthContext>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { cycles } = useMenstrualCycle();
  const { logs } = useSymptomMoodLog();
  const { getHealthMetrics } = useHealthData();

  // Инициализация контекста здоровья
  useEffect(() => {
    if (cycles.length > 0 && logs.length > 0) {
      const latestCycle = cycles[0];
      const cycleStart = new Date(latestCycle.cycle_start_date);
      const currentCycleDay = Math.floor((Date.now() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const recentLogs = logs.slice(0, 7);
      const recentSymptoms = recentLogs.flatMap(log => log.symptoms || []);
      
      const moodRatings = recentLogs.map(log => log.mood_rating || 0).filter(rating => rating > 0);
      let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
      
      if (moodRatings.length >= 3) {
        const firstHalf = moodRatings.slice(0, Math.ceil(moodRatings.length / 2));
        const secondHalf = moodRatings.slice(Math.ceil(moodRatings.length / 2));
        const firstAvg = firstHalf.reduce((sum, rating) => sum + rating, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, rating) => sum + rating, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 0.5) moodTrend = 'improving';
        else if (secondAvg < firstAvg - 0.5) moodTrend = 'declining';
      }

      const healthMetrics = getHealthMetrics();

      setHealthContext({
        currentCycleDay,
        recentSymptoms: [...new Set(recentSymptoms)],
        moodTrend,
        healthMetrics
      });
    }
  }, [cycles, logs]);

  // Приветственное сообщение
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        type: 'assistant',
        content: `Привет! Я ваш персональный ИИ-ассистент по женскому здоровью. Я могу помочь с вопросами о менструальном цикле, симптомах, планировании беременности и общем самочувствии. 

${healthContext.currentCycleDay ? `Сейчас у вас ${healthContext.currentCycleDay} день цикла.` : ''} Что вас интересует?`,
        timestamp: new Date(),
        context: 'general'
      };
      setMessages([welcomeMessage]);
    }
  }, [healthContext]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Формируем контекст для ИИ
    const contextString = `
Контекст пользователя:
- День цикла: ${healthContext.currentCycleDay || 'неизвестно'}
- Недавние симптомы: ${healthContext.recentSymptoms?.join(', ') || 'нет данных'}
- Тенденция настроения: ${healthContext.moodTrend || 'стабильное'}
- Активность (шаги): ${healthContext.healthMetrics?.steps || 'нет данных'}
- Сон: ${healthContext.healthMetrics?.sleep || 'нет данных'} часов
- Пульс: ${healthContext.healthMetrics?.heartRate || 'нет данных'}

Вопрос пользователя: ${userMessage}
`;

    try {
      // Здесь должен быть вызов к реальному ИИ API
      // Для демонстрации используем mock-ответы
      const mockResponses = await generateMockAIResponse(userMessage, healthContext);
      return mockResponses;
    } catch (error) {
      console.error('Ошибка при обращении к ИИ:', error);
      return 'Извините, произошла ошибка. Попробуйте переформулировать вопрос или обратитесь позже.';
    }
  };

  const generateMockAIResponse = async (message: string, context: HealthContext): Promise<string> => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('цикл') || lowerMessage.includes('месячные')) {
      if (context.currentCycleDay) {
        if (context.currentCycleDay <= 7) {
          return `Сейчас у вас менструальная фаза (${context.currentCycleDay} день цикла). В это время важно:
• Отдыхать больше обычного
• Следить за уровнем железа в организме
• Избегать интенсивных тренировок
• Пить больше воды и теплых напитков

Если есть сильные боли, рассмотрите легкие обезболивающие или теплые компрессы.`;
        } else if (context.currentCycleDay <= 14) {
          return `Вы в фолликулярной фазе (${context.currentCycleDay} день цикла). Это отличное время для:
• Интенсивных тренировок
• Начала новых проектов
• Социальной активности
• Изучения нового

Уровень эстрогена растет, что дает больше энергии и концентрации.`;
        } else if (context.currentCycleDay <= 21) {
          return `Вы в лютеиновой фазе (${context.currentCycleDay} день цикла). Рекомендую:
• Умеренные физические нагрузки
• Больше времени для отдыха
• Поддержку правильного питания
• Мониторинг настроения

Если планируете беременность, это важный период для наблюдения.`;
        }
      }
      return 'Для более точных рекомендаций, пожалуйста, ведите регулярные записи о своем цикле в приложении.';
    }

    if (lowerMessage.includes('симптом') || lowerMessage.includes('боль')) {
      if (context.recentSymptoms && context.recentSymptoms.length > 0) {
        return `Я вижу, что недавно вы отмечали: ${context.recentSymptoms.join(', ')}.

Общие рекомендации:
• Ведите подробный дневник симптомов
• Обратите внимание на связь с фазами цикла
• При сильных или необычных симптомах консультируйтесь с врачом
• Попробуйте методы релаксации

Хотите, чтобы я дал более конкретные советы по какому-то симптому?`;
      }
      return 'Для анализа симптомов важно вести регулярные записи. Начните отмечать симптомы в дневнике здоровья для получения персонализированных рекомендаций.';
    }

    if (lowerMessage.includes('настроение') || lowerMessage.includes('пмс')) {
      if (context.moodTrend === 'declining') {
        return `Я заметила снижение вашего настроения в последнее время. Рекомендую:
• Регулярные прогулки на свежем воздухе
• Практику медитации или йоги
• Поддержку близких
• При необходимости - консультацию специалиста

ПМС можно облегчить с помощью правильного питания, физической активности и управления стрессом.`;
      }
      return 'Колебания настроения в разные фазы цикла - это нормально. Ведите дневник настроения для выявления паттернов и лучшего понимания своего тела.';
    }

    if (lowerMessage.includes('беременность') || lowerMessage.includes('планирование')) {
      return `При планировании беременности важно:
• Принимать фолиевую кислоту за 3 месяца до зачатия
• Отслеживать овуляцию
• Вести здоровый образ жизни
• Пройти предзачаточное обследование
• Исключить вредные привычки

В приложении есть специальный раздел для планирования беременности с детальными рекомендациями.`;
    }

    if (lowerMessage.includes('активность') || lowerMessage.includes('тренировк')) {
      if (context.healthMetrics?.steps && context.healthMetrics.steps < 5000) {
        return `Вижу, что ваша активность ниже рекомендуемой. В зависимости от фазы цикла:
• Менструальная фаза: легкие прогулки, йога
• Фолликулярная: кардио, силовые тренировки
• Овуляторная: пиковые нагрузки
• Лютеиновая: умеренные тренировки

Начните с 15-20 минут активности в день и постепенно увеличивайте.`;
      }
      return 'Регулярная физическая активность помогает регулировать гормоны и улучшает самочувствие. Адаптируйте интенсивность под фазу цикла.';
    }

    // Общий ответ
    return `Спасибо за ваш вопрос! Я специализируюсь на женском здоровье и могу помочь с:
• Вопросами о менструальном цикле
• Анализом симптомов и настроения
• Планированием беременности
• Рекомендациями по активности и питанию
• Общими вопросами о здоровье

Уточните, пожалуйста, что именно вас интересует?`;
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
      const aiResponse = await generateAIResponse(inputMessage);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Ошибка при получении ответа от ИИ-ассистента');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInputMessage('');
  };

  const quickQuestions = [
    'Что происходит в моем цикле сейчас?',
    'Как облегчить симптомы ПМС?',
    'Когда лучше планировать беременность?',
    'Какие тренировки подходят сейчас?',
    'Как улучшить настроение?'
  ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>ИИ-Ассистент по здоровью</span>
            </CardTitle>
            <CardDescription>
              Персональные консультации по женскому здоровью
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Очистить
          </Button>
        </div>
        
        {healthContext.currentCycleDay && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">
              День цикла: {healthContext.currentCycleDay}
            </Badge>
            {healthContext.moodTrend && (
              <Badge variant={healthContext.moodTrend === 'improving' ? 'default' : 'secondary'}>
                Настроение: {healthContext.moodTrend === 'improving' ? 'улучшается' : 
                           healthContext.moodTrend === 'declining' ? 'снижается' : 'стабильное'}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
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
                      <Bot className="w-4 h-4 mt-0.5 text-purple-600" />
                    ) : (
                      <User className="w-4 h-4 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                    <Bot className="w-4 h-4 text-purple-600" />
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
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Быстрые вопросы:</p>
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
            <Separator />
          </>
        )}

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Задайте вопрос о здоровье..."
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
      </CardContent>
    </Card>
  );
};

export default HealthAIAssistant;
