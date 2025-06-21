
import { supabase } from '@/integrations/supabase/client';
import { HealthAssessment } from '@/types/patient';

export class HealthAssessmentService {
  static async loadHealthAssessment(patientId: string): Promise<HealthAssessment> {
    const [symptoms, medications, menstrualData] = await Promise.all([
      this.loadSymptoms(patientId),
      this.loadMedications(patientId),
      this.loadMenstrualHealth(patientId)
    ]);

    return {
      currentSymptoms: symptoms,
      chronicConditions: [],
      allergies: [],
      medications,
      lifestyle: {
        smokingStatus: 'never',
        alcoholConsumption: 'none',
        exerciseFrequency: 'moderate',
        sleepHours: 8,
        stressLevel: 5,
        diet: 'standard'
      },
      menstrualHealth: menstrualData
    };
  }

  private static async loadSymptoms(patientId: string) {
    const { data } = await supabase
      .from('symptom_mood_logs')
      .select('*')
      .eq('user_id', patientId)
      .order('log_date', { ascending: false })
      .limit(10);

    return (data || []).map(symptom => ({
      id: symptom.id,
      name: symptom.symptoms?.join(', ') || 'Без симптомов',
      severity: 'moderate' as const,
      duration: '1 день',
      frequency: 'daily' as const,
      firstNoticed: new Date(symptom.log_date)
    }));
  }

  private static async loadMedications(patientId: string) {
    // В будущем можно добавить таблицу medications
    return [];
  }

  private static async loadMenstrualHealth(patientId: string) {
    const { data } = await supabase
      .from('menstrual_cycles')
      .select('*')
      .eq('user_id', patientId)
      .order('cycle_start_date', { ascending: false })
      .limit(1);

    if (data && data[0]) {
      return {
        cycleLength: data[0].cycle_length || 28,
        periodLength: data[0].period_length || 5,
        lastPeriodDate: new Date(data[0].cycle_start_date),
        irregularities: [],
        symptoms: [],
        contraception: undefined // This field doesn't exist in the menstrual_cycles table
      };
    }

    return undefined;
  }
}
