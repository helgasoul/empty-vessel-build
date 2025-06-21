
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FertilityResult } from './fertilityCalculations';

interface FertilityResultsDisplayProps {
  result: FertilityResult;
}

export const FertilityResultsDisplay: React.FC<FertilityResultsDisplayProps> = ({ result }) => {
  const getFertilityColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'very_low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFertilityStatusText = (status: string) => {
    switch (status) {
      case 'high': return 'Высокая фертильность';
      case 'moderate': return 'Умеренная фертильность';
      case 'low': return 'Сниженная фертильность';
      case 'very_low': return 'Очень низкая фертильность';
      default: return 'Неопределенная фертильность';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span>Результаты расчета</span>
          <Badge className={getFertilityColor(result.fertilityStatus)}>
            {getFertilityStatusText(result.fertilityStatus)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Предполагаемая овуляция</p>
            <p className="text-lg font-bold">
              {format(result.ovulationDate, 'dd MMMM yyyy', { locale: ru })}
            </p>
            <p className="text-xs text-gray-600">
              {format(result.ovulationDate, 'EEEE', { locale: ru })}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Фертильное окно</p>
            <p className="text-sm font-semibold">
              {format(result.fertilityWindow.start, 'dd MMM', { locale: ru })} - {format(result.fertilityWindow.end, 'dd MMM yyyy', { locale: ru })}
            </p>
            <p className="text-xs text-gray-600">Оптимальное время для зачатия</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Вероятность зачатия</p>
            <p className="text-lg font-bold">{result.conception_probability.toFixed(1)}%</p>
            <p className="text-xs text-gray-600">В фертильном окне</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Оценка овариального резерва:</h4>
          <p className="text-sm text-gray-700">{result.amhInterpretation}</p>
          
          {result.fertilityStatus === 'low' || result.fertilityStatus === 'very_low' ? (
            <div className="mt-3 p-3 bg-orange-100 rounded-lg">
              <p className="text-sm text-orange-800 font-medium">Рекомендации:</p>
              <ul className="text-sm text-orange-700 mt-1 space-y-1">
                <li>• Консультация репродуктолога</li>
                <li>• Рассмотреть криоконсервацию ооцитов</li>
                <li>• Коэнзим Q10, фолиевая кислота</li>
                <li>• Контроль веса и стресса</li>
              </ul>
            </div>
          ) : (
            <div className="mt-3 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800 font-medium">Рекомендации:</p>
              <ul className="text-sm text-green-700 mt-1 space-y-1">
                <li>• Регулярное отслеживание цикла</li>
                <li>• Фолиевая кислота 400 мкг/день</li>
                <li>• Здоровый образ жизни</li>
                <li>• Контроль ежегодно</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
