
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    health_goals: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Профиль обновлен"
      });
      
      onSave();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
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
          Заполните информацию о себе для получения персонализированных рекомендаций
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Основная информация */}
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

          {/* Физические параметры */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Образ жизни */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          {/* Текстовые поля */}
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
                placeholder="Укажите важную медицинскую информацию, хронические заболевания, операции..."
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

          {/* Кнопки */}
          <div className="flex gap-4 pt-6">
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
