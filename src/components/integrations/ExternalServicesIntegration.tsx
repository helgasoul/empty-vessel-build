
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, 
  Dumbbell, 
  Apple, 
  Heart, 
  ExternalLink,
  CheckCircle,
  Circle,
  Star,
  Package,
  Calendar,
  Utensils
} from "lucide-react";

interface ServiceIntegration {
  id: string;
  name: string;
  description: string;
  category: 'marketplace' | 'fitness' | 'nutrition';
  isConnected: boolean;
  icon: React.ReactNode;
  features: string[];
  recommendations?: any[];
}

const ExternalServicesIntegration = () => {
  const [services, setServices] = useState<ServiceIntegration[]>([
    {
      id: 'ozon-health',
      name: 'Озон • Здоровье',
      description: 'Товары для здоровья и красоты с персонализированными рекомендациями',
      category: 'marketplace',
      isConnected: false,
      icon: <ShoppingBag className="w-6 h-6" />,
      features: [
        'Витамины и БАДы по рекомендациям',
        'Спортивное питание',
        'Товары для женского здоровья',
        'Быстрая доставка'
      ],
      recommendations: [
        { name: 'Витамин D3', price: '890₽', rating: 4.8 },
        { name: 'Омега-3', price: '1290₽', rating: 4.9 },
        { name: 'Магний B6', price: '650₽', rating: 4.7 }
      ]
    },
    {
      id: 'yandex-lavka',
      name: 'Яндекс Лавка',
      description: 'Доставка здоровых продуктов и товаров для красоты за 15 минут',
      category: 'marketplace',
      isConnected: false,
      icon: <Package className="w-6 h-6" />,
      features: [
        'Органические продукты',
        'Здоровые снеки',
        'Товары для ухода',
        'Доставка за 15 минут'
      ]
    },
    {
      id: 'fitstars',
      name: 'FitStars',
      description: 'Персональные тренировки и программы от звездных тренеров',
      category: 'fitness',
      isConnected: true,
      icon: <Dumbbell className="w-6 h-6" />,
      features: [
        'Персональные программы',
        'Тренировки с тренерами',
        'Йога и растяжка',
        'Отслеживание прогресса'
      ]
    },
    {
      id: 'yoga-go',
      name: 'Yoga-Go',
      description: 'Йога для женщин с учетом менструального цикла',
      category: 'fitness',
      isConnected: false,
      icon: <Heart className="w-6 h-6" />,
      features: [
        'Программы по фазам цикла',
        'Медитации',
        'Дыхательные практики',
        'Гормональная йога'
      ]
    },
    {
      id: 'yazio',
      name: 'YAZIO',
      description: 'Счетчик калорий и планировщик питания',
      category: 'nutrition',
      isConnected: false,
      icon: <Apple className="w-6 h-6" />,
      features: [
        'Подсчет калорий',
        'Планы питания',
        'Рецепты',
        'Водный баланс'
      ]
    },
    {
      id: 'myfitnesspal',
      name: 'MyFitnessPal',
      description: 'Дневник питания с большой базой продуктов',
      category: 'nutrition',
      isConnected: true,
      icon: <Utensils className="w-6 h-6" />,
      features: [
        'База из 14М продуктов',
        'Макронутриенты',
        'Синхронизация с устройствами',
        'Сообщество'
      ]
    }
  ]);

  const handleConnect = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, isConnected: !service.isConnected }
        : service
    ));
  };

  const marketplaceServices = services.filter(s => s.category === 'marketplace');
  const fitnessServices = services.filter(s => s.category === 'fitness');
  const nutritionServices = services.filter(s => s.category === 'nutrition');

  const ServiceCard = ({ service }: { service: ServiceIntegration }) => (
    <Card className="prevent-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="prevent-icon-container bg-primary/10">
              {service.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-montserrat">{service.name}</CardTitle>
              <Badge variant={service.isConnected ? "default" : "secondary"} className="mt-1">
                {service.isConnected ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Подключено
                  </>
                ) : (
                  <>
                    <Circle className="w-3 h-3 mr-1" />
                    Не подключено
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription className="font-roboto">{service.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Возможности:</h4>
            <ul className="space-y-1">
              {service.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {service.recommendations && service.isConnected && (
            <div>
              <h4 className="font-medium mb-2">Рекомендации для вас:</h4>
              <div className="space-y-2">
                {service.recommendations.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-primary font-medium">{item.price}</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs ml-1">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={() => handleConnect(service.id)}
            className="w-full"
            variant={service.isConnected ? "outline" : "default"}
          >
            {service.isConnected ? 'Отключить' : 'Подключить'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-montserrat font-bold text-gray-900 dark:text-white mb-4">
          Интеграции с внешними сервисами
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-roboto">
          Подключите любимые сервисы для создания персональной экосистемы здоровья
        </p>
      </div>

      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace" className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Магазины</span>
          </TabsTrigger>
          <TabsTrigger value="fitness" className="flex items-center space-x-2">
            <Dumbbell className="w-4 h-4" />
            <span>Фитнес</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center space-x-2">
            <Apple className="w-4 h-4" />
            <span>Питание</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {marketplaceServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fitness" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {fitnessServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {nutritionServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExternalServicesIntegration;
