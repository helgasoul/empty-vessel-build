
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import MedicalCalendar from '@/components/medical/MedicalCalendar';

const MedicalCalendarPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
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

        <MedicalCalendar />
      </div>
    </div>
  );
};

export default MedicalCalendarPage;
