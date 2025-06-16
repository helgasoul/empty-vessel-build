
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { framinghamAlzheimerSchema, FraminghamAlzheimerFormData, FraminghamAlzheimerRiskResult } from './types';

export const useFraminghamRisk = (onComplete?: () => void) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FraminghamAlzheimerFormData>({
    resolver: zodResolver(framinghamAlzheimerSchema),
    defaultValues: {
      age: 65,
      gender: 'female',
      education_years: 12,
      apoe4_status: 'unknown',
      family_history_dementia: false,
      cardiovascular_disease: false,
      diabetes: false,
      hypertension: false,
      smoking_status: 'never',
      physical_activity: 'moderate',
      depression_history: false,
      head_injury_history: false,
      alcohol_consumption: 'light',
      social_isolation: false,
      cognitive_complaints: false,
    },
  });

  const calculateFraminghamRisk = (data: FraminghamAlzheimerFormData): FraminghamAlzheimerRiskResult => {
    let riskScore = 0;
    const riskFactors: string[] = [];
    const protectiveFactors: string[] = [];
    const recommendations: string[] = [];

    // Возраст (основной фактор)
    if (data.age >= 85) {
      riskScore += 4;
      riskFactors.push('Возраст 85+ лет');
    } else if (data.age >= 75) {
      riskScore += 3;
      riskFactors.push('Возраст 75-84 года');
    } else if (data.age >= 65) {
      riskScore += 2;
      riskFactors.push('Возраст 65-74 года');
    } else if (data.age >= 55) {
      riskScore += 1;
      riskFactors.push('Возраст 55-64 года');
    }

    // Пол (женщины имеют несколько больший риск)
    if (data.gender === 'female') {
      riskScore += 0.5;
    }

    // APOE4 статус (очень важный фактор)
    if (data.apoe4_status === 'homozygous') {
      riskScore += 5;
      riskFactors.push('Две копии гена APOE4');
      recommendations.push('Обратитесь к неврологу для разработки индивидуального плана профилактики');
    } else if (data.apoe4_status === 'heterozygous') {
      riskScore += 2;
      riskFactors.push('Одна копия гена APOE4');
      recommendations.push('Рассмотрите участие в программах когнитивной тренировки');
    }

    // Образование (защитный фактор)
    if (data.education_years >= 16) {
      riskScore -= 1;
      protectiveFactors.push('Высшее образование');
    } else if (data.education_years < 8) {
      riskScore += 1;
      riskFactors.push('Низкий уровень образования');
      recommendations.push('Занимайтесь интеллектуальной деятельностью: чтение, головоломки, изучение нового');
    }

    // Семейная история
    if (data.family_history_dementia) {
      riskScore += 1.5;
      riskFactors.push('Семейная история деменции');
      recommendations.push('Регулярно проходите когнитивное тестирование');
    }

    // Сердечно-сосудистые факторы
    if (data.cardiovascular_disease) {
      riskScore += 1.5;
      riskFactors.push('Сердечно-сосудистые заболевания');
      recommendations.push('Контролируйте сердечно-сосудистое здоровье');
    }

    if (data.diabetes) {
      riskScore += 1;
      riskFactors.push('Сахарный диабет');
      recommendations.push('Поддерживайте нормальный уровень глюкозы в крови');
    }

    if (data.hypertension) {
      riskScore += 0.5;
      riskFactors.push('Артериальная гипертензия');
      recommendations.push('Контролируйте артериальное давление');
    }

    // Образ жизни
    if (data.smoking_status === 'current') {
      riskScore += 1;
      riskFactors.push('Курение');
      recommendations.push('Бросьте курить - это значительно снизит риск');
    }

    if (data.physical_activity === 'high') {
      riskScore -= 1;
      protectiveFactors.push('Высокая физическая активность');
    } else if (data.physical_activity === 'low') {
      riskScore += 0.5;
      riskFactors.push('Низкая физическая активность');
      recommendations.push('Увеличьте физическую активность до 150 минут в неделю');
    }

    // ИМТ
    if (data.bmi && data.bmi >= 30) {
      riskScore += 0.5;
      riskFactors.push('Ожирение');
      recommendations.push('Нормализуйте массу тела');
    }

    // Другие факторы
    if (data.depression_history) {
      riskScore += 0.5;
      riskFactors.push('История депрессии');
      recommendations.push('Следите за психическим здоровьем');
    }

    if (data.head_injury_history) {
      riskScore += 0.5;
      riskFactors.push('Черепно-мозговые травмы');
    }

    if (data.social_isolation) {
      riskScore += 0.5;
      riskFactors.push('Социальная изоляция');
      recommendations.push('Поддерживайте социальные связи');
    }

    if (data.cognitive_complaints) {
      riskScore += 1;
      riskFactors.push('Жалобы на память');
      recommendations.push('Обратитесь к неврологу для оценки когнитивных функций');
    }

    // Алкоголь (умеренное потребление может быть защитным)
    if (data.alcohol_consumption === 'light' || data.alcohol_consumption === 'moderate') {
      riskScore -= 0.25;
      protectiveFactors.push('Умеренное потребление алкоголя');
    } else if (data.alcohol_consumption === 'heavy') {
      riskScore += 0.5;
      riskFactors.push('Злоупотребление алкоголем');
      recommendations.push('Сократите потребление алкоголя');
    }

    // Конвертация в проценты
    const tenYearRisk = Math.min(Math.max(riskScore * 2, 0.1), 50);
    const lifetimeRisk = Math.min(Math.max(riskScore * 4, 0.5), 80);

    // Определение уровня риска
    let riskLevel: 'low' | 'intermediate' | 'high';
    if (tenYearRisk < 5) {
      riskLevel = 'low';
    } else if (tenYearRisk < 15) {
      riskLevel = 'intermediate';
    } else {
      riskLevel = 'high';
    }

    // Базовые рекомендации
    recommendations.push(
      'Соблюдайте средиземноморскую диету',
      'Высыпайтесь (7-9 часов в сутки)',
      'Управляйте стрессом',
      'Регулярно проходите медицинские осмотры'
    );

    return {
      tenYearRisk: Math.round(tenYearRisk * 10) / 10,
      lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
      riskLevel,
      riskFactors,
      protectiveFactors,
      recommendations: [...new Set(recommendations)], // убираем дубликаты
    };
  };

  const onSubmit = async (data: FraminghamAlzheimerFormData) => {
    if (!user) {
      toast.error('Необходимо войти в систему для сохранения результатов');
      return;
    }

    setIsLoading(true);

    try {
      const result = calculateFraminghamRisk(data);

      // Сохраняем в базу данных
      const { error } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'framingham_alzheimer',
          assessment_data: data,
          results_data: result,
          risk_percentage: result.tenYearRisk,
          risk_level: result.riskLevel,
          recommendations: result.recommendations,
        });

      if (error) throw error;

      toast.success('Оценка риска болезни Альцгеймера завершена!');
      onComplete?.();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Ошибка при сохранении оценки');
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
