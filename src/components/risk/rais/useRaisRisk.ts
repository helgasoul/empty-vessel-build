
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { raisRiskSchema, RaisRiskFormData } from './types';
import { calculateRaisRisk } from './calculations';
import { saveRaisRiskAssessment } from './service';

export const useRaisRisk = (onComplete?: () => void) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<RaisRiskFormData>({
    resolver: zodResolver(raisRiskSchema),
    defaultValues: {
      age: 35,
      gender: 'female',
      body_weight: 70,
      exposure_scenario: 'occupational',
      exposure_duration: 20,
      exposure_frequency: 250,
      exposure_time_per_day: 8,
      chemical_substance: 'benzene',
      inhalation_exposure: true,
      inhalation_concentration: 0.1,
      dermal_exposure: false,
      oral_exposure: false,
      air_temperature: 20,
      humidity: 50,
      soil_type: 'loam',
      smoking_status: 'never',
      alcohol_consumption: 'light',
      diet_type: 'standard',
      respiratory_diseases: false,
      liver_diseases: false,
      kidney_diseases: false,
      cardiovascular_diseases: false,
      immune_disorders: false,
      work_environment: 'industrial',
      protective_equipment_use: true,
      ventilation_quality: 'adequate',
      housing_type: 'apartment',
      housing_age: 15,
      proximity_to_industrial_sites: 'moderate',
      water_source: 'municipal',
    },
  });

  const onSubmit = async (data: RaisRiskFormData) => {
    if (!user) {
      toast.error('Необходимо войти в систему для сохранения результатов');
      return;
    }

    setIsLoading(true);

    try {
      const result = calculateRaisRisk(data);
      await saveRaisRiskAssessment(user.id, data, result);

      toast.success('Оценка химических рисков завершена!');
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
