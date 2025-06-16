import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BMIDisplay } from "@/components/ui/bmi-display";
import { toast } from "@/hooks/use-toast";
import { User, Save, X } from "lucide-react";
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface ProfileEditFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onCancel, onSave }) => {
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

    // Валидация данных
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
      
      // Подготавливаем данные для сохранения
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
      
      onSave();
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
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Полное имя</Label>
                <Input
                  id="full_name"
                  value={profile.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Анна Иванова"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Дата рождения</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profile.date_of_birth || ''}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Пол</Label>
                <Select value={profile.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите пол" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="male">Мужской</SelectItem>
                    <SelectItem value="other">Другой</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Возраст</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="120"
                  value={profile.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="25"
                />
              </div>
            </div>
          </div>

          {/* Физические параметры */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Физические параметры</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Рост (см)</Label>
                <Input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  value={profile.height || ''}
                  onChange={(e) => handleInputChange('height', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="165"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Вес (кг)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={profile.weight || ''}
                  onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="60.5"
                />
              </div>

              {/* Автоматический расчет ИМТ */}
              <div className="flex items-end">
                <BMIDisplay 
                  weight={profile.weight} 
                  height={profile.height}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Образ жизни */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Образ жизни</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity_level">Уровень активности</Label>
                <Select value={profile.activity_level || ''} onValueChange={(value) => handleInputChange('activity_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Малоподвижный</SelectItem>
                    <SelectItem value="lightly_active">Слегка активный</SelectItem>
                    <SelectItem value="moderately_active">Умеренно активный</SelectItem>
                    <SelectItem value="very_active">Очень активный</SelectItem>
                    <SelectItem value="extremely_active">Крайне активный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exercise_frequency">Частота упражнений</Label>
                <Select value={profile.exercise_frequency || ''} onValueChange={(value) => handleInputChange('exercise_frequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Частота тренировок" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Никогда</SelectItem>
                    <SelectItem value="rarely">Редко</SelectItem>
                    <SelectItem value="weekly">Еженедельно</SelectItem>
                    <SelectItem value="daily">Ежедневно</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stress_levels">Уровень стресса</Label>
                <Select value={profile.stress_levels || ''} onValueChange={(value) => handleInputChange('stress_levels', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Уровень стресса" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="moderate">Умеренный</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="very_high">Очень высокий</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smoking_status">Курение</Label>
                <Select value={profile.smoking_status || ''} onValueChange={(value) => handleInputChange('smoking_status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Статус курения" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Никогда не курил(а)</SelectItem>
                    <SelectItem value="former">Бросил(а) курить</SelectItem>
                    <SelectItem value="current">Курю</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alcohol_consumption">Алкоголь</Label>
                <Select value={profile.alcohol_consumption || ''} onValueChange={(value) => handleInputChange('alcohol_consumption', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Употребление алкоголя" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Никогда</SelectItem>
                    <SelectItem value="rarely">Редко</SelectItem>
                    <SelectItem value="occasionally">Иногда</SelectItem>
                    <SelectItem value="regularly">Регулярно</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_checkup_date">Последний осмотр</Label>
                <Input
                  id="last_checkup_date"
                  type="date"
                  value={profile.last_checkup_date || ''}
                  onChange={(e) => handleInputChange('last_checkup_date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleep_patterns">Режим сна</Label>
                <Textarea
                  id="sleep_patterns"
                  value={profile.sleep_patterns || ''}
                  onChange={(e) => handleInputChange('sleep_patterns', e.target.value)}
                  placeholder="Опишите ваш режим сна: время отхода ко сну, продолжительность, качество..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietary_restrictions">Диетические ограничения</Label>
                <Textarea
                  id="dietary_restrictions"
                  value={profile.dietary_restrictions || ''}
                  onChange={(e) => handleInputChange('dietary_restrictions', e.target.value)}
                  placeholder="Аллергии на продукты, диеты, предпочтения в питании..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Медицинская история */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Медицинская история</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="family_history">Семейная история</Label>
                <Textarea
                  id="family_history"
                  value={profile.family_history || ''}
                  onChange={(e) => handleInputChange('family_history', e.target.value)}
                  placeholder="Заболевания в семье: диабет, сердечно-сосудистые заболевания, онкология..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronic_conditions">Хронические заболевания</Label>
                <Textarea
                  id="chronic_conditions"
                  value={profile.chronic_conditions || ''}
                  onChange={(e) => handleInputChange('chronic_conditions', e.target.value)}
                  placeholder="Хронические заболевания, диагнозы..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_medications">Текущие лекарства</Label>
                <Textarea
                  id="current_medications"
                  value={profile.current_medications || ''}
                  onChange={(e) => handleInputChange('current_medications', e.target.value)}
                  placeholder="Принимаемые препараты, дозировки, режим..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Аллергии</Label>
                <Textarea
                  id="allergies"
                  value={profile.allergies || ''}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="Аллергические реакции на лекарства, продукты, другие вещества..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previous_surgeries">Предыдущие операции</Label>
                <Textarea
                  id="previous_surgeries"
                  value={profile.previous_surgeries || ''}
                  onChange={(e) => handleInputChange('previous_surgeries', e.target.value)}
                  placeholder="Перенесенные операции, даты, особенности..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccination_history">История вакцинации</Label>
                <Textarea
                  id="vaccination_history"
                  value={profile.vaccination_history || ''}
                  onChange={(e) => handleInputChange('vaccination_history', e.target.value)}
                  placeholder="Вакцинации, даты, реакции..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Специализированная медицинская информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Дополнительная медицинская информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mental_health_history">История психического здоровья</Label>
                <Textarea
                  id="mental_health_history"
                  value={profile.mental_health_history || ''}
                  onChange={(e) => handleInputChange('mental_health_history', e.target.value)}
                  placeholder="Депрессия, тревожность, терапия, лечение..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reproductive_health">Репродуктивное здоровье</Label>
                <Textarea
                  id="reproductive_health"
                  value={profile.reproductive_health || ''}
                  onChange={(e) => handleInputChange('reproductive_health', e.target.value)}
                  placeholder="Менструальный цикл, беременности, гормональная терапия..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_doctor">Предпочитаемый врач</Label>
                <Input
                  id="preferred_doctor"
                  value={profile.preferred_doctor || ''}
                  onChange={(e) => handleInputChange('preferred_doctor', e.target.value)}
                  placeholder="ФИО врача, специализация, контакты"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance_info">Информация о страховке</Label>
                <Input
                  id="insurance_info"
                  value={profile.insurance_info || ''}
                  onChange={(e) => handleInputChange('insurance_info', e.target.value)}
                  placeholder="Номер полиса, страховая компания"
                />
              </div>
            </div>
          </div>

          {/* Экстренные контакты */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Экстренные контакты</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Имя контакта</Label>
                <Input
                  id="emergency_contact_name"
                  value={profile.emergency_contact_name || ''}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  placeholder="ФИО экстренного контакта"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Телефон</Label>
                <Input
                  id="emergency_contact_phone"
                  value={profile.emergency_contact_phone || ''}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_relation">Отношение</Label>
                <Input
                  id="emergency_contact_relation"
                  value={profile.emergency_contact_relation || ''}
                  onChange={(e) => handleInputChange('emergency_contact_relation', e.target.value)}
                  placeholder="Родственник, друг, коллега"
                />
              </div>
            </div>
          </div>

          {/* Общие поля */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Общая информация</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lifestyle">Образ жизни</Label>
                <Textarea
                  id="lifestyle"
                  value={profile.lifestyle || ''}
                  onChange={(e) => handleInputChange('lifestyle', e.target.value)}
                  placeholder="Опишите ваш образ жизни, режим дня, работу..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="health_goals">Цели в области здоровья</Label>
                <Textarea
                  id="health_goals"
                  value={profile.health_goals || ''}
                  onChange={(e) => handleInputChange('health_goals', e.target.value)}
                  placeholder="Какие у вас цели? Снижение веса, улучшение физической формы, профилактика заболеваний..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_history">Медицинская история</Label>
                <Textarea
                  id="medical_history"
                  value={profile.medical_history || ''}
                  onChange={(e) => handleInputChange('medical_history', e.target.value)}
                  placeholder="Общая медицинская информация, важные события..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_health_issues">Текущие проблемы со здоровьем</Label>
                <Textarea
                  id="current_health_issues"
                  value={profile.current_health_issues || ''}
                  onChange={(e) => handleInputChange('current_health_issues', e.target.value)}
                  placeholder="Опишите любые текущие симптомы или проблемы со здоровьем..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4 pt-6 border-t">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить профиль'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
