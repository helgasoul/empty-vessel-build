
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoConferenceIntegrations from '@/components/medical/VideoConferenceIntegrations';
import CalendarIntegrations from '@/components/medical/CalendarIntegrations';
import BackButton from '@/components/ui/back-button';

const TelemedicineSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <BackButton fallbackPath="/medical-integrations" className="mb-4" />
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Настройки телемедицины
            </h1>
            <p className="text-gray-600">
              Управление интеграциями для проведения онлайн-консультаций
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Интеграции с видеоконференциями */}
          <Card>
            <CardHeader>
              <CardTitle>Видеоконференции</CardTitle>
              <CardDescription>
                Настройте интеграции с платформами для проведения видеоконсультаций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoConferenceIntegrations />
            </CardContent>
          </Card>

          {/* Интеграции с календарями */}
          <Card>
            <CardHeader>
              <CardTitle>Календарные интеграции</CardTitle>
              <CardDescription>
                Синхронизируйте расписание консультаций с внешними календарями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarIntegrations />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TelemedicineSettings;
