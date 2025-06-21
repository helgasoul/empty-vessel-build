
export type UserRole = 'patient' | 'doctor' | 'clinic' | 'laboratory' | 'admin';
export type AppRole = UserRole; // Add this alias for consistency

export interface User {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: 'female' | 'male' | 'other';
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  full_name: string;
  specialization: string;
  qualification?: string;
  experience_years?: number;
  bio?: string;
  photo_url?: string;
  consultation_fee: number;
  is_available: boolean;
  working_hours?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ClinicProfile {
  id: string;
  user_id: string;
  clinic_name: string;
  clinic_type?: string;
  license_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  services_offered?: string[];
  working_hours?: Record<string, any>;
  is_active: boolean;
  api_access_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface LaboratoryProfile {
  id: string;
  user_id: string;
  laboratory_name: string;
  license_number?: string;
  accreditation?: string[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  test_types_offered?: string[];
  working_hours?: Record<string, any>;
  is_active: boolean;
  api_access_enabled: boolean;
  created_at: string;
  updated_at: string;
}
