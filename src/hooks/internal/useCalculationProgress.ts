
import { useState, useCallback } from 'react';

interface CalculationProgress {
  current: number;
  total: number;
  message?: string;
}

export const useCalculationProgress = (
  onProgress?: (progress: CalculationProgress) => void
) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgressState] = useState<CalculationProgress | null>(null);

  const setProgress = useCallback((current: number, total: number, message?: string) => {
    const progressData = { current, total, message };
    setProgressState(progressData);
    onProgress?.(progressData);
  }, [onProgress]);

  const startCalculation = useCallback(() => {
    setIsCalculating(true);
    setProgressState(null);
  }, []);

  const finishCalculation = useCallback(() => {
    setIsCalculating(false);
    setProgressState(null);
  }, []);

  return {
    isCalculating,
    progress,
    setProgress,
    startCalculation,
    finishCalculation,
  };
};
