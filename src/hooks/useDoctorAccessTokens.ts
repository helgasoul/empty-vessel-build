
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AccessToken {
  id: string;
  token_code: string;
  doctor_name: string | null;
  doctor_email: string | null;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  access_permissions: {
    medical_records: boolean;
    family_history: boolean;
    health_data: boolean;
  };
  created_at: string;
}

export const useDoctorAccessTokens = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTokens = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctor_access_tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle Json type from Supabase
      const typedTokens = (data || []).map(token => ({
        ...token,
        access_permissions: token.access_permissions as {
          medical_records: boolean;
          family_history: boolean;
          health_data: boolean;
        }
      }));
      
      setTokens(typedTokens);
    } catch (error) {
      console.error('Error loading access tokens:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить токены доступа",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createToken = async (tokenData: {
    doctorName?: string;
    doctorEmail?: string;
    expiresAt: Date;
    permissions: {
      medical_records: boolean;
      family_history: boolean;
      health_data: boolean;
    };
  }) => {
    if (!user) throw new Error('User not authenticated');

    const generateSecureToken = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const tokenCode = generateSecureToken();

    const { data, error } = await supabase
      .from('doctor_access_tokens')
      .insert({
        user_id: user.id,
        token_code: tokenCode,
        doctor_email: tokenData.doctorEmail || null,
        doctor_name: tokenData.doctorName || null,
        expires_at: tokenData.expiresAt.toISOString(),
        access_permissions: tokenData.permissions
      })
      .select()
      .single();

    if (error) throw error;
    
    await loadTokens();
    return { ...data, token_code: tokenCode };
  };

  const deleteToken = async (tokenId: string) => {
    const { error } = await supabase
      .from('doctor_access_tokens')
      .delete()
      .eq('id', tokenId);

    if (error) throw error;
    
    setTokens(prev => prev.filter(token => token.id !== tokenId));
    
    toast({
      title: "Токен удален",
      description: "Токен доступа успешно удален"
    });
  };

  const getActiveTokensCount = () => {
    const now = new Date();
    return tokens.filter(token => 
      !token.is_used && new Date(token.expires_at) > now
    ).length;
  };

  const getUsedTokensCount = () => {
    return tokens.filter(token => token.is_used).length;
  };

  useEffect(() => {
    if (user) {
      loadTokens();
    }
  }, [user]);

  return {
    tokens,
    loading,
    loadTokens,
    createToken,
    deleteToken,
    getActiveTokensCount,
    getUsedTokensCount
  };
};
