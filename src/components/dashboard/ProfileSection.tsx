
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Calendar } from "lucide-react";

const ProfileSection = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const userName = user?.user_metadata?.full_name || user?.email || 'Пользователь';

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
          onClick={() => setIsEditing(!isEditing)}
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
            <Badge variant="secondary" className="mt-1">
              Активный пользователь
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">--</p>
            <p className="text-xs text-gray-600">Возраст</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">Ж</p>
            <p className="text-xs text-gray-600">Пол</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Регистрация:</span>
            <span className="text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Недавно'}
            </span>
          </div>
        </div>

        {isEditing && (
          <div className="pt-4 border-t">
            <Button className="w-full" variant="outline">
              Редактировать профиль
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
