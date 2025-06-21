
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NutritionIntegration from '@/components/integrations/NutritionIntegration';
import FitnessIntegration from '@/components/integrations/FitnessIntegration';
import PharmacyIntegration from '@/components/integrations/PharmacyIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, Dumbbell, Pill, Sparkles } from 'lucide-react';
import BackButton from '@/components/ui/back-button';

const HealthServicesPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-montserrat text-text-primary mb-2">
            Сервисы здоровья
          </h1>
          <p className="text-text-secondary mb-4">
            Интегрированные сервисы питания, фитнеса и аптек для женского здоровья
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800">
              <Sparkles className="w-3 h-3 mr-1" />
              Адаптировано под менструальный цикл
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              Персонализированные рекомендации
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="nutrition" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nutrition" className="gap-2">
              <Apple className="w-4 h-4" />
              Питание
            </TabsTrigger>
            <TabsTrigger value="fitness" className="gap-2">
              <Dumbbell className="w-4 h-4" />
              Фитнес
            </TabsTrigger>
            <TabsTrigger value="pharmacy" className="gap-2">
              <Pill className="w-4 h-4" />
              Аптеки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nutrition">
            <NutritionIntegration />
          </TabsContent>

          <TabsContent value="fitness">
            <FitnessIntegration />
          </TabsContent>

          <TabsContent value="pharmacy">
            <PharmacyIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthServicesPage;
