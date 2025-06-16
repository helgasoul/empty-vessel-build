
import { useState } from 'react';
import { CRCProFormData, CRCProRiskResult } from './types';
import { calculateCRCProRisk } from './calculations';
import { saveCRCProAssessment } from './service';
import { toast } from 'sonner';

export const useCRCProRisk = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CRCProRiskResult | null>(null);

  const calculateRisk = async (formData: CRCProFormData) => {
    setLoading(true);
    try {
      // Рассчитываем риск
      const riskResult = calculateCRCProRisk(formData);
      setResult(riskResult);

      // Сохраняем в базу данных
      await saveCRCProAssessment(formData, riskResult);
      
      toast.success('Оценка CRC-PRO риска завершена!');
      return riskResult;
    } catch (error) {
      console.error('Ошибка при расчете CRC-PRO риска:', error);
      toast.error('Ошибка при сохранении оценки');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetCalculation = () => {
    setResult(null);
  };

  return {
    calculateRisk,
    resetCalculation,
    loading,
    result
  };
};
