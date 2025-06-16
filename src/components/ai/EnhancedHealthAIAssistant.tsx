
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, RefreshCw, Bot, Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMenstrualCycle } from "@/hooks/useMenstrualCycle";
import { useSymptomMoodLog } from "@/hooks/useSymptomMoodLog";
import { useHealthData } from "@/hooks/useHealthData";
import { Message } from './types/aiTypes';
import { useHealthAnalysis } from './hooks/useHealthAnalysis';
import { useAIResponse } from './hooks/useAIResponse';
import ChatInterface from './components/ChatInterface';
import InsightsView from './components/InsightsView';
import TrendsView from './components/TrendsView';

const EnhancedHealthAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'trends'>('chat');
  
  const { user } = useAuth();
  const { cycles } = useMenstrualCycle();
  const { logs } = useSymptomMoodLog();
  const { healthData, getHealthMetrics } = useHealthData();

  const { healthContext, healthInsights } = useHealthAnalysis(cycles, logs, healthData, getHealthMetrics);
  const { generateAdvancedAIResponse, isLoading, setIsLoading } = useAIResponse(healthContext);

  const clearChat = () => {
    setMessages([]);
  };

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
              <ChatInterface
                messages={messages}
                setMessages={setMessages}
                healthContext={healthContext}
                cycles={cycles}
                logs={logs}
                healthData={healthData}
                healthInsights={healthInsights}
                generateAdvancedAIResponse={generateAdvancedAIResponse}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <InsightsView healthInsights={healthInsights} />
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <TrendsView healthContext={healthContext} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedHealthAIAssistant;
