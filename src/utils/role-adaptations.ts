
import { UserRole, Calculator } from '../types/risk-calculator.types';

export const adaptContentForRole = (
  content: { patient: string; doctor: string; specialist: string },
  role: UserRole
): string => {
  return content[role];
};

export const getRequiredDataForRole = (
  calculator: Calculator,
  role: UserRole
): string[] => {
  switch (role) {
    case 'patient':
      return calculator.requiredData.basic;
    case 'doctor':
      return calculator.requiredData.standard;
    case 'specialist':
      return calculator.requiredData.advanced;
    default:
      return calculator.requiredData.basic;
  }
};

export const getRoleBasedComplexity = (
  baseComplexity: 'simple' | 'moderate' | 'complex',
  role: UserRole
): 'simple' | 'moderate' | 'complex' => {
  if (role === 'patient') {
    // Simplify for patients
    return baseComplexity === 'complex' ? 'moderate' : baseComplexity;
  }
  return baseComplexity;
};

export const getRoleDisplayName = (role: UserRole): string => {
  const names = {
    patient: 'Пациент',
    doctor: 'Врач',
    specialist: 'Специалист'
  };
  return names[role];
};
