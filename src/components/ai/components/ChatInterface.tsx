
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Send, User, Bot } from "lucide-react";
import { Message, ComprehensiveHealthContext } from '../types/aiTypes';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  healthContext: ComprehensiveHealthContext;
  cycles: any[];
  logs: any[];
  healthData: any[];
  healthInsights: any[];
  generateAdvancedAIResponse: (message: string) => Promise<Message>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
  healthContext,
  cycles,
  logs,
  healthData,
  healthInsights,
  generateAdvancedAIResponse,
  isLoading,
  setIsLoading
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const quickQuestions = [
    'Проанализируй мое текущее состояние',
    'Какие тренировки подходят сейчас?',
    'Что есть в мою фазу цикла?',
    'Спрогнозируй мои симптомы',
    'Как улучшить качество сна?'
  ];

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

  return (
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
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-medium mb-3">Контекст ИИ</h3>
          <div className="space-y-3">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
