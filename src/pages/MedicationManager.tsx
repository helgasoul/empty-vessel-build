
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pill } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import MedicationReminders from '@/components/health/MedicationReminders';

const MedicationManager = () => {
  const navigate = useNavigate();

  console.log('MedicationManager компонент загружен'); // Для отладки

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад в панель</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Pill className="w-6 h-6 text-purple-600" />
              <span>Управление лекарствами</span>
            </CardTitle>
            <CardDescription>
              Отслеживайте прием лекарств и настраивайте напоминания
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MedicationReminders />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicationManager;
