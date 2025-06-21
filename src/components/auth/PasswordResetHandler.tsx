
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PasswordUpdateForm from './PasswordUpdateForm';

interface PasswordResetHandlerProps {
  user: any;
  onPasswordUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const PasswordResetHandler = ({ user, onPasswordUpdate, isLoading }: PasswordResetHandlerProps) => {
  const [searchParams] = useSearchParams();
  
  const type = searchParams.get('type');
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  // Handle password reset flow
  useEffect(() => {
    if (type === 'recovery' && accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ error }) => {
        if (error) {
          console.error('Error setting session:', error);
          toast.error('Ошибка при восстановлении пароля');
        } else {
          toast.success('Теперь вы можете изменить свой пароль');
        }
      });
    }
  }, [type, accessToken, refreshToken]);

  // If this is a password recovery flow, show password update form
  if (type === 'recovery' && user) {
    return (
      <PasswordUpdateForm
        onSubmit={onPasswordUpdate}
        isLoading={isLoading}
      />
    );
  }

  return null;
};

export default PasswordResetHandler;
