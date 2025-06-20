
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Calculator, AlertTriangle } from "lucide-react";

interface PsychResult {
  phq9Score: number;
  gad7Score: number;
  pss10Score: number;
  depressionLevel: 'minimal' | 'mild' | 'moderate' | 'severe';
  anxietyLevel: 'minimal' | 'mild' | 'moderate' | 'severe';
  stressLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

const PsychologicalScales = () => {
  // PHQ-9 questions state
  const [phq9Answers, setPhq9Answers] = useState(Array(9).fill('0'));
  // GAD-7 questions state  
  const [gad7Answers, setGad7Answers] = useState(Array(7).fill('0'));
  // PSS-10 questions state
  const [pss10Answers, setPss10Answers] = useState(Array(10).fill('0'));

  const [result, setResult] = useState<PsychResult | null>(null);

  const phq9Questions = [
    "Отсутствие интереса или удовольствия от деятельности",
    "Чувство подавленности, депрессии или безнадежности",
    "Проблемы засыпания/сна или слишком много сна",
    "Чувство усталости или недостатка энергии",
    "Плохой аппетит или переедание",
    "Плохое мнение о себе, чувство неудачи или подведения семьи",
    "Трудности концентрации на задачах",
    "Медленные движения/речь или беспокойство/суетливость",
    "Мысли о смерти или самоповреждении"
  ];

  const gad7Questions = [
    "Чувство нервозности, беспокойства или напряженности",
    "Неспособность остановить или контролировать беспокойство",
    "Слишком сильное беспокойство о различных вещах",
    "Проблемы с расслаблением",
    "Такое беспокойство, что трудно усидеть на месте",
    "Легкое раздражение или злость",
    "Чувство страха, что может произойти что-то ужасное"
  ];

  const pss10Questions = [
    "Расстроены из-за неожиданных событий",
    "Чувствуете неспособность контролировать важные вещи в жизни",
    "Чувствуете нервозность и стресс",
    "Уверенно справляетесь с личными проблемами",
    "Чувствуете, что дела идут по-вашему",
    "Не можете справиться со всем, что нужно сделать",
    "Способны контролировать раздражения в жизни",
    "Чувствуете контроль над ситуацией",
    "Злитесь из-за вещей вне вашего контроля",
    "Чувствуете, что трудности накапливаются настолько, что не можете их преодолеть"
  ];

  const calculatePsychScales = () => {
    // PHQ-9 score calculation
    const phq9Score = phq9Answers.reduce((sum, answer) => sum + parseInt(answer), 0);

    // GAD-7 score calculation
    const gad7Score = gad7Answers.reduce((sum, answer) => sum + parseInt(answer), 0);

    // PSS-10 score calculation (reverse scoring for items 3, 4, 6, 7)
    const reverseItems = [3, 4, 6, 7];
    const pss10Score = pss10Answers.reduce((sum, answer, index) => {
      const value = parseInt(answer);
      return sum + (reverseItems.includes(index) ? 4 - value : value);
    }, 0);

    // Determine levels
    let depressionLevel: 'minimal' | 'mild' | 'moderate' | 'severe' = 'minimal';
    if (phq9Score >= 20) depressionLevel = 'severe';
    else if (phq9Score >= 15) depressionLevel = 'moderate';
    else if (phq9Score >= 10) depressionLevel = 'mild';

    let anxietyLevel: 'minimal' | 'mild' | 'moderate' | 'severe' = 'minimal';
    if (gad7Score >= 15) anxietyLevel = 'severe';
    else if (gad7Score >= 10) anxietyLevel = 'moderate';
    else if (gad7Score >= 5) anxietyLevel = 'mild';

    let stressLevel: 'low' | 'moderate' | 'high' = 'low';
    if (pss10Score >= 27) stressLevel = 'high';
    else if (pss10Score >= 14) stressLevel = 'moderate';

    // Generate recommendations
    const recommendations: string[] = [];

    if (depressionLevel === 'severe' || anxietyLevel === 'severe') {
      recommendations.push('Срочная консультация психиатра/психотерапевта');
      recommendations.push('Рассмотреть фармакотерапию');
      recommendations.push('Исключить суицидальный риск');
    } else if (depressionLevel === 'moderate' || anxietyLevel === 'moderate') {
      recommendations.push('Консультация психолога/психотерапевта');
      recommendations.push('Когнитивно-поведенческая терапия');
      recommendations.push('Рассмотреть медикаментозное лечение');
    } else if (depressionLevel === 'mild' || anxietyLevel === 'mild') {
      recommendations.push('Психологическая поддержка');
      recommendations.push('Техники релаксации и mindfulness');
      recommendations.push('Повторная оценка через 2-4 недели');
    }

    if (stressLevel === 'high') {
      recommendations.push('Управление стрессом - приоритет');
      recommendations.push('Техники снижения стресса');
      recommendations.push('Оценка условий работы/жизни');
    }

    if (phq9Answers[8] !== '0') { // Question about self-harm
      recommendations.unshift('⚠️ СУИЦИДАЛЬНЫЙ РИСК - немедленная оценка');
    }

    setResult({
      phq9Score,
      gad7Score,
      pss10Score,
      depressionLevel,
      anxietyLevel,
      stressLevel,
      recommendations
    });
  };

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'minimal':
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'mild':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const scaleOptions = [
    { value: '0', label: 'Вообще не беспокоит' },
    { value: '1', label: 'Несколько дней' },
    { value: '2', label: 'Более половины дней' },
    { value: '3', label: 'Почти каждый день' }
  ];

  const stressOptions = [
    { value: '0', label: 'Никогда' },
    { value: '1', label: 'Почти никогда' },
    { value: '2', label: 'Иногда' },
    { value: '3', label: 'Довольно часто' },
    { value: '4', label: 'Очень часто' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* PHQ-9 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>PHQ-9 (Депрессия)</span>
              </CardTitle>
              <CardDescription>
                За последние 2 недели, как часто вас беспокоили следующие проблемы?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {phq9Questions.map((question, index) => (
                <div key={index}>
                  <Label className="text-sm">{index + 1}. {question}</Label>
                  <Select 
                    value={phq9Answers[index]} 
                    onValueChange={(value) => {
                      const newAnswers = [...phq9Answers];
                      newAnswers[index] = value;
                      setPhq9Answers(newAnswers);
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scaleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* GAD-7 */}
          <Card>
            <CardHeader>
              <CardTitle>GAD-7 (Тревожность)</CardTitle>
              <CardDescription>
                За последние 2 недели, как часто вас беспокоили следующие проблемы?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gad7Questions.map((question, index) => (
                <div key={index}>
                  <Label className="text-sm">{index + 1}. {question}</Label>
                  <Select 
                    value={gad7Answers[index]} 
                    onValueChange={(value) => {
                      const newAnswers = [...gad7Answers];
                      newAnswers[index] = value;
                      setGad7Answers(newAnswers);
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scaleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* PSS-10 */}
          <Card>
            <CardHeader>
              <CardTitle>PSS-10 (Стресс)</CardTitle>
              <CardDescription>
                За последний месяц, как часто вы чувствовали или думали следующее?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pss10Questions.map((question, index) => (
                <div key={index}>
                  <Label className="text-sm">{index + 1}. {question}</Label>
                  <Select 
                    value={pss10Answers[index]} 
                    onValueChange={(value) => {
                      const newAnswers = [...pss10Answers];
                      newAnswers[index] = value;
                      setPss10Answers(newAnswers);
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stressOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={calculatePsychScales} className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            Рассчитать психологические шкалы
          </Button>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>Результаты оценки</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-purple-600 font-medium">PHQ-9 (Депрессия)</p>
                      <Badge className={getScoreColor(result.depressionLevel)}>
                        {result.depressionLevel === 'minimal' ? 'Минимальная' :
                         result.depressionLevel === 'mild' ? 'Легкая' :
                         result.depressionLevel === 'moderate' ? 'Умеренная' : 'Тяжелая'}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold">{result.phq9Score}/27</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-blue-600 font-medium">GAD-7 (Тревожность)</p>
                      <Badge className={getScoreColor(result.anxietyLevel)}>
                        {result.anxietyLevel === 'minimal' ? 'Минимальная' :
                         result.anxietyLevel === 'mild' ? 'Легкая' :
                         result.anxietyLevel === 'moderate' ? 'Умеренная' : 'Тяжелая'}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold">{result.gad7Score}/21</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-orange-600 font-medium">PSS-10 (Стресс)</p>
                      <Badge className={getScoreColor(result.stressLevel)}>
                        {result.stressLevel === 'low' ? 'Низкий' :
                         result.stressLevel === 'moderate' ? 'Умеренный' : 'Высокий'}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold">{result.pss10Score}/40</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
                    Клинические рекомендации:
                  </h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className={`text-sm flex items-start ${rec.includes('⚠️') ? 'text-red-700 font-bold' : 'text-gray-700'}`}>
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {(result.depressionLevel === 'severe' || result.anxietyLevel === 'severe') && (
                  <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium">⚠️ ВЫСОКИЙ РИСК:</p>
                    <p className="text-sm text-red-700">
                      Необходима немедленная профессиональная помощь. Рассмотрите направление к специалисту по психическому здоровью.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PsychologicalScales;
