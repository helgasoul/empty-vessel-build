
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, Clock, X, Star, Filter, Search } from 'lucide-react';
import { AIRecommendation } from '@/types/patient';

interface AIRecommendationsSectionProps {
  data: AIRecommendation[];
  onAction: (recommendationId: string, action: 'acknowledge' | 'implement' | 'dismiss') => void;
}

export default function AIRecommendationsSection({ data, onAction }: AIRecommendationsSectionProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'medical': return 'text-blue-600 bg-blue-100';
      case 'lifestyle': return 'text-green-600 bg-green-100';
      case 'preventive': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'urgent': return 'Срочно';
      case 'medical': return 'Медицинская';
      case 'lifestyle': return 'Образ жизни';
      case 'preventive': return 'Профилактика';
      default: return 'Общая';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'acknowledged': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'dismissed': return <X className="w-4 h-4 text-gray-500" />;
      default: return <Star className="w-4 h-4 text-blue-500" />;
    }
  };

  const filteredRecommendations = data.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || rec.status === filter || rec.type === filter || rec.priority === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Рекомендации ИИ</h2>
        <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
          <Brain className="w-4 h-4 mr-2" />
          Обновить рекомендации
        </Button>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск рекомендаций..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Все рекомендации</option>
                <option value="new">Новые</option>
                <option value="acknowledged">Принятые</option>
                <option value="implemented">Выполненные</option>
                <option value="critical">Критичные</option>
                <option value="urgent">Срочные</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Рекомендации */}
      {filteredRecommendations.length > 0 ? (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className={`hover:shadow-lg transition-shadow ${
              recommendation.priority === 'critical' ? 'border-red-200 bg-red-50/50' :
              recommendation.priority === 'high' ? 'border-orange-200 bg-orange-50/50' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(recommendation.status)}
                    <div>
                      <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {getPriorityText(recommendation.priority)}
                        </Badge>
                        <Badge className={getTypeColor(recommendation.type)}>
                          {getTypeText(recommendation.type)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Уверенность: {recommendation.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {recommendation.generatedAt.toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">{recommendation.description}</p>
                  
                  {recommendation.actionItems.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Действия к выполнению:</h4>
                      <ul className="space-y-1">
                        {recommendation.actionItems.map((action, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendation.basedOn.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Основано на:</h4>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.basedOn.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendation.status === 'new' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => onAction(recommendation.id, 'implement')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Выполнить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onAction(recommendation.id, 'acknowledge')}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Принять к сведению
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onAction(recommendation.id, 'dismiss')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Отклонить
                      </Button>
                    </div>
                  )}

                  {recommendation.feedback && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">Ваш отзыв:</h4>
                      <p className="text-sm text-gray-600">{recommendation.feedback}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {data.length === 0 ? 'Нет рекомендаций' : 'Рекомендации не найдены'}
            </h3>
            <p className="text-gray-600 mb-6">
              {data.length === 0 
                ? 'ИИ анализирует ваши данные для создания персонализированных рекомендаций'
                : 'Попробуйте изменить параметры поиска или фильтры'
              }
            </p>
            {data.length === 0 && (
              <Button 
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                onClick={() => console.log('Generate recommendations')}
              >
                <Brain className="w-4 h-4 mr-2" />
                Сгенерировать рекомендации
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {data.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Всего рекомендаций: {data.length}</span>
              <span>
                Новых: {data.filter(r => r.status === 'new').length} • 
                Выполненных: {data.filter(r => r.status === 'implemented').length}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
