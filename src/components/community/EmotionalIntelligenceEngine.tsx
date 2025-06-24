import React, { useState, useEffect } from 'react';
import { Heart, Brain, Smile, Frown, AlertTriangle, Activity, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

interface EmotionalState {
  anxiety: number;
  stress: number;
  sadness: number;
  hope: number;
  confidence: number;
  overwhelm: number;
  timestamp: Date;
  triggers?: string[];
  copingMethods?: string[];
}

interface EmotionalAnalysis {
  overallScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  recommendations: Recommendation[];
  insights: string[];
}

interface Recommendation {
  type: 'breathing' | 'mindfulness' | 'support-group' | 'professional-help' | 'gentle-redirect';
  title: string;
  description: string;
  action: string;
  priority: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // minutes
}

interface CrisisProtocol {
  level: 'none' | 'mild' | 'moderate' | 'severe' | 'emergency';
  message: string;
  actions: string[];
  contacts?: {
    type: 'crisis-line' | 'emergency' | 'professional';
    name: string;
    phone: string;
  }[];
}

const EmotionalIntelligenceEngine: React.FC = () => {
  const [currentState, setCurrentState] = useState<EmotionalState | null>(null);
  const [analysis, setAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailedAssessment, setShowDetailedAssessment] = useState(false);
  const [crisisProtocol, setCrisisProtocol] = useState<CrisisProtocol | null>(null);

  // Emotional analysis algorithm
  const analyzeEmotionalState = async (text: string, sliderValues?: Partial<EmotionalState>) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with emotional keywords detection
    const anxietyWords = ['боюсь', 'страшно', 'тревожусь', 'переживаю', 'паника', 'волнуюсь'];
    const stressWords = ['устала', 'не справляюсь', 'давление', 'напряжение', 'измотана'];
    const sadnessWords = ['грустно', 'печально', 'одиноко', 'безнадежно', 'расстроена'];
    const hopeWords = ['надеюсь', 'верю', 'получится', 'лучше', 'поправлюсь', 'справлюсь'];
    const overwhelmWords = ['много', 'сложно', 'не могу', 'все сразу', 'перегружена'];

    const calculateEmotionScore = (words: string[]) => {
      const matches = words.filter(word => text.toLowerCase().includes(word));
      return Math.min((matches.length / words.length) * 100, 100);
    };

    // Wait for 2 seconds to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const baseState: EmotionalState = {
      anxiety: sliderValues?.anxiety ?? calculateEmotionScore(anxietyWords) + Math.random() * 30,
      stress: sliderValues?.stress ?? calculateEmotionScore(stressWords) + Math.random() * 25,
      sadness: sliderValues?.sadness ?? calculateEmotionScore(sadnessWords) + Math.random() * 20,
      hope: sliderValues?.hope ?? 100 - calculateEmotionScore(hopeWords) + Math.random() * 30,
      confidence: sliderValues?.confidence ?? 100 - calculateEmotionScore(anxietyWords) + Math.random() * 25,
      overwhelm: sliderValues?.overwhelm ?? calculateEmotionScore(overwhelmWords) + Math.random() * 35,
      timestamp: new Date()
    };

    // Ensure values are within bounds
    Object.keys(baseState).forEach(key => {
      if (typeof baseState[key as keyof EmotionalState] === 'number') {
        baseState[key as keyof EmotionalState] = Math.max(0, Math.min(100, baseState[key as keyof EmotionalState] as number));
      }
    });

    setCurrentState(baseState);
    
    // Generate analysis
    const analysisResult = generateAnalysis(baseState);
    setAnalysis(analysisResult);
    
    // Check for crisis markers
    const crisis = detectCrisisLevel(baseState, text);
    setCrisisProtocol(crisis);
    
    setIsAnalyzing(false);
  };

  const generateAnalysis = (state: EmotionalState): EmotionalAnalysis => {
    const avgNegative = (state.anxiety + state.stress + state.sadness + state.overwhelm) / 4;
    const avgPositive = (state.hope + state.confidence) / 2;
    const overallScore = Math.max(0, 100 - (avgNegative - avgPositive));
    
    let riskLevel: EmotionalAnalysis['riskLevel'] = 'low';
    if (avgNegative > 70) riskLevel = 'critical';
    else if (avgNegative > 50) riskLevel = 'high';
    else if (avgNegative > 30) riskLevel = 'moderate';

    const recommendations: Recommendation[] = [];
    
    if (state.anxiety > 60) {
      recommendations.push({
        type: 'breathing',
        title: 'Дыхательные техники',
        description: 'Техника "4-7-8" поможет успокоить нервную систему',
        action: 'Начать упражнение',
        priority: 1,
        estimatedDuration: 5
      });
    }

    if (state.stress > 50) {
      recommendations.push({
        type: 'mindfulness',
        title: 'Практика осознанности',
        description: 'Медитация поможет снизить уровень стресса',
        action: 'Попробовать медитацию',
        priority: 2,
        estimatedDuration: 10
      });
    }

    if (avgNegative > 60) {
      recommendations.push({
        type: 'support-group',
        title: 'Поддержка сообщества',
        description: 'Общение с женщинами в похожей ситуации',
        action: 'Найти группу поддержки',
        priority: 2,
        estimatedDuration: 60
      });
    }

    if (riskLevel === 'critical') {
      recommendations.unshift({
        type: 'professional-help',
        title: 'Профессиональная помощь',
        description: 'Рекомендуем обратиться к специалисту',
        action: 'Связаться с психологом',
        priority: 1,
        estimatedDuration: 60
      });
    }

    const insights = [
      state.anxiety > 50 ? 'Мы заметили повышенный уровень тревожности. Это нормальная реакция на заботу о здоровье.' : '',
      state.hope > 60 ? 'У вас есть внутренняя сила и надежда - это ваши главные ресурсы.' : '',
      state.stress > 60 ? 'Стресс может влиять на самочувствие. Важно найти способы расслабления.' : ''
    ].filter(insight => insight !== '');

    return {
      overallScore,
      riskLevel,
      recommendations: recommendations.sort((a, b) => a.priority - b.priority),
      insights
    };
  };

  const detectCrisisLevel = (state: EmotionalState, text: string): CrisisProtocol => {
    const emergencyMarkers = ['суицид', 'покончить', 'не могу больше', 'нет смысла', 'хочу умереть'];
    const severeMarkers = ['депрессия', 'не сплю', 'не ем', 'изоляция', 'безнадежно'];
    const moderateMarkers = ['очень тревожно', 'паника', 'не справляюсь'];

    const hasEmergencyMarkers = emergencyMarkers.some(marker => text.toLowerCase().includes(marker));
    const hasSevereMarkers = severeMarkers.some(marker => text.toLowerCase().includes(marker));
    const hasModerateMarkers = moderateMarkers.some(marker => text.toLowerCase().includes(marker));

    if (hasEmergencyMarkers || (state.anxiety > 90 && state.hope < 20)) {
      return {
        level: 'emergency',
        message: 'Мы очень беспокоимся о вас. Пожалуйста, обратитесь за немедленной помощью.',
        actions: [
          'Немедленно свяжитесь с кризисной службой',
          'Обратитесь в скорую помощь при необходимости',
          'Свяжитесь с близким человеком'
        ],
        contacts: [
          { type: 'crisis-line', name: 'Телефон доверия', phone: '8-800-2000-122' },
          { type: 'emergency', name: 'Скорая помощь', phone: '103' }
        ]
      };
    }

    if (hasSevereMarkers || (state.anxiety > 80 && state.overwhelm > 70)) {
      return {
        level: 'severe',
        message: 'Ваше состояние требует внимания. Рекомендуем обратиться к специалисту.',
        actions: [
          'Запишитесь к психологу',
          'Присоединитесь к группе поддержки',
          'Используйте техники релаксации'
        ]
      };
    }

    if (hasModerateMarkers || state.anxiety > 60) {
      return {
        level: 'moderate',
        message: 'Мы понимаем, что вам сейчас непросто. Есть способы помочь себе.',
        actions: [
          'Попробуйте дыхательные упражнения',
          'Поговорите с подругой или близким',
          'Рассмотрите возможность консультации'
        ]
      };
    }

    return {
      level: 'none',
      message: 'Ваше эмоциональное состояние в пределах нормы.',
      actions: ['Продолжайте заботиться о себе', 'Поддерживайте здоровые привычки']
    };
  };

  const startDetailedAssessment = () => {
    setShowDetailedAssessment(true);
  };

  const submitDetailedAssessment = (values: Partial<EmotionalState>) => {
    analyzeEmotionalState(textInput, values);
    setShowDetailedAssessment(false);
  };

  const getEmotionalColor = (level: number, inverse = false) => {
    const adjustedLevel = inverse ? 100 - level : level;
    if (adjustedLevel <= 30) return 'text-green-600';
    if (adjustedLevel <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: EmotionalAnalysis['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (risk: EmotionalAnalysis['riskLevel']) => {
    switch (risk) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (showDetailedAssessment) {
    return <DetailedEmotionalAssessment onSubmit={submitDetailedAssessment} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Анализ эмоционального состояния
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Поделитесь своими чувствами, и мы поможем лучше понять ваше состояние и найти способы поддержки.
        </p>
      </div>

      {/* Crisis Alert */}
      {crisisProtocol && crisisProtocol.level !== 'none' && (
        <Alert className={`${getRiskBgColor(crisisProtocol.level as any)} border-2`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">{crisisProtocol.message}</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {crisisProtocol.actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
              {crisisProtocol.contacts && (
                <div className="mt-3 space-y-1">
                  {crisisProtocol.contacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{contact.name}:</span>
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Text Input for Analysis */}
      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-pink-500" />
            Расскажите о своих чувствах
          </CardTitle>
          <CardDescription>
            Опишите, как вы себя чувствуете. Ваши слова помогут нам лучше понять ваше состояние.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Например: 'Я очень волнуюсь перед предстоящим обследованием. Не могу спать, постоянно думаю о плохом...'"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button 
              onClick={() => analyzeEmotionalState(textInput)}
              disabled={isAnalyzing || !textInput.trim()}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              {isAnalyzing ? 'Анализируем...' : 'Анализировать состояние'}
            </Button>
            <Button 
              variant="outline"
              onClick={startDetailedAssessment}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Подробная оценка
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && currentState && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className={`border-2 ${getRiskBgColor(analysis.riskLevel)}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Общая оценка эмоционального состояния
                </span>
                <span className={`text-2xl font-bold ${getRiskColor(analysis.riskLevel)}`}>
                  {Math.round(analysis.overallScore)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={analysis.overallScore} className="h-3" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getEmotionalColor(currentState.anxiety)}`}>
                      {Math.round(currentState.anxiety)}%
                    </div>
                    <div className="text-sm text-gray-600">Тревожность</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getEmotionalColor(currentState.stress)}`}>
                      {Math.round(currentState.stress)}%
                    </div>
                    <div className="text-sm text-gray-600">Стресс</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getEmotionalColor(currentState.hope, true)}`}>
                      {Math.round(currentState.hope)}%
                    </div>
                    <div className="text-sm text-gray-600">Надежда</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          {analysis.insights.length > 0 && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-500" />
                  Понимание вашего состояния
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.insights.map((insight, index) => (
                    <p key={index} className="text-gray-700 p-3 bg-blue-50 rounded-lg">
                      {insight}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-green-500" />
                Рекомендации для улучшения самочувствия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <span className="text-xs text-gray-500">{rec.estimatedDuration} мин</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <Button 
                      size="sm" 
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      {rec.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Detailed Assessment Component
const DetailedEmotionalAssessment: React.FC<{
  onSubmit: (values: Partial<EmotionalState>) => void;
}> = ({ onSubmit }) => {
  const [values, setValues] = useState({
    anxiety: [50],
    stress: [50],
    sadness: [50],
    hope: [50],
    confidence: [50],
    overwhelm: [50]
  });

  const handleSubmit = () => {
    const stateValues: Partial<EmotionalState> = {
      anxiety: values.anxiety[0],
      stress: values.stress[0],
      sadness: values.sadness[0],
      hope: values.hope[0],
      confidence: values.confidence[0],
      overwhelm: values.overwhelm[0]
    };
    onSubmit(stateValues);
  };

  return (
    <Card className="max-w-2xl mx-auto border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Подробная оценка эмоционального состояния
        </CardTitle>
        <CardDescription>
          Оцените каждый аспект вашего текущего состояния по шкале от 0 до 100
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(values).map(([key, value]) => {
          const labels = {
            anxiety: 'Тревожность',
            stress: 'Стресс', 
            sadness: 'Грусть',
            hope: 'Надежда',
            confidence: 'Уверенность',
            overwhelm: 'Перегруженность'
          };
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">
                  {labels[key as keyof typeof labels]}
                </label>
                <span className="text-sm text-gray-600">{value[0]}%</span>
              </div>
              <Slider
                value={value}
                onValueChange={(newValue) => setValues(prev => ({ ...prev, [key]: newValue }))}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          );
        })}
        
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">
            Получить анализ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalIntelligenceEngine;