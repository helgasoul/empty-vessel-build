
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FamilyAccessToken {
  id: string;
  family_group_id: string;
  invited_email: string;
  invited_name: string | null;
  token_code: string;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  used_by: string | null;
  access_permissions: {
    medical_history: boolean;
    documents: boolean;
    personal_info: boolean;
  };
  invitation_message: string | null;
  created_at: string;
  family_groups?: {
    family_name: string;
  };
}

export const useFamilyAccessTokens = (familyGroupId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<FamilyAccessToken[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTokens = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('family_access_tokens')
        .select(`
          *,
          family_groups (
            family_name
          )
        `)
        .order('created_at', { ascending: false });

      if (familyGroupId) {
        query = query.eq('family_group_id', familyGroupId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const typedTokens = (data || []).map(token => ({
        ...token,
        access_permissions: token.access_permissions as {
          medical_history: boolean;
          documents: boolean;
          personal_info: boolean;
        }
      }));
      
      setTokens(typedTokens);
    } catch (error) {
      console.error('Error loading family access tokens:', error);
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
    familyGroupId: string;
    invitedEmail: string;
    invitedName?: string;
    expiresAt: Date;
    permissions: {
      medical_history: boolean;
      documents: boolean;
      personal_info: boolean;
    };
    invitationMessage?: string;
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
      .from('family_access_tokens')
      .insert({
        created_by: user.id,
        family_group_id: tokenData.familyGroupId,
        invited_email: tokenData.invitedEmail,
        invited_name: tokenData.invitedName || null,
        token_code: tokenCode,
        expires_at: tokenData.expiresAt.toISOString(),
        access_permissions: tokenData.permissions,
        invitation_message: tokenData.invitationMessage || null
      })
      .select()
      .single();

    if (error) throw error;
    
    await loadTokens();
    return { ...data, token_code: tokenCode };
  };

  const deleteToken = async (tokenId: string) => {
    const { error } = await supabase
      .from('family_access_tokens')
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
  }, [user, familyGroupId]);

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
