
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { cancerRiskSchema, CancerRiskFormData } from './types';
import { calculateCancerRisk } from './calculations';
import { saveCancerRiskAssessment } from './service';

export const useCancerRisk = (onComplete?: () => void) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<CancerRiskFormData>({
    resolver: zodResolver(cancerRiskSchema),
    defaultValues: {
      age: 45,
      gender: 'female',
      height: 165,
      weight: 65,
      smoking_status: 'never',
      smoking_years: 0,
      cigarettes_per_day: 0,
      alcohol_consumption: 'light',
      physical_activity: 'moderate',
      fruit_vegetable_intake: 'moderate',
      red_meat_consumption: 'moderate',
      processed_meat_consumption: 'low',
      diabetes: false,
      inflammatory_bowel_disease: false,
      previous_cancer_history: false,
      previous_cancer_types: [],
      family_cancer_history: false,
      family_cancer_types: [],
      occupational_exposure: false,
      exposure_types: [],
      pregnancies_count: 0,
      breastfeeding_duration: 0,
      hormone_replacement_therapy: false,
      oral_contraceptive_use: false,
      mammography_frequency: 'irregular',
      pap_smear_frequency: 'regular',
      colonoscopy_frequency: 'never',
      sun_exposure: 'moderate',
      skin_type: 'fair',
    },
  });

  const onSubmit = async (data: CancerRiskFormData) => {
    if (!user) {
      toast.error('Необходимо войти в систему для сохранения результатов');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Calculating cancer risk with data:', data);
      const result = calculateCancerRisk(data);
      console.log('Cancer risk calculation result:', result);
      
      await saveCancerRiskAssessment(user.id, data, result);

      toast.success('Оценка онкологических рисков завершена!');
      onComplete?.();
    } catch (error) {
      console.error('Error saving cancer risk assessment:', error);
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
