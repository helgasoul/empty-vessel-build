
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FamilyGroup {
  id: string;
  family_name: string;
  description?: string;
  tree_name?: string;
  created_by: string;
  visibility_settings: any;
  created_at: string;
  updated_at: string;
}

export const useFamilyGroups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFamilyGroups = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading family groups for user:', user.id);
      
      const { data, error } = await supabase
        .from('family_groups')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading family groups:', error);
        throw error;
      }

      console.log('Family groups loaded:', data);
      setFamilyGroups(data || []);
    } catch (error) {
      console.error('Error loading family groups:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить семейные группы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createFamilyGroup = async (groupData: {
    family_name: string;
    tree_name?: string;
    description?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('family_groups')
      .insert({
        family_name: groupData.family_name,
        tree_name: groupData.tree_name || groupData.family_name,
        description: groupData.description,
        created_by: user.id,
        visibility_settings: {
          medical_sharing: true,
          default_visibility: 'family_only'
        }
      })
      .select()
      .single();

    if (error) throw error;
    
    setFamilyGroups(prev => [data, ...prev]);
    return data;
  };

  const updateFamilyGroup = async (groupId: string, updates: Partial<FamilyGroup>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('family_groups')
      .update(updates)
      .eq('id', groupId)
      .eq('created_by', user.id)
      .select()
      .single();

    if (error) throw error;
    
    setFamilyGroups(prev => 
      prev.map(group => group.id === groupId ? { ...group, ...data } : group)
    );
    
    return data;
  };

  const deleteFamilyGroup = async (groupId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('family_groups')
      .delete()
      .eq('id', groupId)
      .eq('created_by', user.id);

    if (error) throw error;
    
    setFamilyGroups(prev => prev.filter(group => group.id !== groupId));
    
    toast({
      title: "Группа удалена",
      description: "Семейная группа успешно удалена"
    });
  };

  useEffect(() => {
    if (user) {
      loadFamilyGroups();
    }
  }, [user]);

  return {
    familyGroups,
    loading,
    loadFamilyGroups,
    createFamilyGroup,
    updateFamilyGroup,
    deleteFamilyGroup
  };
};
