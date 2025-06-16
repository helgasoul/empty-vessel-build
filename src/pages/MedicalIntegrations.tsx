import React from 'react';
import MedicalRecords from '@/components/medical/MedicalRecords';
import MedicalCalendar from '@/components/medical/MedicalCalendar';
import LabIntegrations from '@/components/medical/LabIntegrations';
import PharmacyPartners from '@/components/medical/PharmacyPartners';
import DoctorAccessTokens from '@/components/medical/DoctorAccessTokens';

const MedicalIntegrations = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Медицинские интеграции
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Подключите ваши медицинские записи и сервисы для получения полной картины вашего здоровья.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Управление медицинскими данными
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Здесь вы можете подключить и настроить интеграции с различными медицинскими сервисами.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <MedicalRecords />
              <MedicalCalendar />
            </div>
            
            <div className="space-y-6">
              <LabIntegrations />
              <PharmacyPartners />
            </div>
          </div>

          {/* Doctor Access Management Section */}
          <div className="mt-8">
            <DoctorAccessTokens />
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Другие интеграции
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Дополнительные возможности для интеграции с другими сервисами и устройствами.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicalIntegrations;
