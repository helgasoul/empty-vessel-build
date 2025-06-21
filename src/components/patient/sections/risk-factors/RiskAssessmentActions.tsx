
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, FileText, Users, Calendar } from 'lucide-react';

interface RiskAssessmentActionsProps {
  onStartNewAssessment: () => void;
  onViewHistory: () => void;
  onBookConsultation: () => void;
  onShareWithFamily: () => void;
}

export default function RiskAssessmentActions({ 
  onStartNewAssessment,
  onViewHistory,
  onBookConsultation,
  onShareWithFamily
}: RiskAssessmentActionsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Действия с оценкой рисков</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            onClick={onStartNewAssessment}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Новая оценка
          </Button>
          
          <Button 
            variant="outline"
            onClick={onViewHistory}
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            История оценок
          </Button>
          
          <Button 
            variant="outline"
            onClick={onBookConsultation}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Записаться к врачу
          </Button>
          
          <Button 
            variant="outline"
            onClick={onShareWithFamily}
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <Users className="w-4 h-4 mr-2" />
            Поделиться с семьей
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
