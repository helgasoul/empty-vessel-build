
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Target, Heart, Brain, Activity, Database, Microscope, CheckCircle, Shield, AlertTriangle } from "lucide-react";
import BackButton from '@/components/ui/back-button';
import AnalysisFactorsSection from '@/components/ai-analysis/AnalysisFactorsSection';
import RiskTypesSection from '@/components/ai-analysis/RiskTypesSection';
import WorkflowSection from '@/components/ai-analysis/WorkflowSection';
import ScientificBasisSection from '@/components/ai-analysis/ScientificBasisSection';
import SafetySection from '@/components/ai-analysis/SafetySection';
import LimitationsSection from '@/components/ai-analysis/LimitationsSection';
import DemoSection from '@/components/ai-analysis/DemoSection';
import CTASection from '@/components/ai-analysis/CTASection';

const AIAnalysisPage = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 bg-clip-text text-transparent mb-6">
            Как ИИ анализирует ваше здоровье
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Узнайте, как современные алгоритмы помогают предсказать риски и сохранить ваше здоровье
          </p>
        </div>
      </section>

      <AnalysisFactorsSection factors={analysisFactors} />
      <RiskTypesSection analysisTypes={analysisTypes} />
      <WorkflowSection workflowSteps={workflowSteps} />
      <ScientificBasisSection scientificBasis={scientificBasis} />
      <SafetySection safetyFeatures={safetyFeatures} />
      <LimitationsSection limitations={limitations} />
      <DemoSection />
      <CTASection />
    </div>
  );
};

export default AIAnalysisPage;
