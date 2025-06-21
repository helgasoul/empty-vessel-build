
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean; // Add alias for compatibility
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: any }>;
  hasRole: (role: UserRole) => boolean;
  switchRole: (role: UserRole) => void; // For testing
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session from localStorage
    const getInitialSession = async () => {
      try {
        const savedUser = localStorage.getItem('prevent_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        localStorage.removeItem('prevent_user');
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('prevent_user');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock authentication - determine role based on email
      let role: UserRole = 'patient';
      if (email.includes('doctor')) role = 'doctor';
      if (email.includes('admin')) role = 'admin';
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role,
        isActive: true,
        createdAt: new Date()
      };
      
      setUser(mockUser);
      localStorage.setItem('prevent_user', JSON.stringify(mockUser));
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setIsLoading(true);
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        isActive: true,
        createdAt: new Date()
      };
      
      setUser(newUser);
      localStorage.setItem('prevent_user', JSON.stringify(newUser));
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  // For testing - role switching
  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('prevent_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    loading: isLoading, // Alias for compatibility
    signOut,
    signIn,
    signUp,
    hasRole,
    switchRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
