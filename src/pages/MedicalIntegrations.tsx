
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Video, Pill, Building, Settings, Stethoscope, CalendarDays, TestTube, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppointmentBooking from '@/components/medical/AppointmentBooking';
import MedicalRecords from '@/components/medical/MedicalRecords';
import TelemedicineConsultations from '@/components/medical/TelemedicineConsultations';
import PharmacyPartners from '@/components/medical/PharmacyPartners';
import MedicalProcedures from '@/components/medical/MedicalProcedures';
import DoctorConsultationBooking from '@/components/medical/DoctorConsultationBooking';
import MedicalCalendar from '@/components/medical/MedicalCalendar';
import LabIntegrations from '@/components/medical/LabIntegrations';
import PartnerMap from '@/components/medical/PartnerMap';

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
            onClick={() => navigate('/telemedicine-settings')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Настройки телемедицины
          </Button>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="consultations" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Консультации
            </TabsTrigger>
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
            <TabsTrigger value="labs" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Лаборатории
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Карта клиник
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <MedicalCalendar />
          </TabsContent>

          <TabsContent value="consultations">
            <DoctorConsultationBooking />
          </TabsContent>

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

          <TabsContent value="labs">
            <LabIntegrations />
          </TabsContent>

          <TabsContent value="map">
            <PartnerMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicalIntegrations;
