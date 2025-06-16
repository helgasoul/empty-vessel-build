
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PharmacyPartner {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  delivery_available: boolean;
  working_hours?: Record<string, string>;
  delivery_zones?: string[];
  is_active: boolean;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export const usePharmacyPartners = () => {
  const [partners, setPartners] = useState<PharmacyPartner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('pharmacy_partners')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      const transformedPartners: PharmacyPartner[] = (data || []).map(partner => ({
        ...partner,
        working_hours: (partner.working_hours as Record<string, string>) || {},
        delivery_zones: partner.delivery_zones || []
      }));
      
      setPartners(transformedPartners);
    } catch (error) {
      console.error('Ошибка при загрузке аптечных партнеров:', error);
      toast.error('Не удалось загрузить список аптек');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    loading,
    refetch: fetchPartners
  };
};
