
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { framinghamAlzheimerSchema, FraminghamAlzheimerFormData } from './types';
import { calculateFraminghamRisk } from './calculations';
import { saveFraminghamAssessment } from './service';

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

  const onSubmit = async (data: FraminghamAlzheimerFormData) => {
    if (!user) {
      toast.error('Необходимо войти в систему для сохранения результатов');
      return;
    }

    setIsLoading(true);

    try {
      const result = calculateFraminghamRisk(data);
      await saveFraminghamAssessment(user.id, data, result);

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
