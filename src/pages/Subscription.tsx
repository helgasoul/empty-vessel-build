
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus';
import { CreditCard, History, Settings } from "lucide-react";

const Subscription = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-montserrat font-bold text-gray-900 dark:text-white mb-4">
          Управление подпиской
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-roboto max-w-2xl mx-auto">
          Выберите план, который подходит именно вам, и получите полный доступ к возможностям YTime
        </p>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Статус</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Планы</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>История</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <SubscriptionStatus />
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>История платежей</span>
              </CardTitle>
              <CardDescription>
                Просмотрите историю ваших платежей и счетов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">История пуста</h3>
                <p className="text-gray-600">
                  Здесь будут отображаться ваши платежи после оформления подписки
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Subscription;
