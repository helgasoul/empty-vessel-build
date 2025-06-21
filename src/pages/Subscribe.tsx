
import React from 'react';
import BackButton from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Button, Badge } from '@/design-system/components';

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-h1 text-text-primary mb-4">
            Выберите свой план
          </h1>
          <p className="text-body-large text-text-secondary max-w-2xl mx-auto">
            Получите доступ к полному спектру функций превентивной медицины
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-background-secondary border-border-light hover:shadow-lg transition-all duration-300 animate-slide-up ${
                plan.popular ? 'border-coral-300 shadow-lg scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="ovulation" size="md">
                    Популярный
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-h2 text-text-primary">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-h1 font-bold text-text-primary">{plan.price}</span>
                  <span className="text-text-secondary ml-1">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-status-success mr-3" />
                      <span className="text-body text-text-primary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.popular ? 'primary' : 'tertiary'}
                  size="lg"
                  fullWidth
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
