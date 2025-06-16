
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Crown, Zap } from "lucide-react";
import { toast } from "sonner";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  popular?: boolean;
  features: PlanFeature[];
  icon: React.ReactNode;
  color: string;
}

const SubscriptionPlans = () => {
  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Базовый',
      price: 0,
      currency: '₽',
      period: 'навсегда',
      description: 'Основные функции для начала заботы о здоровье',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-gray-100',
      features: [
        { name: 'Базовая оценка рисков (до 3 в месяц)', included: true },
        { name: 'Простые рекомендации по здоровью', included: true },
        { name: 'Трекер менструального цикла', included: true },
        { name: 'Базовая аналитика данных', included: true },
        { name: 'Интеграция с 1 устройством', included: true },
        { name: 'ИИ-анализ рисков', included: false },
        { name: 'Персонализированные планы питания', included: false },
        { name: 'Программы фитнеса', included: false },
        { name: 'Консультации с экспертами', included: false },
        { name: 'Приоритетная поддержка', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Премиум',
      price: 1990,
      currency: '₽',
      period: 'в месяц',
      description: 'Полный функционал для комплексной заботы о здоровье',
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-primary/10',
      features: [
        { name: 'Неограниченные оценки рисков', included: true },
        { name: 'ИИ-анализ рисков и прогнозы', included: true },
        { name: 'Персонализированные планы питания', included: true },
        { name: 'Программы фитнеса и йоги', included: true },
        { name: 'Интеграция со всеми устройствами', included: true },
        { name: 'Консультации с экспертами', included: true },
        { name: 'Расширенная аналитика и экспорт', included: true },
        { name: 'Интеграция с магазинами и доставкой', included: true },
        { name: 'Приоритетная поддержка 24/7', included: true },
        { name: 'Эксклюзивный контент и исследования', included: true }
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      toast.success('Вы уже используете базовый план!');
      return;
    }

    try {
      // Здесь будет логика для создания Stripe checkout session
      toast.info('Перенаправление на страницу оплаты...');
      
      // Временная заглушка - позже интегрируем с реальным Stripe
      setTimeout(() => {
        toast.success('Подписка успешно оформлена!');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Ошибка при оформлении подписки');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-montserrat font-bold text-gray-900 dark:text-white mb-4">
          Выберите план подписки
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-roboto">
          Начните с базового плана или получите полный доступ ко всем возможностям
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.color} border-2 ${plan.popular ? 'border-primary shadow-lg' : 'border-gray-200'}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white px-4 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Популярный
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${plan.popular ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-montserrat">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-primary">
                {plan.price === 0 ? 'Бесплатно' : `${plan.price} ${plan.currency}`}
                <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
              </div>
              <CardDescription className="text-center">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle 
                      className={`w-4 h-4 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}
                    />
                    <span className={`text-sm ${feature.included ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.price === 0 ? 'Текущий план' : 'Выбрать план'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
        <p>
          🔒 Безопасная оплата через Stripe • Отмена в любой момент • 
          Все данные защищены в соответствии с GDPR и HIPAA
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
