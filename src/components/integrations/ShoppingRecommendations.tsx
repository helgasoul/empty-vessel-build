
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Star, 
  ExternalLink, 
  Heart,
  Package,
  Truck,
  Gift
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  benefits: string[];
  inStock: boolean;
  fastDelivery: boolean;
  recommendation_reason: string;
  partner_url?: string;
  partner_name?: string;
  direct_product_url?: string;
}

const ShoppingRecommendations = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const recommendations: Product[] = [
    {
      id: '1',
      name: 'Витамин D3 2000 МЕ',
      description: 'Поддержка иммунитета и здоровья костей',
      price: 890,
      oldPrice: 1200,
      rating: 4.8,
      reviews: 2547,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      category: 'Витамины',
      benefits: ['Поддержка иммунитета', 'Здоровье костей', 'Энергия'],
      inStock: true,
      fastDelivery: true,
      recommendation_reason: 'Рекомендовано на основе вашего анализа крови',
      partner_url: 'https://www.ozon.ru/category/vitaminy-10738/',
      partner_name: 'Ozon',
      direct_product_url: 'https://www.ozon.ru/product/vitamin-d3-2000-me-natures-bounty-150-kapsul-486847234/'
    },
    {
      id: '2',
      name: 'Омега-3 EPA/DHA',
      description: 'Премиум качество из Норвегии',
      price: 1290,
      rating: 4.9,
      reviews: 1834,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      category: 'Добавки',
      benefits: ['Здоровье сердца', 'Когнитивные функции', 'Красота кожи'],
      inStock: true,
      fastDelivery: false,
      recommendation_reason: 'Подходит для вашего плана питания',
      partner_url: 'https://market.yandex.ru/search?text=омега%203',
      partner_name: 'Яндекс Маркет',
      direct_product_url: 'https://market.yandex.ru/product--omega-3-epa-dha-norvezhskij/1725036517'
    },
    {
      id: '3',
      name: 'Протеиновый батончик',
      description: 'Без сахара, с орехами и ягодами',
      price: 150,
      rating: 4.6,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1571197142080-490a78e5bb7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      category: 'Снеки',
      benefits: ['20г белка', 'Без сахара', 'Натуральные ингредиенты'],
      inStock: true,
      fastDelivery: true,
      recommendation_reason: 'Идеально для ваших тренировок',
      partner_url: 'https://www.wildberries.ru/catalog/pitanie/sportivnoe-pitanie',
      partner_name: 'Wildberries',
      direct_product_url: 'https://www.wildberries.ru/catalog/103515226/detail.aspx'
    },
    {
      id: '4',
      name: 'Зеленый чай Матча',
      description: 'Органический порошок премиум класса',
      price: 2100,
      oldPrice: 2500,
      rating: 4.7,
      reviews: 654,
      image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      category: 'Напитки',
      benefits: ['Антиоксиданты', 'Энергия', 'Метаболизм'],
      inStock: false,
      fastDelivery: false,
      recommendation_reason: 'Поможет с детоксом организма',
      partner_url: 'https://www.ozon.ru/category/chaj-10792/',
      partner_name: 'Ozon',
      direct_product_url: 'https://www.ozon.ru/product/zelenyy-chay-matcha-organicheskiy-poroshok-premium-100g-758291653/'
    }
  ];

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Исправленный обработчик для перехода к товару
  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error(`Товар "${product.name}" сейчас недоступен`);
      return;
    }

    // Определяем целевую ссылку
    const targetUrl = product.direct_product_url || product.partner_url;

    if (!targetUrl) {
      toast.error('Ссылка на товар недоступна');
      return;
    }

    // Логируем для отладки
    console.log('Переход к товару:', {
      productName: product.name,
      directUrl: product.direct_product_url,
      partnerUrl: product.partner_url,
      targetUrl: targetUrl
    });

    try {
      // Показываем уведомление
      if (product.direct_product_url) {
        toast.success(`Переходим к товару "${product.name}"`, {
          description: `Открываем страницу товара на ${product.partner_name}`,
          duration: 3000
        });
      } else {
        toast.info(`Переходим к разделу на ${product.partner_name}`, {
          description: `Ищите "${product.name}" в категории ${product.category}`,
          duration: 3000
        });
      }
      
      // Принудительно открываем ссылку в новой вкладке
      const newWindow = window.open(targetUrl, '_blank');
      
      // Проверяем, удалось ли открыть окно
      if (!newWindow) {
        toast.error('Не удалось открыть ссылку. Проверьте настройки блокировщика всплывающих окон.');
        // Альтернативный способ - присвоение location.href
        window.location.href = targetUrl;
      } else {
        // Фокус на новом окне
        newWindow.focus();
      }
    } catch (error) {
      console.error('Ошибка при открытии ссылки:', error);
      toast.error('Ошибка при переходе к товару');
      
      // Запасной вариант - прямое присвоение
      try {
        window.location.href = targetUrl;
      } catch (fallbackError) {
        console.error('Ошибка запасного варианта:', fallbackError);
      }
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="prevent-card h-full">
      <CardHeader className="p-4">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart 
              className={`w-4 h-4 ${
                favorites.includes(product.id) 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-600'
              }`} 
            />
          </Button>
          {product.oldPrice && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              <Gift className="w-3 h-3 mr-1" />
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </Badge>
          )}
          {product.direct_product_url && (
            <Badge className="absolute bottom-2 left-2 bg-green-500 text-xs">
              Прямая ссылка
            </Badge>
          )}
        </div>

        <div>
          <Badge variant="secondary" className="mb-2">
            {product.category}
          </Badge>
          <CardTitle className="text-lg font-montserrat line-clamp-2">
            {product.name}
          </CardTitle>
          <CardDescription className="font-roboto text-sm">
            {product.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="text-xs text-primary bg-primary/10 p-2 rounded">
            💡 {product.recommendation_reason}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>
            <div className="flex items-center space-x-2">
              {product.fastDelivery && (
                <Badge variant="outline" className="text-xs">
                  <Truck className="w-3 h-3 mr-1" />
                  Быстро
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="destructive" className="text-xs">
                  Нет в наличии
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-medium text-sm">Преимущества:</h4>
            <div className="flex flex-wrap gap-1">
              {product.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary">
                  {product.price}₽
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.oldPrice}₽
                  </span>
                )}
              </div>
              {product.partner_name && (
                <div className="text-xs text-gray-500 mt-1">
                  Партнер: {product.partner_name}
                </div>
              )}
            </div>
            <Button 
              size="sm" 
              disabled={!product.inStock}
              className="flex items-center space-x-1"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>В корзину</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="prevent-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 font-montserrat">
          <Package className="w-5 h-5 text-primary" />
          <span>Рекомендации товаров</span>
        </CardTitle>
        <CardDescription className="font-roboto">
          Персонализированные рекомендации на основе ваших данных о здоровье
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingRecommendations;
