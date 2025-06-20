
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Heart, Target, Shield, CheckCircle, AlertTriangle, Microscope, Activity, Database } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';

const AIAnalysisPage = () => {
  const navigate = useNavigate();

  const analysisTypes = [
    {
      icon: Target,
      title: "Онкологические риски",
      description: "Рак груди, яичников, матки - на основе генетики и факторов риска",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-red-50 to-pink-50"
    },
    {
      icon: Heart,
      title: "Сердечно-сосудистые заболевания",
      description: "Инфаркт, инсульт, гипертония - анализ 50+ параметров",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-red-50 to-orange-50"
    },
    {
      icon: Brain,
      title: "Нейродегенеративные заболевания",
      description: "Деменция, болезнь Альцгеймера - когнитивные тесты + биомаркеры",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50"
    },
    {
      icon: Activity,
      title: "Метаболические нарушения",
      description: "Диабет 2 типа, ожирение, синдром поликистозных яичников",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Сбор данных",
      description: "Безопасная интеграция всех ваших медицинских данных",
      icon: Database
    },
    {
      step: "2", 
      title: "Обработка алгоритмами",
      description: "30+ ML-моделей анализируют взаимосвязи в ваших данных",
      icon: Brain
    },
    {
      step: "3",
      title: "Сравнение с базой знаний", 
      description: "Сопоставление с 100,000+ медицинских случаев",
      icon: Microscope
    },
    {
      step: "4",
      title: "Персональный прогноз",
      description: "Индивидуальная оценка рисков на 5-10 лет вперед",
      icon: Target
    },
    {
      step: "5",
      title: "Рекомендации",
      description: "Конкретные шаги для снижения выявленных рисков",
      icon: CheckCircle
    }
  ];

  const analysisFactors = [
    "Семейную историю заболеваний",
    "Результаты лабораторных анализов",
    "Данные с носимых устройств (пульс, сон, активность)",
    "Образ жизни и привычки",
    "Репродуктивный анамнез", 
    "Психологические факторы"
  ];

  const scientificBasis = [
    "Исследованиях ведущих медицинских журналов",
    "Клинических данных 15+ больниц",
    "Международных медицинских стандартах",
    "Постоянном обучении на новых данных"
  ];

  const safetyFeatures = [
    { icon: CheckCircle, text: "94% точность прогнозирования (валидация на 50,000 пациентов)", color: "text-green-600" },
    { icon: Shield, text: "Данные зашифрованы по стандартам банковской безопасности", color: "text-blue-600" },
    { icon: Heart, text: "Каждый результат проверяется медицинским экспертом", color: "text-purple-600" },
    { icon: Shield, text: "Соответствие GDPR и российским требованиям", color: "text-gray-600" }
  ];

  const limitations = [
    "ИИ дает оценку вероятности, не диагноз",
    "Результаты требуют интерпретации врача", 
    "Редкие заболевания анализируются ограниченно",
    "Рекомендуем регулярные консультации с врачами"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <BackButton fallbackPath="/" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-purple-100 text-purple-800 mb-6 hover:bg-purple-200 transition-colors duration-200">
            🧠 Искусственный интеллект в медицине
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6">
            Как ИИ анализирует ваше здоровье
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Узнайте, как современные алгоритмы помогают предсказать риски и сохранить ваше здоровье
          </p>
        </div>
      </section>

      {/* What AI Analyzes */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Что анализирует наш ИИ</h2>
            <p className="text-lg text-gray-700">Мультифакторная оценка включает:</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisFactors.map((factor, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Types */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Виды рисков, которые мы прогнозируем</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {analysisTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card key={index} className={`${type.bgColor} border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${type.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{type.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Как это работает</h2>
            <p className="text-lg text-gray-700">Пошаговый процесс анализа</p>
          </div>
          
          <div className="space-y-8">
            {workflowSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex items-start space-x-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 flex-1">
                    <IconComponent className="w-8 h-8 text-purple-600" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scientific Basis */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Научная основа</h2>
            <p className="text-lg text-gray-700 mb-8">Наши алгоритмы основаны на:</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {scientificBasis.map((basis, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200">
                <Microscope className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{basis}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Accuracy */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Точность и безопасность</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {safetyFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <IconComponent className={`w-6 h-6 ${feature.color} flex-shrink-0 mt-1`} />
                  <span className="text-gray-800 font-medium leading-relaxed">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ограничения ИИ</h2>
            <p className="text-lg text-gray-700 mb-8">Что важно понимать:</p>
          </div>
          
          <div className="space-y-4">
            {limitations.map((limitation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-200">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{limitation}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Пример анализа</h2>
            <p className="text-lg text-gray-700 mb-8">Посмотрите, как работает наш ИИ</p>
          </div>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Интерактивная демонстрация</h3>
              <p className="text-gray-700 mb-6">
                Посмотрите анонимизированный пример анализа рисков для женщины 35 лет
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => navigate('/risk-assessment-demo')}
              >
                Посмотреть демо
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы получить свой ИИ-анализ рисков?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам женщин, которые уже управляют своими рисками здоровья с помощью ИИ
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="text-purple-600 hover:text-purple-700 font-semibold hover:scale-105 transition-all duration-200"
            onClick={() => navigate('/auth')}
          >
            Получить свой ИИ-анализ рисков
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AIAnalysisPage;
