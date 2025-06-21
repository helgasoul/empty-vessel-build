
import { supabase } from '@/integrations/supabase/client';
import { LabResult } from '@/types/healthVault';

export class LabResultsService {
  static async createLabResult(resultData: Partial<LabResult>): Promise<LabResult> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Ensure required fields are present
    const dataToInsert = {
      ...resultData,
      user_id: user.id,
      test_date: resultData.test_date || new Date().toISOString().split('T')[0],
      test_name: resultData.test_name || 'Unknown Test'
    };

    const { data, error } = await supabase
      .from('lab_results')
      .insert(dataToInsert)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Ошибка создания результата анализа: ${error.message}`);
    }
    
    return data;
  }
  
  static async getUserLabResults(userId: string): Promise<LabResult[]> {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*')
      .eq('user_id', userId)
      .order('test_date', { ascending: false });
      
    if (error) {
      throw new Error(`Ошибка получения результатов анализов: ${error.message}`);
    }
    
    return data || [];
  }
  
  static async getLabResultsByCategory(userId: string, category: string): Promise<LabResult[]> {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*')
      .eq('user_id', userId)
      .eq('test_category', category)
      .order('test_date', { ascending: false });
      
    if (error) {
      throw new Error(`Ошибка получения результатов по категории: ${error.message}`);
    }
    
    return data || [];
  }
  
  static async getLabResultsTrend(userId: string, testName: string): Promise<LabResult[]> {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*')
      .eq('user_id', userId)
      .eq('test_name', testName)
      .not('result_numeric', 'is', null)
      .order('test_date', { ascending: true });
      
    if (error) {
      throw new Error(`Ошибка получения трендов: ${error.message}`);
    }
    
    return data || [];
  }
  
  static async updateLabResult(resultId: string, updates: Partial<LabResult>): Promise<LabResult> {
    const { data, error } = await supabase
      .from('lab_results')
      .update(updates)
      .eq('id', resultId)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Ошибка обновления результата: ${error.message}`);
    }
    
    return data;
  }
  
  static async deleteLabResult(resultId: string): Promise<void> {
    const { error } = await supabase
      .from('lab_results')
      .delete()
      .eq('id', resultId);
      
    if (error) {
      throw new Error(`Ошибка удаления результата: ${error.message}`);
    }
  }
}
