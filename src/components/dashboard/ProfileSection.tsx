
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Calendar, Ruler, Weight } from "lucide-react";
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

const ProfileSection = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getActivityLevelText = (level: string) => {
    const levels = {
      'sedentary': 'Малоподвижный',
      'lightly_active': 'Слегка активный',
      'moderately_active': 'Умеренно активный',
      'very_active': 'Очень активный',
      'extremely_active': 'Крайне активный'
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getGenderText = (gender: string) => {
    const genders = {
      'female': 'Ж',
      'male': 'М',
      'other': 'Другой'
    };
    return genders[gender as keyof typeof genders] || gender;
  };

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Пользователь';
  const userAge = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : profile?.age;

  if (isEditing) {
    return (
      <ProfileEditForm 
        onCancel={() => setIsEditing(false)}
        onSave={() => {
          setIsEditing(false);
          fetchProfile();
        }}
      />
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <div className="flex-1">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-pink-600" />
            <span>Профиль</span>
          </CardTitle>
          <CardDescription>Ваша личная информация</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">
                {profile?.activity_level ? getActivityLevelText(profile.activity_level) : 'Активный пользователь'}
              </Badge>
              {profile?.gender && (
                <Badge variant="outline">{getGenderText(profile.gender)}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">
              {userAge || '--'}
            </p>
            <p className="text-xs text-gray-600">Возраст</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {profile?.height || '--'}
            </p>
            <p className="text-xs text-gray-600">Рост (см)</p>
          </div>
        </div>

        {profile?.weight && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                <Weight className="w-4 h-4 mr-1" />
                Вес:
              </span>
              <span className="text-gray-900">{profile.weight} кг</span>
            </div>
          </div>
        )}

        {profile?.health_goals && (
          <div className="pt-2 border-t">
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Цели:</span>
              <p className="text-gray-900 mt-1 text-xs leading-relaxed">
                {profile.health_goals.length > 100 
                  ? `${profile.health_goals.substring(0, 100)}...` 
                  : profile.health_goals}
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Регистрация:
            </span>
            <span className="text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Недавно'}
            </span>
          </div>
        </div>

        {(!profile?.full_name || !profile?.age || !profile?.gender) && (
          <div className="pt-4 border-t">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                Заполните профиль для получения персонализированных рекомендаций
              </p>
              <Button 
                className="mt-2 w-full" 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Заполнить профиль
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
