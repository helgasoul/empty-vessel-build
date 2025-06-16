
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ProfileEditForm from '@/components/profile/ProfileEditForm';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад в панель</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-6 h-6 text-blue-600" />
              <span>Профиль пользователя</span>
            </CardTitle>
            <CardDescription>
              Управляйте своими личными данными и настройками профиля
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileEditForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
