
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { User, Save } from "lucide-react";
import type { Tables } from '@/integrations/supabase/types';

import BasicInfoSection from './BasicInfoSection';
import PhysicalParametersSection from './PhysicalParametersSection';
import LifestyleSection from './LifestyleSection';
import MedicalHistorySection from './MedicalHistorySection';
import AdditionalMedicalSection from './AdditionalMedicalSection';
import EmergencyContactSection from './EmergencyContactSection';
import GeneralInfoSection from './GeneralInfoSection';

type Profile = Tables<'profiles'>;

const ProfileEditForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '',
    age: null,
    gender: '',
    height: null,
    weight: null,
    date_of_birth: '',
    activity_level: '',
    smoking_status: '',
    alcohol_consumption: '',
    lifestyle: '',
    medical_history: '',
    current_health_issues: '',
    health_goals: '',
    family_history: '',
    current_medications: '',
    chronic_conditions: '',
    allergies: '',
    previous_surgeries: '',
    vaccination_history: '',
    mental_health_history: '',
    reproductive_health: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    preferred_doctor: '',
    insurance_info: '',
    dietary_restrictions: '',
    sleep_patterns: '',
    stress_levels: '',
    exercise_frequency: '',
    last_checkup_date: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('Profile data loaded:', data);
        setProfile(data);
      } else {
        console.log('No existing profile found, using defaults');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить профиль",
        variant: "destructive"
      });
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (profile.age && (profile.age < 0 || profile.age > 150)) {
      errors.push('Возраст должен быть от 0 до 150 лет');
    }
    
    if (profile.height && (profile.height < 50 || profile.height > 250)) {
      errors.push('Рост должен быть от 50 до 250 см');
    }
    
    if (profile.weight && (profile.weight < 20 || profile.weight > 500)) {
      errors.push('Вес должен быть от 20 до 500 кг');
    }

    if (profile.emergency_contact_phone && !/^[\+]?[0-9\(\)\-\s]+$/.test(profile.emergency_contact_phone)) {
      errors.push('Некорректный формат телефона экстренного контакта');
    }

    return errors;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Ошибка валидации",
        description: validationErrors.join('; '),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Saving profile data:', profile);
      
      const profileData = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving profile:', error);
        throw new Error(`Ошибка сохранения: ${error.message}`);
      }

      console.log('Profile saved successfully:', data);

      toast({
        title: "Успешно",
        description: "Профиль обновлен и сохранен"
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Не удалось обновить профиль';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-pink-600" />
          <span>Редактирование профиля</span>
        </CardTitle>
        <CardDescription>
          Заполните подробную информацию о себе для получения персонализированных рекомендаций
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-8">
          <BasicInfoSection profile={profile} onInputChange={handleInputChange} />
          <PhysicalParametersSection profile={profile} onInputChange={handleInputChange} />
          <LifestyleSection profile={profile} onInputChange={handleInputChange} />
          <MedicalHistorySection profile={profile} onInputChange={handleInputChange} />
          <AdditionalMedicalSection profile={profile} onInputChange={handleInputChange} />
          <EmergencyContactSection profile={profile} onInputChange={handleInputChange} />
          <GeneralInfoSection profile={profile} onInputChange={handleInputChange} />

          <div className="flex gap-4 pt-6 border-t">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить профиль'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
