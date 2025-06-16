
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Video, Pill, Building, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppointmentBooking from '@/components/medical/AppointmentBooking';
import MedicalRecords from '@/components/medical/MedicalRecords';
import TelemedicineConsultations from '@/components/medical/TelemedicineConsultations';
import PharmacyPartners from '@/components/medical/PharmacyPartners';
import MedicalProcedures from '@/components/medical/MedicalProcedures';

const MedicalIntegrations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Медицинские интеграции
            </h1>
            <p className="text-gray-600">
              Управляйте вашими медицинскими записями, консультациями и процедурами
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/telemedicine-integrations')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Настройки телемедицины
          </Button>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Записи
            </TabsTrigger>
            <TabsTrigger value="telemedicine" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Телемедицина
            </TabsTrigger>
            <TabsTrigger value="procedures" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Процедуры
            </TabsTrigger>
            <TabsTrigger value="pharmacy" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Аптеки
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Медкарта
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentBooking />
          </TabsContent>

          <TabsContent value="telemedicine">
            <TelemedicineConsultations />
          </TabsContent>

          <TabsContent value="procedures">
            <MedicalProcedures />
          </TabsContent>

          <TabsContent value="pharmacy">
            <PharmacyPartners />
          </TabsContent>

          <TabsContent value="records">
            <MedicalRecords />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicalIntegrations;
