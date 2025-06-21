
// Export for consistency with existing usage
export type UserRole = 'patient' | 'doctor' | 'clinic' | 'laboratory' | 'admin';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export interface AuthContextType {
  user: any | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}
