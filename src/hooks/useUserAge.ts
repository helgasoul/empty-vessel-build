
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserAge = () => {
  const { user } = useAuth();
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    const fetchUserAge = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('date_of_birth')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setAge(35); // Возраст по умолчанию
        } else if (data?.date_of_birth) {
          const userAge = calculateAge(data.date_of_birth);
          setAge(userAge);
        } else {
          setAge(35); // Возраст по умолчанию, если дата рождения не указана
        }
      } catch (error) {
        console.error('Error calculating age:', error);
        setAge(35); // Возраст по умолчанию
      } finally {
        setLoading(false);
      }
    };

    fetchUserAge();
  }, [user]);

  return { age, loading };
};
