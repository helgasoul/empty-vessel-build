
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MedicalPartner {
  id: string;
  partner_name: string;
  partner_type: 'gynecology_clinic' | 'laboratory' | 'diagnostic_center' | 'hospital';
  legal_entity?: string;
  license_number?: string;
  specializations: string[];
  women_health_focus: boolean;
  age_groups_served: string[];
  address: {
    city: string;
    district: string;
    address: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  api_endpoint?: string;
  api_version?: string;
  integration_status: 'pending' | 'active' | 'suspended' | 'inactive';
  last_sync?: string;
  quality_rating?: number;
  patient_reviews_count: number;
  women_health_expertise?: number;
  available_services: string[];
  appointment_booking_available: boolean;
  online_results_available: boolean;
  telemedicine_available: boolean;
  service_areas: string[];
  coordinates?: any;
  created_at: string;
  updated_at: string;
}

export const useMedicalPartners = () => {
  return useQuery({
    queryKey: ['medical-partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_partners')
        .select('*')
        .eq('integration_status', 'active')
        .order('quality_rating', { ascending: false });

      if (error) {
        console.error('Error fetching medical partners:', error);
        throw error;
      }

      return (data || []) as MedicalPartner[];
    },
  });
};
