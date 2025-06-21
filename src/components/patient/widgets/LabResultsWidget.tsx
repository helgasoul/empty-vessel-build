
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { LabResult } from '@/types/patient';

interface LabResultsWidgetProps {
  data?: LabResult[];
}

export default function LabResultsWidget({ data }: LabResultsWidgetProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-rose-100 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-rose-600">
          <FileText className="w-5 h-5" />
          Результаты анализов
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {data && data.length > 0 ? (
          <>
            <div className="space-y-3">
              {data.slice(0, 3).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium text-gray-800">{result.testType}</p>
                      <p className="text-sm text-gray-600">
                        {result.testDate.toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status === 'completed' ? 'Готов' : 
                     result.status === 'pending' ? 'В обработке' : 'Ожидание'}
                  </Badge>
                </div>
              ))}
            </div>
            
            {data.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                +{data.length - 3} анализов
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              У вас пока нет результатов анализов
            </p>
            <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
              Загрузить анализы →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
