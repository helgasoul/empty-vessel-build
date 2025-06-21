
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { AIRecommendation } from '@/types/patient';

interface AIRecommendationsWidgetProps {
  data?: AIRecommendation[];
}

export default function AIRecommendationsWidget({ data }: AIRecommendationsWidgetProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high': return <Star className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Критично';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      default: return 'Низкий';
    }
  };

  const newRecommendations = data?.filter(rec => rec.status === 'new') || [];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-rose-100 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-rose-600">
          <Brain className="w-5 h-5" />
          Рекомендации ИИ
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {newRecommendations.length > 0 ? (
          <>
            <div className="space-y-3">
              {newRecommendations.slice(0, 3).map((recommendation) => (
                <div key={recommendation.id} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    {getPriorityIcon(recommendation.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-800 text-sm">{recommendation.title}</p>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {getPriorityText(recommendation.priority)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {newRecommendations.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                +{newRecommendations.length - 3} рекомендаций
              </p>
            )}

            <div className="text-center">
              <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
                Посмотреть все →
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Нет новых рекомендаций
            </p>
            <p className="text-xs text-gray-500">
              Рекомендации появятся после анализа ваших данных
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
