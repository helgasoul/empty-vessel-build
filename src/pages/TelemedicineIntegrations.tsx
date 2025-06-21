
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoConferenceIntegrations from '@/components/medical/VideoConferenceIntegrations';
import CalendarIntegrations from '@/components/medical/CalendarIntegrations';
import BackButton from '@/components/ui/back-button';

const TelemedicineIntegrations = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton fallbackPath="/medical-integrations" variant="ghost" size="icon" className="hover:bg-primary/10">
                <span className="sr-only">Назад</span>
              </BackButton>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Интеграции телемедицины
                </h1>
                <p className="text-xs md:text-sm text-gray-600">
                  Настройте подключения к платформам видеоконференций и календарям
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={signOut}
                className="hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Tabs defaultValue="video" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Видеоконференции
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Календари
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <VideoConferenceIntegrations />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarIntegrations />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TelemedicineIntegrations;
