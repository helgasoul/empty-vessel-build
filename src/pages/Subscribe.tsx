
import React from 'react';
import BackButton from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Subscribe = () => {
  const plans = [
    {
      name: 'Базовый',
      price: '0₽',
      period: 'бесплатно',
      features: [
        'Базовая оценка рисков',
        'Хранение до 10 документов',
        'Основные рекомендации'
      ]
    },
    {
      name: 'Профессиональный',
      price: '999₽',
      period: 'в месяц',
      features: [
        'Расширенная оценка рисков',
        'Неограниченное хранение документов',
        'ИИ-анализ данных',
        'Персонализированные рекомендации',
        'Интеграция с устройствами'
      ],
      popular: true
    },
    {
      name: 'Премиум',
      price: '1999₽',
      period: 'в месяц',
      features: [
        'Все функции Профессионального',
        'Консультации с экспертами',
        'Семейная история здоровья',
        'Приоритетная поддержка',
        'Экспорт данных для врачей'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Выберите свой план
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Получите доступ к полному спектру функций превентивной медицины
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Популярный
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.price === '0₽' ? 'Текущий план' : 'Выбрать план'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
