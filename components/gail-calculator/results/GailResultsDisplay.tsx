/**
 * components/gail-calculator/results/GailResultsDisplay.tsx
 * 
 * Компонент отображения результатов расчета Gail
 * 📊 Красивая визуализация рисков и рекомендаций
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Heart, 
  Shield, 
  TrendingUp, 
  Users, 
  Calendar,
  FileText,
  Download,
  Share,
  BookOpen,
  ArrowRight,
  Info,
  Star,
  Zap
} from 'lucide-react';

import type { 
  GailCalculatorResult, 
  RiskFactor, 
  Recommendation, 
  RiskLevel 
} from '../../../hooks/useGailCalculator';

interface GailResultsDisplayProps {
  result: GailCalculatorResult;
  onScheduleConsultation?: () => void;
  onDownloadReport?: () => void;
  onShareResults?: () => void;
}

// ========================================
// Утилиты для визуализации
// ========================================

const getRiskLevelConfig = (level: RiskLevel) => {
  switch (level) {
    case 'low':
      return {
        color: 'green',
        gradient: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        icon: CheckCircle,
        title: 'Низкий риск',
        description: 'Ваш риск ниже среднего популяционного уровня',
        emoji: '💚'
      };
    case 'moderate':
      return {
        color: 'yellow',
        gradient: 'from-yellow-400 to-amber-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        icon: Shield,
        title: 'Умеренный риск',
        description: 'Риск на уровне среднего популяционного значения',
        emoji: '🟡'
      };
    case 'high':
      return {
        color: 'orange',
        gradient: 'from-orange-400 to-red-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        icon: AlertTriangle,
        title: 'Повышенный риск',
        description: 'Риск выше среднего, рекомендуется усиленное наблюдение',
        emoji: '🟠'
      };
    case 'very_high':
      return {
        color: 'red',
        gradient: 'from-red-500 to-rose-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        icon: AlertTriangle,
        title: 'Высокий риск',
        description: 'Значительно повышенный риск, требуется специальное наблюдение',
        emoji: '🔴'
      };
  }
};

const getImpactConfig = (impact: string) => {
  switch (impact) {
    case 'protective':
      return { color: 'text-green-600', bg: 'bg-green-100', icon: '↓' };
    case 'neutral':
      return { color: 'text-gray-600', bg: 'bg-gray-100', icon: '→' };
    case 'moderate':
      return { color: 'text-orange-600', bg: 'bg-orange-100', icon: '↑' };
    case 'high':
      return { color: 'text-red-600', bg: 'bg-red-100', icon: '↑↑' };
    default:
      return { color: 'text-gray-600', bg: 'bg-gray-100', icon: '?' };
  }
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300' };
    case 'high':
      return { color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300' };
    case 'medium':
      return { color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-300' };
    case 'low':
      return { color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-300' };
    default:
      return { color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-300' };
  }
};

// ========================================
// Компоненты результатов
// ========================================

interface RiskOverviewCardProps {
  result: GailCalculatorResult;
}

const RiskOverviewCard: React.FC<RiskOverviewCardProps> = ({ result }) => {
  const config = getRiskLevelConfig(result.riskLevel);
  const IconComponent = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-8 text-center relative overflow-hidden`}
    >
      {/* Декоративный фон */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <IconComponent className={`w-12 h-12 ${config.textColor}`} />
        </div>
        
        <h2 className={`text-2xl font-bold ${config.textColor} mb-2`}>
          {config.title} {config.emoji}
        </h2>
        
        <p className={`text-sm ${config.textColor} opacity-80 mb-6`}>
          {config.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 5-летний риск */}
          <div className="bg-white bg-opacity-60 rounded-xl p-4">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {(result.fiveYearRisk * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              Риск в течение 5 лет
            </div>
          </div>
          
          {/* Пожизненный риск */}
          <div className="bg-white bg-opacity-60 rounded-xl p-4">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {(result.lifetimeRisk * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">
              Пожизненный риск
            </div>
          </div>
        </div>
        
        {/* Сравнение со средним */}
        <div className="mt-6 p-4 bg-white bg-opacity-60 rounded-xl">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Сравнение со средним
            </span>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {result.comparedToAverage > 1 
              ? `В ${result.comparedToAverage.toFixed(1)} раза выше`
              : `На ${((1 - result.comparedToAverage) * 100).toFixed(0)}% ниже`
            } среднего
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface RiskFactorsCardProps {
  riskFactors: RiskFactor[];
}

const RiskFactorsCard: React.FC<RiskFactorsCardProps> = ({ riskFactors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <Activity className="w-6 h-6 text-purple-600" />
        <span>Факторы риска</span>
      </h3>
      
      <div className="space-y-4">
        {riskFactors.map((factor, index) => {
          const impactConfig = getImpactConfig(factor.impact);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`${impactConfig.bg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className={`text-sm font-bold ${impactConfig.color}`}>
                  {impactConfig.icon}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-800">{factor.name}</h4>
                  <span className="text-sm text-gray-500">{factor.value}</span>
                </div>
                <p className="text-sm text-gray-600">{factor.description}</p>
                
                {/* Уровень доказательности */}
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < (['low', 'moderate', 'high'].indexOf(factor.evidenceLevel) + 1)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    {factor.evidenceLevel === 'high' ? 'Высокая' : 
                     factor.evidenceLevel === 'moderate' ? 'Умеренная' : 'Низкая'} доказательность
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

interface RecommendationsCardProps {
  recommendations: Recommendation[];
  onScheduleConsultation?: () => void;
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ 
  recommendations, 
  onScheduleConsultation 
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'screening': return Calendar;
      case 'lifestyle': return Heart;
      case 'genetic': return Users;
      case 'medical': return FileText;
      default: return Info;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>Персональные рекомендации</span>
        </h3>
        
        {onScheduleConsultation && (
          <button
            onClick={onScheduleConsultation}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Записаться на консультацию</span>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => {
          const priorityConfig = getPriorityConfig(recommendation.priority);
          const IconComponent = getTypeIcon(recommendation.type);
          const isExpanded = expandedIndex === index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${priorityConfig.bg} ${priorityConfig.border} border rounded-xl overflow-hidden`}
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="w-full p-4 text-left hover:bg-opacity-60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white bg-opacity-60`}>
                      <IconComponent className={`w-5 h-5 ${priorityConfig.color}`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${priorityConfig.color}`}>
                        {recommendation.title}
                      </h4>
                      <p className={`text-sm ${priorityConfig.color} opacity-80`}>
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-60 ${priorityConfig.color}`}>
                      {recommendation.priority === 'urgent' ? 'Срочно' :
                       recommendation.priority === 'high' ? 'Высокий' :
                       recommendation.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                    </span>
                    <ArrowRight 
                      className={`w-4 h-4 ${priorityConfig.color} transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white border-opacity-30"
                  >
                    <div className="p-4 bg-white bg-opacity-40">
                      <h5 className={`font-medium ${priorityConfig.color} mb-3`}>
                        Рекомендуемые действия:
                      </h5>
                      <ul className="space-y-2">
                        {recommendation.actionItems.map((action, actionIndex) => (
                          <li 
                            key={actionIndex}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <Zap className={`w-4 h-4 ${priorityConfig.color} flex-shrink-0 mt-0.5`} />
                            <span className={priorityConfig.color}>{action}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Уровень доказательности */}
                      <div className="flex items-center space-x-1 mt-3 pt-3 border-t border-white border-opacity-30">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < (['low', 'moderate', 'high'].indexOf(recommendation.evidenceLevel) + 1)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className={`text-xs ${priorityConfig.color} opacity-80 ml-1`}>
                          {recommendation.evidenceLevel === 'high' ? 'Высокая' : 
                           recommendation.evidenceLevel === 'moderate' ? 'Умеренная' : 'Низкая'} доказательность
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

interface ActionButtonsProps {
  onDownloadReport?: () => void;
  onShareResults?: () => void;
  onScheduleConsultation?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDownloadReport,
  onShareResults,
  onScheduleConsultation
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6"
    >
      <h3 className="text-lg font-semibold text-purple-800 mb-4 text-center">
        🎯 Следующие шаги
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {onDownloadReport && (
          <button
            onClick={onDownloadReport}
            className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl border border-purple-200 hover:shadow-lg transition-all group"
          >
            <Download className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-purple-700">Скачать отчет</span>
          </button>
        )}
        
        {onShareResults && (
          <button
            onClick={onShareResults}
            className="flex items-center justify-center space-x-2 p-4 bg-white rounded-xl border border-purple-200 hover:shadow-lg transition-all group"
          >
            <Share className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-purple-700">Поделиться</span>
          </button>
        )}
        
        {onScheduleConsultation && (
          <button
            onClick={onScheduleConsultation}
            className="flex items-center justify-center space-x-2 p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all group"
          >
            <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Консультация</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ========================================
// Основной компонент
// ========================================

export const GailResultsDisplay: React.FC<GailResultsDisplayProps> = ({
  result,
  onScheduleConsultation,
  onDownloadReport,
  onShareResults,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          💖 Результаты оценки риска
        </h1>
        <p className="text-gray-600">
          Персональный анализ по модели Gail для оценки риска рака молочной железы
        </p>
      </motion.div>

      {/* Общий обзор риска */}
      <RiskOverviewCard result={result} />

      {/* Факторы риска */}
      <RiskFactorsCard riskFactors={result.riskFactors} />

      {/* Рекомендации */}
      <RecommendationsCard 
        recommendations={result.recommendations}
        onScheduleConsultation={onScheduleConsultation}
      />

      {/* Кнопки действий */}
      <ActionButtons
        onDownloadReport={onDownloadReport}
        onShareResults={onShareResults}
        onScheduleConsultation={onScheduleConsultation}
      />

      {/* Дисклеймер */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4"
      >
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Важная информация</p>
            <p>
              Результаты основаны на модели Gail и являются статистической оценкой. 
              Они не заменяют медицинскую консультацию и должны обсуждаться с врачом. 
              Индивидуальный риск может отличаться от расчетного.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GailResultsDisplay;