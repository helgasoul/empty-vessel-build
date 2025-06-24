
import { useState, useCallback } from 'react';
import type { GailCalculatorInput } from '../../types/gail-calculator';

interface ValidationError {
  field: string;
  message: string;
}

export const useCalculationValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validateInput = useCallback(async (input: GailCalculatorInput): Promise<boolean> => {
    setIsValidating(true);
    setValidationErrors([]);

    const errors: ValidationError[] = [];

    // Validate personal info
    if (!input.personalInfo.age || input.personalInfo.age < 18 || input.personalInfo.age > 100) {
      errors.push({ field: 'age', message: 'Возраст должен быть от 18 до 100 лет' });
    }

    if (!input.personalInfo.race) {
      errors.push({ field: 'race', message: 'Необходимо указать расовую принадлежность' });
    }

    // Validate medical history
    if (input.medicalHistory.ageAtMenarche && (input.medicalHistory.ageAtMenarche < 8 || input.medicalHistory.ageAtMenarche > 18)) {
      errors.push({ field: 'ageAtMenarche', message: 'Возраст менархе должен быть от 8 до 18 лет' });
    }

    if (input.medicalHistory.ageAtFirstBirth && input.medicalHistory.ageAtFirstBirth < 15) {
      errors.push({ field: 'ageAtFirstBirth', message: 'Возраст первых родов не может быть менее 15 лет' });
    }

    // Validate family history
    if (!input.familyHistory) {
      errors.push({ field: 'familyHistory', message: 'Необходимо указать семейную историю' });
    }

    setValidationErrors(errors);
    setIsValidating(false);

    return errors.length === 0;
  }, []);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    isValidating,
    validationErrors,
    validateInput,
    clearValidationErrors,
  };
};
