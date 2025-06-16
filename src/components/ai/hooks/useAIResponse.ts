
import { useState } from 'react';
import { Message, ComprehensiveHealthContext } from '../types/aiTypes';
import { generateAdvancedMockResponse } from '../utils/mockAI';

export const useAIResponse = (healthContext: ComprehensiveHealthContext) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateAdvancedAIResponse = async (userMessage: string): Promise<Message> => {
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

  return { generateAdvancedAIResponse, isLoading, setIsLoading };
};
