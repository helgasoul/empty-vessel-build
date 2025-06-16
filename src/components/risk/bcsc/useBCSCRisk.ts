
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BCSCFormData, BCSCRiskResult, bcscSchema } from './types';

export const useBCSCRisk = (onComplete?: () => void) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BCSCFormData>({
    resolver: zodResolver(bcscSchema),
    defaultValues: {
      age: 45,
      race_ethnicity: 'white',
      family_history_first_degree: false,
      previous_breast_biopsy: false,
      biopsy_with_atypia: false,
      breast_density: 'scattered_fibroglandular',
      current_hormone_therapy: false,
      nulliparous: false,
    },
  });

  const calculateBCSCRisk = (data: BCSCFormData): BCSCRiskResult => {
    // Базовые коэффициенты риска для BCSC v3 модели
    let logOdds = -6.5; // Базовый логарифм шансов

    // Возрастные коэффициенты
    if (data.age >= 35 && data.age < 40) logOdds += 0;
    else if (data.age >= 40 && data.age < 45) logOdds += 0.5;
    else if (data.age >= 45 && data.age < 50) logOdds += 0.8;
    else if (data.age >= 50 && data.age < 55) logOdds += 1.2;
    else if (data.age >= 55 && data.age < 60) logOdds += 1.4;
    else if (data.age >= 60 && data.age < 65) logOdds += 1.6;
    else if (data.age >= 65 && data.age < 70) logOdds += 1.7;
    else if (data.age >= 70 && data.age < 75) logOdds += 1.8;
    else if (data.age >= 75) logOdds += 1.9;

    // Расовые/этнические коэффициенты
    switch (data.race_ethnicity) {
      case 'african_american':
        logOdds += 0.2;
        break;
      case 'hispanic':
        logOdds -= 0.1;
        break;
      case 'asian':
        logOdds -= 0.3;
        break;
      case 'native_american':
        logOdds += 0.1;
        break;
      default:
        break;
    }

    // Семейная история
    if (data.family_history_first_degree) {
      logOdds += 0.5;
    }

    // Биопсия молочной железы
    if (data.previous_breast_biopsy) {
      logOdds += 0.3;
      if (data.biopsy_with_atypia) {
        logOdds += 0.8; // Дополнительный риск при атипии
      }
    }

    // Плотность молочной железы (один из ключевых факторов BCSC)
    switch (data.breast_density) {
      case 'almost_entirely_fatty':
        logOdds -= 0.2;
        break;
      case 'scattered_fibroglandular':
        logOdds += 0;
        break;
      case 'heterogeneously_dense':
        logOdds += 0.3;
        break;
      case 'extremely_dense':
        logOdds += 0.6;
        break;
    }

    // Гормональная терапия
    if (data.current_hormone_therapy) {
      logOdds += 0.4;
    }

    // Репродуктивные факторы
    if (data.nulliparous) {
      logOdds += 0.2;
    } else if (data.age_at_first_birth && data.age_at_first_birth > 30) {
      logOdds += 0.3;
    }

    // Расчет 5-летнего риска
    const fiveYearOdds = Math.exp(logOdds);
    const fiveYearRisk = (fiveYearOdds / (1 + fiveYearOdds)) * 100;

    // Приблизительный расчет пожизненного риска (упрощенная формула)
    const lifetimeRisk = Math.min(fiveYearRisk * 4.5, 85);

    // Определение уровня риска
    let riskLevel: 'low' | 'intermediate' | 'high';
    if (fiveYearRisk < 1.67) {
      riskLevel = 'low';
    } else if (fiveYearRisk < 3.0) {
      riskLevel = 'intermediate';
    } else {
      riskLevel = 'high';
    }

    return {
      fiveYearRisk: Math.round(fiveYearRisk * 100) / 100,
      lifetimeRisk: Math.round(lifetimeRisk * 100) / 100,
      riskLevel,
      recommendations: generateBCSCRecommendations(data, fiveYearRisk, lifetimeRisk),
    };
  };

  const generateBCSCRecommendations = (
    data: BCSCFormData,
    fiveYearRisk: number,
    lifetimeRisk: number
  ): string[] => {
    const recommendations = [];

    // Рекомендации по скринингу
    if (fiveYearRisk >= 3.0 || lifetimeRisk >= 20) {
      recommendations.push('Обсудите с врачом возможность начала скрининга раньше 50 лет');
      recommendations.push('Рассмотрите МРТ молочных желез как дополнение к маммографии');
      recommendations.push('Консультация онкогенетика для оценки необходимости генетического тестирования');
    }

    if (fiveYearRisk >= 1.67) {
      recommendations.push('Ежегодная маммография начиная с 40 лет');
      recommendations.push('Рассмотрите химиопрофилактику (тамоксифен, ралоксифен)');
    } else {
      recommendations.push('Маммография каждые 2 года начиная с 50 лет');
    }

    // Рекомендации по плотности молочной железы
    if (data.breast_density === 'heterogeneously_dense' || data.breast_density === 'extremely_dense') {
      recommendations.push('Дополнительный скрининг (УЗИ или томосинтез) из-за высокой плотности');
      recommendations.push('Обсудите с врачом дополнительные методы визуализации');
    }

    // Рекомендации по образу жизни
    recommendations.push('Поддержание здорового веса');
    recommendations.push('Регулярная физическая активность (150 минут в неделю)');
    recommendations.push('Ограничение употребления алкоголя');

    if (data.current_hormone_therapy) {
      recommendations.push('Обсудите с врачом риски и пользу гормональной терапии');
    }

    // Самообследование
    recommendations.push('Ежемесячное самообследование молочных желез');
    recommendations.push('Немедленное обращение к врачу при обнаружении изменений');

    return recommendations;
  };

  const onSubmit = async (data: BCSCFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const results = calculateBCSCRisk(data);

      // Сохраняем результаты оценки
      const { error: assessmentError } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'BCSC',
          assessment_data: data as any,
          results_data: results as any,
          risk_percentage: results.fiveYearRisk,
          risk_level: results.riskLevel,
          recommendations: results.recommendations,
        });

      if (assessmentError) throw assessmentError;

      toast.success('Оценка риска BCSC успешно сохранена');
      onComplete?.();
    } catch (error) {
      console.error('Error saving BCSC assessment:', error);
      toast.error('Ошибка при сохранении оценки риска');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
};
