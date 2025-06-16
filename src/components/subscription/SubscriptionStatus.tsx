
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Calendar, CreditCard, Users, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

const SubscriptionStatus = () => {
  const { user } = useAuth();
  const { subscription, loading, isSubscribed, isPremium, subscriptionEnd } = useSubscription();
  
  const handleUpgrade = () => {
    // Переключение на вкладку планов
    const plansTab = document.querySelector('[value="plans"]') as HTMLButtonElement;
    if (plansTab) {
      plansTab.click();
    }
  };

  const handleManageSubscription = () => {
    // Логика для управления подпиской через Stripe Customer Portal
    console.log('Opening Stripe Customer Portal...');
    // Здесь будет интеграция с Stripe Customer Portal
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Войдите в аккаунт</h3>
            <p className="text-gray-600 mb-4">
              Для просмотра статуса подписки необходимо войти в систему
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
            <p className="text-gray-600">Загрузка данных подписки...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isPremium ? (
              <Crown className="w-6 h-6 text-yellow-500" />
            ) : (
              <Star className="w-6 h-6 text-gray-400" />
            )}
            <div>
              <CardTitle className="text-xl">
                {isPremium ? 'Премиум план' : 'Базовый план'}
              </CardTitle>
              <CardDescription>
                {isPremium 
                  ? 'У вас есть доступ ко всем функциям' 
                  : 'Обновитесь для получения полного доступа'
                }
              </CardDescription>
            </div>
          </div>
          <Badge variant={isPremium ? 'default' : 'secondary'}>
            {isPremium ? 'Активна' : 'Бесплатно'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isPremium && subscriptionEnd ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm">Продление:</span>
              </div>
              <span className="text-sm font-medium">
                {subscriptionEnd.toLocaleDateString('ru-RU')}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Автоплатеж:</span>
              </div>
              <span className="text-sm font-medium">
                {subscription?.stripe_customer_id ? 'Включен' : 'Отключен'}
              </span>
            </div>

            <Button 
              onClick={handleManageSubscription}
              variant="outline" 
              className="w-full"
            >
              Управлять подпиской
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg">
              <h4 className="font-semibold mb-2">Преимущества Премиум плана:</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Неограниченные оценки рисков с ИИ-анализом</li>
                <li>• Персонализированные планы питания и фитнеса</li>
                <li>• Консультации с экспертами</li>
                <li>• Приоритетная поддержка 24/7</li>
              </ul>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Crown className="w-4 h-4 mr-2" />
              Обновить до Премиум
            </Button>
          </div>
        )}

        <div className="pt-3 border-t">
          <p className="text-xs text-gray-500 text-center">
            Безопасная оплата через Stripe • Отмена в любой момент
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
