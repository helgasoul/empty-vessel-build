
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Pill, 
  ShoppingCart, 
  Clock,
  MapPin,
  Package,
  Zap,
  Calendar,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface Supplement {
  id: string;
  name: string;
  description: string;
  category: 'vitamins' | 'minerals' | 'hormonal' | 'prenatal' | 'menopause';
  cyclePhase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  benefits: string[];
  dosage: string;
  timing: string;
  price: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  pharmacy: string;
  pharmacyLogo: string;
  rating: number;
  reviews: number;
  womenHealthSpecific: boolean;
}

interface PharmacyPartner {
  id: string;
  name: string;
  logo: string;
  rating: number;
  deliveryTime: string;
  minOrderAmount: number;
  specialization: string[];
  womenHealthExpert: boolean;
}

const PharmacyIntegration = () => {
  const [activeTab, setActiveTab] = useState<'supplements' | 'pharmacy' | 'tracking'>('supplements');
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [currentCyclePhase] = useState<'follicular'>('follicular'); // Это будет приходить из контекста

  const pharmacyPartners: PharmacyPartner[] = [
    {
      id: '1',
      name: 'Аптека.ru',
      logo: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 4.8,
      deliveryTime: '2-4 часа',
      minOrderAmount: 500,
      specialization: ['женское здоровье', 'витамины', 'БАДы'],
      womenHealthExpert: true
    },
    {
      id: '2',
      name: 'Здравсити',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 4.6,
      deliveryTime: '1-3 часа',
      minOrderAmount: 300,
      specialization: ['гормональная поддержка', 'пренатальные витамины'],
      womenHealthExpert: true
    },
    {
      id: '3',
      name: 'Горздрав',
      logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 4.5,
      deliveryTime: '3-6 часов',
      minOrderAmount: 700,
      specialization: ['менопауза', 'фертильность', 'ПМС'],
      womenHealthExpert: true
    }
  ];

  const supplements: Supplement[] = [
    {
      id: '1',
      name: 'Фолиевая кислота + B12',
      description: 'Комплекс для фолликулярной фазы',
      category: 'vitamins',
      cyclePhase: 'follicular',
      benefits: ['Поддержка овуляции', 'Энергия', 'Настроение'],
      dosage: '1 капсула',
      timing: 'Утром с едой',
      price: 850,
      availability: 'in_stock',
      pharmacy: 'Аптека.ru',
      pharmacyLogo: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      rating: 4.7,
      reviews: 342,
      womenHealthSpecific: true
    },
    {
      id: '2',
      name: 'Магний B6 Форте',
      description: 'Для снижения ПМС и стресса',
      category: 'minerals',
      cyclePhase: 'luteal',
      benefits: ['Снижение ПМС', 'Качество сна', 'Стресс'],
      dosage: '2 таблетки',
      timing: 'Вечером',
      price: 650,
      availability: 'in_stock',
      pharmacy: 'Здравсити',
      pharmacyLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      rating: 4.8,
      reviews: 567,
      womenHealthSpecific: true
    },
    {
      id: '3',
      name: 'Железо + Витамин С',
      description: 'Для восстановления во время менструации',
      category: 'minerals',
      cyclePhase: 'menstrual',
      benefits: ['Восстановление железа', 'Энергия', 'Иммунитет'],
      dosage: '1 капсула',
      timing: 'С едой',
      price: 720,
      availability: 'low_stock',
      pharmacy: 'Горздрав',
      pharmacyLogo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      rating: 4.6,
      reviews: 289,
      womenHealthSpecific: true
    },
    {
      id: '4',
      name: 'Омега-3 для женщин',
      description: 'Поддержка гормонального баланса',
      category: 'hormonal',
      benefits: ['Гормональный баланс', 'Красота кожи', 'Сердце'],
      dosage: '2 капсулы',
      timing: 'Во время еды',
      price: 1200,
      availability: 'in_stock',
      pharmacy: 'Аптека.ru',
      pharmacyLogo: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      rating: 4.9,
      reviews: 1024,
      womenHealthSpecific: true
    },
    {
      id: '5',
      name: 'Пренатальный комплекс',
      description: 'Полный комплекс для планирующих беременность',
      category: 'prenatal',
      benefits: ['Подготовка к зачатию', 'Фолиевая кислота', 'ДГК'],
      dosage: '1 таблетка',
      timing: 'Утром',
      price: 1850,
      availability: 'in_stock',
      pharmacy: 'Здравсити',
      pharmacyLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      rating: 4.8,
      reviews: 456,
      womenHealthSpecific: true
    }
  ];

  const [currentOrders] = useState([
    {
      id: '1',
      items: ['Фолиевая кислота + B12', 'Омега-3 для женщин'],
      status: 'В доставке',
      estimatedDelivery: '14:30',
      total: 2050
    },
    {
      id: '2',
      items: ['Магний B6 Форте'],
      status: 'Готов к выдаче',
      pharmacy: 'Здравсити на Тверской',
      total: 650
    }
  ]);

  const getCyclePhaseSupplements = () => {
    return supplements.filter(supplement => 
      supplement.cyclePhase === currentCyclePhase || !supplement.cyclePhase
    );
  };

  const getAvailabilityBadge = (availability: string) => {
    const configs = {
      in_stock: { variant: 'default', label: 'В наличии', color: 'bg-green-100 text-green-800' },
      low_stock: { variant: 'secondary', label: 'Мало', color: 'bg-yellow-100 text-yellow-800' },
      out_of_stock: { variant: 'destructive', label: 'Нет в наличии', color: '' }
    } as const;
    
    const config = configs[availability as keyof typeof configs];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleAddToCart = (supplementId: string) => {
    setSelectedSupplements(prev => 
      prev.includes(supplementId) 
        ? prev.filter(id => id !== supplementId)
        : [...prev, supplementId]
    );
    
    const supplement = supplements.find(s => s.id === supplementId);
    if (supplement) {
      toast.success(`${supplement.name} добавлен в корзину`, {
        description: `Цена: ${supplement.price} ₽ • ${supplement.pharmacy}`
      });
    }
  };

  const handleOrderFromPharmacy = (pharmacyId: string) => {
    const pharmacy = pharmacyPartners.find(p => p.id === pharmacyId);
    if (pharmacy) {
      toast.success(`Переход в ${pharmacy.name}`, {
        description: `Доставка: ${pharmacy.deliveryTime} • Минимальный заказ: ${pharmacy.minOrderAmount} ₽`
      });
    }
  };

  const SupplementCard = ({ supplement }: { supplement: Supplement }) => (
    <Card className="prevent-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{supplement.name}</CardTitle>
            <CardDescription className="mt-1">
              {supplement.description}
            </CardDescription>
          </div>
          {supplement.womenHealthSpecific && (
            <Badge className="bg-pink-100 text-pink-800 ml-2">
              <Heart className="w-3 h-3 mr-1" />
              Для женщин
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <img 
            src={supplement.pharmacyLogo} 
            alt={supplement.pharmacy}
            className="w-8 h-8 rounded object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{supplement.pharmacy}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>★ {supplement.rating}</span>
              <span>• {supplement.reviews} отзывов</span>
            </div>
          </div>
          {getAvailabilityBadge(supplement.availability)}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {supplement.benefits.map((benefit, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {benefit}
              </Badge>
            ))}
          </div>
          
          {supplement.cyclePhase && (
            <div className="flex items-center text-sm text-purple-600">
              <Calendar className="w-4 h-4 mr-1" />
              Рекомендовано для {supplement.cyclePhase === 'follicular' ? 'фолликулярной' : supplement.cyclePhase} фазы
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <p><strong>Дозировка:</strong> {supplement.dosage}</p>
            <p><strong>Время приема:</strong> {supplement.timing}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xl font-bold text-primary">
            {supplement.price} ₽
          </div>
          <Button 
            onClick={() => handleAddToCart(supplement.id)}
            disabled={supplement.availability === 'out_of_stock'}
            variant={selectedSupplements.includes(supplement.id) ? "default" : "outline"}
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {selectedSupplements.includes(supplement.id) ? 'В корзине' : 'В корзину'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PharmacyCard = ({ pharmacy }: { pharmacy: PharmacyPartner }) => (
    <Card className="prevent-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <img 
            src={pharmacy.logo} 
            alt={pharmacy.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {pharmacy.name}
              {pharmacy.womenHealthExpert && (
                <Badge className="bg-pink-100 text-pink-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Эксперт
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <span>★ {pharmacy.rating}</span>
              <span className="ml-2">• Доставка: {pharmacy.deliveryTime}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm"><strong>Специализация:</strong></p>
          <div className="flex flex-wrap gap-1">
            {pharmacy.specialization.map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span>Минимальный заказ: {pharmacy.minOrderAmount} ₽</span>
          <div className="flex items-center text-green-600">
            <Clock className="w-4 h-4 mr-1" />
            {pharmacy.deliveryTime}
          </div>
        </div>

        <Button 
          onClick={() => handleOrderFromPharmacy(pharmacy.id)}
          className="w-full gap-2"
        >
          <MapPin className="w-4 h-4" />
          Перейти в аптеку
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="prevent-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-montserrat">
            <Pill className="w-5 h-5 text-primary" />
            <span>Аптечные интеграции</span>
          </CardTitle>
          <CardDescription className="font-roboto">
            Заказывайте витамины и БАДы для женского здоровья с учетом фазы цикла
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <Button
              variant={activeTab === 'supplements' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('supplements')}
              className="flex-1"
            >
              <Pill className="w-4 h-4 mr-2" />
              Витамины и БАДы
            </Button>
            <Button
              variant={activeTab === 'pharmacy' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('pharmacy')}
              className="flex-1"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Аптеки-партнеры
            </Button>
            <Button
              variant={activeTab === 'tracking' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('tracking')}
              className="flex-1"
            >
              <Package className="w-4 h-4 mr-2" />
              Мои заказы
            </Button>
          </div>

          {activeTab === 'supplements' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-montserrat font-semibold">
                  Рекомендации для фолликулярной фазы
                </h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Zap className="w-3 h-3 mr-1" />
                  Подобрано ИИ
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCyclePhaseSupplements().map(supplement => (
                  <SupplementCard key={supplement.id} supplement={supplement} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pharmacy' && (
            <div>
              <h3 className="text-lg font-montserrat font-semibold mb-4">
                Аптеки-партнеры со специализацией по женскому здоровью
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pharmacyPartners.map(pharmacy => (
                  <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div>
              <h3 className="text-lg font-montserrat font-semibold mb-4">
                Текущие заказы
              </h3>
              <div className="space-y-4">
                {currentOrders.map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Заказ #{order.id}</h4>
                          <p className="text-sm text-gray-600">
                            {order.items.join(', ')}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <Badge>{order.status}</Badge>
                            {order.estimatedDelivery && (
                              <span className="text-green-600">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Доставка до {order.estimatedDelivery}
                              </span>
                            )}
                            {order.pharmacy && (
                              <span className="text-blue-600">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                {order.pharmacy}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{order.total} ₽</div>
                          <Button variant="outline" size="sm">
                            Отследить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyIntegration;
