
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Heart, 
  Activity, 
  Utensils, 
  Moon,
  Calendar,
  ArrowRight
} from 'lucide-react';

const Recommendations = () => {
  const recommendations = [
    {
      id: 1,
      category: 'Питание',
      icon: Utensils,
      title: 'Увеличьте потребление кальция',
      description: 'Рекомендуется увеличить потребление кальция до 1200 мг в день для поддержания здоровья костей.',
      priority: 'high' as const,
      actions: ['Добавить молочные продукты', 'Рассмотреть добавки кальция']
    },
    {
      id: 2,
      category: 'Физическая активность',
      icon: Activity,
      title: 'Силовые тренировки',
      description: 'Регулярные силовые упражнения помогут сохранить мышечную массу и плотность костей.',
      priority: 'medium' as const,
      actions: ['2-3 раза в неделю', 'Консультация с тренером']
    },
    {
      id: 3,
      category: 'Сон',
      icon: Moon,
      title: 'Улучшение качества сна',
      description: 'Создание комфортной среды для сна поможет справиться с ночными приливами.',
      priority: 'medium' as const,
      actions: ['Прохладная комната', 'Натуральное белье']
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'info';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-orange-600" />
            Персональные рекомендации
          </h1>
          <p className="text-gray-600">
            Индивидуальные советы на основе вашего профиля здоровья
          </p>
        </div>

        <div className="space-y-6">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <Card key={rec.id} className="border-orange-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{rec.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {rec.category}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' ? 'Высокий приоритет' : 
                       rec.priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{rec.description}</p>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900">Действия:</h4>
                    <ul className="space-y-1">
                      {rec.actions.map((action, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
