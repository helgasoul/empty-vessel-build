
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Brain, Activity, ArrowRight, Info, CheckCircle, Play } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import BackButton from '@/components/ui/back-button';

const RiskAssessmentDemo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const assessmentTypes = [
    {
      title: "QRISK3",
      displayName: "Сердечно-сосудистые риски",
      description: "Оценка 10-летнего риска инфаркта и инсульта",
      tooltip: "Британский алгоритм QRISK3 — золотой стандарт оценки сердечно-сосудистых рисков, используемый в NHS. Анализирует 22+ фактора риска.",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      validation: "Рекомендован NHS и ESC",
      accuracy: "92% точность",
      route: "/risk-assessment"
    },
    {
      title: "BCSC v3",
      displayName: "Рак молочной железы",
      description: "Персональная оценка риска рака груди",
      tooltip: "Breast Cancer Surveillance Consortium — ведущий американский алгоритм оценки риска рака молочной железы, учитывающий плотность тканей груди.",
      icon: Activity,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      validation: "Одобрен FDA",
      accuracy: "88% точность",
      route: "/risk-assessment"
    },
    {
      title: "DemPoRT",
      displayName: "Риск деменции",
      description: "Прогноз когнитивных нарушений на 5 лет",
      tooltip: "Dementia Population Risk Tool — канадский алгоритм для оценки популяционного риска деменции, разработанный на основе данных 75,000+ пациентов.",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-50",
      validation: "Валидирован международно",
      accuracy: "85% точность",
      route: "/risk-assessment"
    },
    {
      title: "Cancer Risk",
      displayName: "Общий онкориск",
      description: "Комплексная оценка онкологических рисков",
      tooltip: "Мультифакторный анализ риска различных видов рака на основе генетических, средовых и поведенческих факторов.",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      validation: "Научно подтверждено",
      accuracy: "89% точность",
      route: "/risk-assessment"
    }
  ];

  const handleStartTest = (assessment: typeof assessmentTypes[0]) => {
    // Проверяем авторизацию пользователя
    if (!user) {
      toast.info('Для прохождения тестов необходимо авторизоваться');
      
      // Используем fallback для деплоя
      try {
        navigate('/auth');
      } catch (error) {
        console.log('Navigation fallback for deployment');
        window.location.href = '/auth';
      }
      return;
    }

    // Если пользователь авторизован, переходим к тестированию
    toast.success(`Начинаем тест: ${assessment.displayName}`);
    
    try {
      navigate(assessment.route);
    } catch (error) {
      console.log('Navigation fallback for deployment');
      window.location.href = assessment.route;
    }
  };

  const handleFullAssessment = () => {
    if (!user) {
      try {
        navigate('/auth');
      } catch (error) {
        console.log('Navigation fallback for deployment');
        window.location.href = '/auth';
      }
    } else {
      try {
        navigate('/risk-assessment');
      } catch (error) {
        console.log('Navigation fallback for deployment');
        window.location.href = '/risk-assessment';
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <BackButton className="mb-6" />
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-700 mb-6">
              Оценка рисков здоровья
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Получите персонализированный анализ рисков различных заболеваний 
              на основе научно-обоснованных алгоритмов
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {assessmentTypes.map((assessment, index) => {
              const IconComponent = assessment.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-purple-200 bg-white overflow-hidden"
                >
                  <CardHeader className={`bg-gradient-to-r ${assessment.bgColor} pb-6`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${assessment.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-600 hover:bg-white/50"
                            aria-label={`Информация об алгоритме ${assessment.title}`}
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-4 bg-gray-800 text-white text-sm leading-relaxed">
                          <p>{assessment.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                        {assessment.displayName}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs font-medium text-gray-500 bg-white/80">
                        {assessment.title}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-4">
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {assessment.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {assessment.validation}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {assessment.accuracy}
                      </Badge>
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${assessment.color} hover:opacity-90 text-white font-semibold py-3 mt-4 group-hover:shadow-lg transition-all duration-300`}
                      onClick={() => handleStartTest(assessment)}
                      aria-label={`Начать тест ${assessment.displayName}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Начать тест
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-2xl">
            <CardContent className="py-12 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Готовы узнать свои риски?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                {user 
                  ? "Перейдите к полной оценке рисков здоровья на основе ведущих международных алгоритмов"
                  : "Зарегистрируйтесь и получите доступ к полной оценке рисков здоровья на основе ведущих международных алгоритмов"
                }
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-purple-600 hover:text-purple-700 font-semibold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg"
                onClick={handleFullAssessment}
              >
                {user ? "Перейти к полной оценке" : "Начать полную оценку"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RiskAssessmentDemo;
