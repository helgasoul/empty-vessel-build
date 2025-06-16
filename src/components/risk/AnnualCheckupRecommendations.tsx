
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Heart, Eye, Stethoscope, FlaskConical, Users, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CheckupRecommendation {
  id: string;
  name: string;
  description: string;
  frequency: string;
  ageGroup: string;
  riskFactors: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: 'general' | 'cardiovascular' | 'cancer' | 'reproductive' | 'metabolic';
  icon: React.ComponentType<{ className?: string }>;
}

interface AnnualCheckupRecommendationsProps {
  riskAssessments?: Array<{
    assessment_type: string;
    risk_level: string;
    risk_percentage: number;
  }>;
  userAge?: number;
  userGender?: string;
}

const AnnualCheckupRecommendations: React.FC<AnnualCheckupRecommendationsProps> = ({
  riskAssessments = [],
  userAge = 30,
  userGender = 'female'
}) => {
  const navigate = useNavigate();

  const getRecommendations = (): CheckupRecommendation[] => {
    const baseRecommendations: CheckupRecommendation[] = [
      {
        id: 'general-checkup',
        name: 'Общий медицинский осмотр',
        description: 'Консультация терапевта, измерение давления, веса, общий анализ крови',
        frequency: 'Ежегодно',
        ageGroup: '18+',
        riskFactors: [],
        urgency: 'medium',
        category: 'general',
        icon: Stethoscope
      },
      {
        id: 'blood-tests',
        name: 'Биохимический анализ крови',
        description: 'Глюкоза, холестерин, печеночные пробы, креатинин',
        frequency: 'Ежегодно',
        ageGroup: '25+',
        riskFactors: [],
        urgency: 'medium',
        category: 'metabolic',
        icon: FlaskConical
      },
      {
        id: 'gynecological',
        name: 'Гинекологический осмотр',
        description: 'Осмотр гинеколога, цитология шейки матки (PAP-тест)',
        frequency: 'Ежегодно',
        ageGroup: '21+',
        riskFactors: [],
        urgency: 'high',
        category: 'reproductive',
        icon: Heart
      },
      {
        id: 'mammography',
        name: 'Маммография',
        description: 'Рентгенологическое исследование молочных желез',
        frequency: userAge >= 50 ? 'Ежегодно' : 'Каждые 2 года',
        ageGroup: '40+',
        riskFactors: ['семейная история рака молочной железы'],
        urgency: 'high',
        category: 'cancer',
        icon: Heart
      },
      {
        id: 'colonoscopy',
        name: 'Колоноскопия',
        description: 'Эндоскопическое исследование толстой кишки',
        frequency: 'Каждые 10 лет',
        ageGroup: '45+',
        riskFactors: ['семейная история колоректального рака'],
        urgency: 'medium',
        category: 'cancer',
        icon: FlaskConical
      },
      {
        id: 'eye-exam',
        name: 'Офтальмологический осмотр',
        description: 'Проверка зрения, измерение внутриглазного давления',
        frequency: userAge >= 40 ? 'Ежегодно' : 'Каждые 2 года',
        ageGroup: '18+',
        riskFactors: [],
        urgency: 'low',
        category: 'general',
        icon: Eye
      }
    ];

    // Добавляем рекомендации на основе результатов оценки рисков
    const riskBasedRecommendations: CheckupRecommendation[] = [];

    riskAssessments.forEach(assessment => {
      if (assessment.assessment_type.toLowerCase().includes('qrisk') || 
          assessment.assessment_type.toLowerCase().includes('framingham')) {
        if (assessment.risk_level === 'high' || assessment.risk_level === 'very_high') {
          riskBasedRecommendations.push({
            id: 'cardio-extended',
            name: 'Расширенное кардиологическое обследование',
            description: 'ЭКГ, ЭхоКГ, холтеровское мониторирование, консультация кардиолога',
            frequency: 'Каждые 6 месяцев',
            ageGroup: '18+',
            riskFactors: ['высокий сердечно-сосудистый риск'],
            urgency: 'critical',
            category: 'cardiovascular',
            icon: Heart
          });
        }
      }

      if (assessment.assessment_type.toLowerCase().includes('cancer') ||
          assessment.assessment_type.toLowerCase().includes('bcsc') ||
          assessment.assessment_type.toLowerCase().includes('brca')) {
        if (assessment.risk_level === 'high' || assessment.risk_level === 'very_high') {
          riskBasedRecommendations.push({
            id: 'oncology-screening',
            name: 'Онкологический скрининг',
            description: 'Консультация онколога, дополнительные маркеры, генетическое тестирование',
            frequency: 'Каждые 6 месяцев',
            ageGroup: '18+',
            riskFactors: ['высокий онкологический риск'],
            urgency: 'critical',
            category: 'cancer',
            icon: FlaskConical
          });
        }
      }

      if (assessment.assessment_type.toLowerCase().includes('crc')) {
        if (assessment.risk_level === 'high' || assessment.risk_level === 'very_high') {
          riskBasedRecommendations.push({
            id: 'gastro-screening',
            name: 'Гастроэнтерологический скрининг',
            description: 'Колоноскопия, анализ кала на скрытую кровь, консультация гастроэнтеролога',
            frequency: 'Каждые 3-5 лет',
            ageGroup: '40+',
            riskFactors: ['высокий риск колоректального рака'],
            urgency: 'high',
            category: 'cancer',
            icon: FlaskConical
          });
        }
      }
    });

    return [...baseRecommendations, ...riskBasedRecommendations]
      .filter(rec => {
        const minAge = parseInt(rec.ageGroup.replace('+', ''));
        return userAge >= minAge;
      })
      .sort((a, b) => {
        const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'Критично';
      case 'high':
        return 'Высокий приоритет';
      case 'medium':
        return 'Средний приоритет';
      case 'low':
        return 'Низкий приоритет';
      default:
        return 'Обычный';
    }
  };

  const recommendations = getRecommendations();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarCheck className="w-5 h-5 text-blue-600" />
          <span>Рекомендации по ежегодному обследованию</span>
        </CardTitle>
        <CardDescription>
          Персонализированный план медицинских осмотров на основе вашего возраста и результатов оценки рисков
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              Заполните профиль и пройдите оценку рисков для получения персонализированных рекомендаций
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recommendations.map((rec) => {
              const IconComponent = rec.icon;
              return (
                <div
                  key={rec.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{rec.name}</h4>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                    <Badge className={getUrgencyColor(rec.urgency)}>
                      {getUrgencyText(rec.urgency)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{rec.frequency}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{rec.ageGroup}</span>
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/medical-integrations')}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Записаться
                    </Button>
                  </div>
                  
                  {rec.riskFactors.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Рекомендовано при наличии:</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <CalendarCheck className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Важные напоминания</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Обсудите план обследования с вашим лечащим врачом</li>
                <li>• Регулярность обследований может изменяться в зависимости от состояния здоровья</li>
                <li>• При появлении новых симптомов не откладывайте визит к врачу</li>
                <li>• Ведите медицинскую карту и записывайте результаты обследований</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnualCheckupRecommendations;
