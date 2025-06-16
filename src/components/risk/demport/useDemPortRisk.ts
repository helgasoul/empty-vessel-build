
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { demportSchema, DemPortFormData } from './types';
import { calculateDemPortRisk } from './calculations';
import { saveDemPortAssessment } from './service';

export const useDemPortRisk = (onComplete?: () => void) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<DemPortFormData>({
    resolver: zodResolver(demportSchema),
    defaultValues: {
      age: 65,
      gender: 'female',
      education_years: 12,
      apoe4_status: 'unknown',
      systolic_bp: 120,
      total_cholesterol: 200,
      hdl_cholesterol: 50,
      diabetes: false,
      smoking_status: 'never',
      physical_activity: 'moderate',
      alcohol_consumption: 'light',
      depression_history: false,
      head_injury_history: false,
      stroke_history: false,
      heart_disease: false,
      cognitive_activities: 'moderate',
      social_engagement: 'moderate',
      sleep_quality: 'fair',
      stress_levels: 'moderate',
      family_dementia_history: false,
      family_cardiovascular_history: false,
    },
  });

  const onSubmit = async (data: DemPortFormData) => {
    if (!user) {
      toast.error('Необходимо войти в систему для сохранения результатов');
      return;
    }

    setIsLoading(true);

    try {
      const result = calculateDemPortRisk(data);
      await saveDemPortAssessment(user.id, data, result);

      toast.success('Оценка риска деменции DemPoRT завершена!');
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
