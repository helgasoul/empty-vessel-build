
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import BackButton from '@/components/ui/back-button';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton fallbackPath="/dashboard" className="mb-4" />
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
