
export type UserRole = 'patient' | 'doctor' | 'clinic' | 'laboratory' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
