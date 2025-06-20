
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FamilyMember {
  id: string;
  family_group_id: string;
  name: string;
  relationship: string;
  gender?: string;
  date_of_birth?: string;
  birth_year?: number;
  is_alive: boolean;
  medical_notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useFamilyMembers = (familyGroupId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFamilyMembers = async () => {
    if (!user || !familyGroupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading family members for group:', familyGroupId);
      
      // Поскольку RLS отключен для family_members, нам нужно проверить доступ самостоятельно
      // Сначала проверим, что пользователь имеет доступ к этой семейной группе
      const { data: familyGroup, error: groupError } = await supabase
        .from('family_groups')
        .select('id, created_by')
        .eq('id', familyGroupId)
        .eq('created_by', user.id)
        .single();

      if (groupError || !familyGroup) {
        console.error('User does not have access to this family group');
        setFamilyMembers([]);
        setLoading(false);
        return;
      }

      // Теперь загружаем членов семьи для этой группы
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('family_group_id', familyGroupId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading family members:', error);
        throw error;
      }

      console.log('Family members loaded:', data);
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error loading family members:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить членов семьи",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createFamilyMember = async (memberData: {
    name: string;
    relationship: string;
    gender?: string;
    date_of_birth?: string;
    birth_year?: number;
    is_alive?: boolean;
    medical_notes?: string;
  }) => {
    if (!user || !familyGroupId) throw new Error('User not authenticated or no family group selected');

    // Проверяем доступ к семейной группе
    const { data: familyGroup, error: groupError } = await supabase
      .from('family_groups')
      .select('id')
      .eq('id', familyGroupId)
      .eq('created_by', user.id)
      .single();

    if (groupError || !familyGroup) {
      throw new Error('Access denied to family group');
    }

    const { data, error } = await supabase
      .from('family_members')
      .insert({
        ...memberData,
        family_group_id: familyGroupId,
        created_by: user.id,
        is_alive: memberData.is_alive !== undefined ? memberData.is_alive : true
      })
      .select()
      .single();

    if (error) throw error;
    
    setFamilyMembers(prev => [data, ...prev]);
    return data;
  };

  const updateFamilyMember = async (memberId: string, updates: Partial<FamilyMember>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', memberId)
      .eq('created_by', user.id)
      .select()
      .single();

    if (error) throw error;
    
    setFamilyMembers(prev => 
      prev.map(member => member.id === memberId ? { ...member, ...data } : member)
    );
    
    return data;
  };

  const deleteFamilyMember = async (memberId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', memberId)
      .eq('created_by', user.id);

    if (error) throw error;
    
    setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    
    toast({
      title: "Член семьи удален",
      description: "Информация о члене семьи успешно удалена"
    });
  };

  useEffect(() => {
    if (user && familyGroupId) {
      loadFamilyMembers();
    }
  }, [user, familyGroupId]);

  return {
    familyMembers,
    loading,
    loadFamilyMembers,
    createFamilyMember,
    updateFamilyMember,
    deleteFamilyMember
  };
};
