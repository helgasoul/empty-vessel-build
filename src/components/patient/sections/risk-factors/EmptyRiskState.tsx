
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface EmptyRiskStateProps {
  onStartAssessment: () => void;
}

export default function EmptyRiskState({ onStartAssessment }: EmptyRiskStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Оценка рисков недоступна</h3>
        <p className="text-gray-600 mb-6">Заполните профиль здоровья для расчета персональных рисков</p>
        <Button 
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          onClick={onStartAssessment}
        >
          Начать оценку рисков
        </Button>
      </CardContent>
    </Card>
  );
}
