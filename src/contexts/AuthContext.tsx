
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Инициализация...');
    
    // Настраиваем слушатель изменений состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider: Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Проверяем существующую сессию
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('AuthProvider: Ошибка при получении сессии:', error);
      } else {
        console.log('AuthProvider: Существующая сессия:', session?.user?.email || 'нет');
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('AuthProvider: Попытка регистрации для:', email);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error('AuthProvider: Ошибка регистрации:', error);
      } else {
        console.log('AuthProvider: Регистрация успешна:', data.user?.email);
      }
      
      return { error };
    } catch (err) {
      console.error('AuthProvider: Неожиданная ошибка при регистрации:', err);
      return { error: new Error('Произошла неожиданная ошибка') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Попытка входа для:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('AuthProvider: Ошибка входа:', error);
      } else {
        console.log('AuthProvider: Вход успешен:', data.user?.email);
      }
      
      return { error };
    } catch (err) {
      console.error('AuthProvider: Неожиданная ошибка при входе:', err);
      return { error: new Error('Произошла неожиданная ошибка') };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthProvider: Выход из системы...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Ошибка при выходе:', error);
      } else {
        console.log('AuthProvider: Выход успешен');
      }
    } catch (err) {
      console.error('AuthProvider: Неожиданная ошибка при выходе:', err);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  console.log('AuthProvider: Текущее состояние - loading:', loading, ', user:', user?.email || 'нет');

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
