
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Brain, Smile, Target, TrendingUp, AlertCircle } from "lucide-react";

interface EmotionalState {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
  anxiety: number;
  stress: number;
}

interface EmotionalInsight {
  id: string;
  type: 'pattern' | 'trigger' | 'recommendation' | 'support';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  supportGroups?: string[];
}

interface EmotionalAnalysis {
  dominantEmotion: keyof EmotionalState;
  emotionalBalance: number;
  stressLevel: number;
  insights: EmotionalInsight[];
  recommendations: string[];
  supportNeeded: boolean;
}

const EmotionalIntelligenceEngine: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionalHistory, setEmotionalHistory] = useState<Array<{
    date: string; // Changed from Date to string to fix the type error
    emotions: EmotionalState;
    text: string;
  }>>([]);

  const analyzeEmotionalState = async (text: string): Promise<EmotionalAnalysis> => {
    // Simulate AI emotional analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock emotional detection based on keywords
    const emotions: EmotionalState = {
      joy: Math.random() * 100,
      sadness: Math.random() * 100,
      anger: Math.random() * 100,
      fear: Math.random() * 100,
      surprise: Math.random() * 100,
      disgust: Math.random() * 100,
      anxiety: Math.random() * 100,
      stress: Math.random() * 100
    };

    const dominantEmotion = Object.entries(emotions)
      .reduce((a, b) => emotions[a[0] as keyof EmotionalState] > emotions[b[0] as keyof EmotionalState] ? a : b)[0] as keyof EmotionalState;

    const emotionalBalance = Object.values(emotions).reduce((sum, val) => sum + (val > 50 ? val - 50 : 50 - val), 0) / 8;
    const stressLevel = (emotions.stress + emotions.anxiety) / 2;

    const insights: EmotionalInsight[] = [
      {
        id: '1',
        type: 'pattern',
        title: 'Паттерн стресса',
        description: 'Обнаружены признаки повышенного стресса в последние дни',
        confidence: 0.85,
        actionable: true,
        supportGroups: ['stress-management', 'anxiety-support']
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Техники релаксации',
        description: 'Рекомендуем попробовать дыхательные упражнения и медитацию',
        confidence: 0.9,
        actionable: true
      }
    ];

    return {
      dominantEmotion,
      emotionalBalance,
      stressLevel,
      insights,
      recommendations: [
        'Уделите время для отдыха и восстановления',
        'Попробуйте техники осознанности',
        'Обратитесь к специалисту при необходимости'
      ],
      supportNeeded: stressLevel > 70
    };
  };

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeEmotionalState(userInput);
      setAnalysis(result);
      
      // Add to history
      const newEntry = {
        date: new Date().toISOString(), // Convert Date to string
        emotions: {
          joy: Math.random() * 100,
          sadness: Math.random() * 100,
          anger: Math.random() * 100,
          fear: Math.random() * 100,
          surprise: Math.random() * 100,
          disgust: Math.random() * 100,
          anxiety: Math.random() * 100,
          stress: Math.random() * 100
        },
        text: userInput
      };
      
      setEmotionalHistory(prev => [newEntry, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error analyzing emotional state:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionColor = (emotion: keyof EmotionalState, value: number) => {
    const colors = {
      joy: 'bg-yellow-500',
      sadness: 'bg-blue-500',
      anger: 'bg-red-500',
      fear: 'bg-purple-500',
      surprise: 'bg-orange-500',
      disgust: 'bg-green-500',
      anxiety: 'bg-indigo-500',
      stress: 'bg-red-600'
    };
    return colors[emotion];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Анализ эмоционального состояния</span>
          </CardTitle>
          <CardDescription>
            Поделитесь своими мыслями и чувствами для получения персонализированной поддержки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Расскажите о ваших чувствах, настроении, переживаниях..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={!userInput.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Анализируем...' : 'Анализировать состояние'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span>Результаты анализа</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysis.dominantEmotion}
                  </div>
                  <div className="text-sm text-gray-600">Доминирующая эмоция</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(analysis.emotionalBalance)}%
                  </div>
                  <div className="text-sm text-gray-600">Эмоциональный баланс</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {Math.round(analysis.stressLevel)}%
                  </div>
                  <div className="text-sm text-gray-600">Уровень стресса</div>
                </div>
                <div className="text-center">
                  <Badge variant={analysis.supportNeeded ? "destructive" : "secondary"}>
                    {analysis.supportNeeded ? 'Нужна поддержка' : 'Стабильно'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Инсайты и рекомендации:</h4>
                {analysis.insights.map((insight) => (
                  <div key={insight.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{insight.title}</span>
                      <Badge variant="outline">{Math.round(insight.confidence * 100)}%</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Рекомендации:</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <Target className="w-3 h-3 mr-2 text-green-600" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {emotionalHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>История эмоций</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emotionalHistory.slice(0, 3).map((entry, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(entry.date).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="text-sm line-clamp-2">{entry.text}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionalIntelligenceEngine;
