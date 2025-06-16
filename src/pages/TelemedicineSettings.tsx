
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import VideoConferenceIntegrations from '@/components/medical/VideoConferenceIntegrations';
import CalendarIntegrations from '@/components/medical/CalendarIntegrations';

const TelemedicineSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/medical-integrations')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
          
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
