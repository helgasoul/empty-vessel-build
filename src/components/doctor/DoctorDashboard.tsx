
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Users, Activity, Brain, Heart, TestTube, Calendar, AlertTriangle } from "lucide-react";
import { useMyDoctorProfile } from '@/hooks/useDoctorProfiles';
import { useAuth } from '@/contexts/AuthContext';
import MedicalCalculatorsModule from './calculators/MedicalCalculatorsModule';
import PatientRiskOverview from './PatientRiskOverview';
import DoctorQuickActions from './DoctorQuickActions';
import RiskStratificationModule from './risk-stratification/RiskStratificationModule';
import BehaviorMonitoringModule from './behavior-monitoring/BehaviorMonitoringModule';
import MentalHealthModule from './mental-health/MentalHealthModule';
import ScheduleModule from './schedule/ScheduleModule';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { data: doctorProfile, isLoading } = useMyDoctorProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Calculator className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-500" />
          <p>Загрузка панели врача...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок панели */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Панель врача превентивной медицины
          </h1>
          <p className="text-gray-600">
            {doctorProfile?.full_name} • {doctorProfile?.specialization}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">ID врача:</span>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {user?.id.slice(-8)}
          </span>
        </div>
      </div>

      {/* Быстрые действия */}
      <DoctorQuickActions />

      {/* Основные модули */}
      <Tabs defaultValue="calculators" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="calculators" className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>Калькуляторы</span>
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Пациенты</span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Риски</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Мониторинг</span>
          </TabsTrigger>
          <TabsTrigger value="mental-health" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Психоздоровье</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Расписание</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculators">
          <MedicalCalculatorsModule />
        </TabsContent>

        <TabsContent value="patients">
          <PatientRiskOverview />
        </TabsContent>

        <TabsContent value="risks">
          <RiskStratificationModule />
        </TabsContent>

        <TabsContent value="monitoring">
          <BehaviorMonitoringModule />
        </TabsContent>

        <TabsContent value="mental-health">
          <MentalHealthModule />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleModule />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
