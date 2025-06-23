
// Re-export all medical hooks from a central location
export { useMedicalPartners } from './useMedicalPartners';
export { useGynecologyAppointments, useCreateGynecologyAppointment } from './useGynecologyAppointments';
export { useLabTests, useCreateLabTest } from './useLabTests';
export { useScreeningPlans } from './useScreeningPlans';
export { useMedicalReminders } from './useMedicalReminders';

// Re-export types
export type { MedicalPartner } from './useMedicalPartners';
export type { GynecologyAppointment } from './useGynecologyAppointments';
export type { LabTest } from './useLabTests';
export type { ScreeningPlan } from './useScreeningPlans';
export type { MedicalReminder } from './useMedicalReminders';
