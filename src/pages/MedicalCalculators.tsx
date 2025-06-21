
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsDoctor } from '@/hooks/useUserRoles';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Stethoscope } from "lucide-react";
import MedicalCalculatorsModule from '@/components/doctor/calculators/MedicalCalculatorsModule';

const MedicalCalculators = () => {
  return (
    <ProtectedRoute 
      requiredRole="doctor"
      errorTitle="Доступ только для врачей"
      errorMessage="У вас нет прав врача для доступа к медицинским калькуляторам. Обратитесь к администратору для назначения роли врача."
    >
      <div className="min-h-screen bg-gradient-to-br from-feminine-lavender-50 to-feminine-pink-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-feminine-lavender-200 rounded-full">
                <Calculator className="w-8 h-8 text-feminine-lavender-600" />
              </div>
              <div className="p-3 bg-feminine-pink-200 rounded-full">
                <Stethoscope className="w-8 h-8 text-feminine-pink-600" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-2 font-montserrat">
              Калькуляторы и лабораторные индексы
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-roboto">
              Интерактивные медицинские калькуляторы для анализа лабораторных исследований 
              и клинической интерпретации в области превентивной медицины
            </p>
          </div>

          {/* Disclaimer */}
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center mt-0.5">
                  <span className="text-amber-800 text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Медицинский дисклеймер</h3>
                  <p className="text-amber-700 text-sm">
                    Данные калькуляторы предназначены для вспомогательной оценки лабораторных показателей. 
                    Результаты требуют клинической корреляции и профессиональной интерпретации. 
                    Не заменяют клиническое суждение врача и не должны использоваться как единственное основание для диагностики.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Calculator Module */}
          <MedicalCalculatorsModule />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MedicalCalculators;
