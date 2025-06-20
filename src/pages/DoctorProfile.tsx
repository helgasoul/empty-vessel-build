
import React from 'react';
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Settings, Stethoscope } from "lucide-react";
import ProtectedRoute from '@/components/ProtectedRoute';
import DoctorDiplomaUpload from '@/components/doctor/DoctorDiplomaUpload';
import { useMyDoctorProfile } from '@/hooks/useDoctorProfiles';
import { useAuth } from '@/contexts/AuthContext';

const DoctorProfile = () => {
  const { user } = useAuth();
  const { data: doctorProfile, isLoading } = useMyDoctorProfile();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { href: "/", label: "Главная" },
              { label: "Профиль врача" }
            ]}
            className="mb-6"
          />

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Профиль врача</h1>
                <p className="text-gray-600 mt-1">Управление профилем и документами</p>
              </div>
            </div>

            {/* Profile Tabs */}
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Информация</span>
                </TabsTrigger>
                <TabsTrigger value="diploma" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Диплом</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Настройки</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                    <CardDescription>
                      Информация о профиле врача
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <p>Загрузка профиля...</p>
                      </div>
                    ) : doctorProfile ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Полное имя</label>
                            <p className="mt-1 text-sm text-gray-900">{doctorProfile.full_name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Специализация</label>
                            <p className="mt-1 text-sm text-gray-900">{doctorProfile.specialization}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Квалификация</label>
                            <p className="mt-1 text-sm text-gray-900">{doctorProfile.qualification || 'Не указана'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Опыт работы</label>
                            <p className="mt-1 text-sm text-gray-900">{doctorProfile.experience_years || 0} лет</p>
                          </div>
                        </div>
                        {doctorProfile.bio && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">О враче</label>
                            <p className="mt-1 text-sm text-gray-900">{doctorProfile.bio}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Профиль врача не найден</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Возможно, вам нужно создать профиль врача
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diploma">
                <DoctorDiplomaUpload />
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Настройки профиля</CardTitle>
                    <CardDescription>
                      Управление настройками профиля врача
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Настройки профиля
                        </h3>
                        <p className="text-gray-600">
                          Дополнительные настройки будут добавлены в следующих версиях
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DoctorProfile;
