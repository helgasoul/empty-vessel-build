
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BRCAFormData, BRCARiskResult, brcaSchema } from './types';

export const useBRCARisk = (onComplete?: () => void) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BRCAFormData>({
    resolver: zodResolver(brcaSchema),
    defaultValues: {
      brca1_mutation: false,
      brca2_mutation: false,
      family_history_breast: false,
      family_history_ovarian: false,
      ashkenazi_ancestry: false,
      age: 30,
      gender: 'female',
    },
  });

  const calculateBRCARisk = (data: BRCAFormData): BRCARiskResult => {
    let riskPercentage = 5; // базовый риск

    // BRCA1 мутация
    if (data.brca1_mutation) {
      riskPercentage = data.gender === 'female' ? 72 : 8; // женщины: 72%, мужчины: 8%
    }
    
    // BRCA2 мутация
    if (data.brca2_mutation) {
      riskPercentage = data.gender === 'female' ? 69 : 6; // женщины: 69%, мужчины: 6%
    }

    // Семейная история
    if (data.family_history_breast) {
      riskPercentage *= 2;
    }
    
    if (data.family_history_ovarian) {
      riskPercentage *= 1.5;
    }

    // Ашкеназское происхождение
    if (data.ashkenazi_ancestry) {
      riskPercentage *= 1.3;
    }

    // Возрастной фактор
    const ageFactor = data.age > 50 ? 1.2 : data.age < 30 ? 0.8 : 1;
    riskPercentage *= ageFactor;

    // Ограничиваем максимальный риск
    riskPercentage = Math.min(riskPercentage, 85);

    const riskLevel = riskPercentage < 20 ? 'low' : riskPercentage < 50 ? 'medium' : 'high';

    return {
      riskPercentage: Math.round(riskPercentage),
      riskLevel,
      recommendations: generateBRCARecommendations(data, riskPercentage),
    };
  };

  const generateBRCARecommendations = (data: BRCAFormData, risk: number): string[] => {
    const recommendations = [];

    if (data.brca1_mutation || data.brca2_mutation) {
      recommendations.push('Обязательная консультация с генетиком и онкологом');
      recommendations.push('Рассмотрите профилактическую мастэктомию');
      recommendations.push('МРТ молочных желез каждые 6 месяцев');
      if (data.gender === 'female') {
        recommendations.push('Рассмотрите профилактическую овариэктомию после 35-40 лет');
      }
    }

    if (risk > 20) {
      recommendations.push('Ежегодная маммография начиная с 40 лет');
      recommendations.push('Клинический осмотр молочных желез каждые 6 месяцев');
    }

    if (data.family_history_breast || data.family_history_ovarian) {
      recommendations.push('Генетическое консультирование для семьи');
      recommendations.push('Рассмотрите генетическое тестирование');
    }

    recommendations.push('Поддержание здорового образа жизни');
    recommendations.push('Ограничение алкоголя');
    recommendations.push('Регулярная физическая активность');

    return recommendations;
  };

  const onSubmit = async (data: BRCAFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const results = calculateBRCARisk(data);

      // Сохраняем результаты оценки - преобразуем объекты в JSON
      const { error: assessmentError } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'BRCA',
          assessment_data: data as any, // Приводим к any для совместимости с Json типом
          results_data: results as any, // Приводим к any для совместимости с Json типом
          risk_percentage: results.riskPercentage,
          risk_level: results.riskLevel,
          recommendations: results.recommendations,
        });

      if (assessmentError) throw assessmentError;

      // Сохраняем генетические данные, если есть мутации
      if (data.brca1_mutation || data.brca2_mutation) {
        try {
          const { error: geneticError } = await supabase
            .from('genetic_data')
            .insert({
              user_id: user.id,
              test_type: 'BRCA',
              gene_variants: {
                BRCA1: data.brca1_mutation ? 'pathogenic' : 'normal',
                BRCA2: data.brca2_mutation ? 'pathogenic' : 'normal',
              } as any, // Приводим к any для совместимости с Json типом
              results: {
                brca1_positive: data.brca1_mutation,
                brca2_positive: data.brca2_mutation,
                risk_assessment: results,
              } as any // Приводим к any для совместимости с Json типом
            });

          if (geneticError) {
            console.warn('Could not save genetic data:', geneticError);
            // Не блокируем весь процесс, если генетические данные не сохранились
          }
        } catch (error) {
          console.warn('Could not save genetic data:', error);
          // Не блокируем весь процесс
        }
      }

      toast.success('Оценка риска BRCA успешно сохранена');
      onComplete?.();
    } catch (error) {
      console.error('Error saving BRCA assessment:', error);
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
