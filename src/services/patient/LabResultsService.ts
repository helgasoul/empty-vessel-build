
import { supabase } from '@/integrations/supabase/client';
import { LabResult, CalculatedIndex } from '@/types/patient';
import { toast } from 'sonner';

export class LabResultsService {
  static async loadLabResults(patientId: string): Promise<LabResult[]> {
    const { data } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', patientId)
      .eq('record_type', 'lab_result')
      .order('record_date', { ascending: false });

    return (data || []).map(record => {
      let metadata: any = {};
      try {
        metadata = typeof record.metadata === 'string' 
          ? JSON.parse(record.metadata) 
          : record.metadata || {};
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }

      return {
        id: record.id,
        testType: record.title,
        testDate: new Date(record.record_date),
        results: metadata.results || {},
        interpretation: record.description || '',
        referenceRanges: metadata.reference_ranges || {},
        status: 'completed' as const,
        uploadedBy: 'patient' as const,
        doctorNotes: metadata.doctor_notes,
        calculatedIndices: metadata.calculated_indices || []
      };
    });
  }

  static async saveLabResult(labResult: LabResult, userId: string): Promise<void> {
    if (!userId) return;

    const { error } = await supabase
      .from('medical_records')
      .insert({
        user_id: userId,
        record_type: 'lab_result',
        title: labResult.testType,
        description: labResult.interpretation,
        record_date: labResult.testDate.toISOString().split('T')[0],
        metadata: {
          results: labResult.results,
          reference_ranges: labResult.referenceRanges,
          calculated_indices: labResult.calculatedIndices,
          status: labResult.status
        } as any
      });

    if (error) {
      throw new Error('Ошибка сохранения результатов анализов');
    }
  }
}
