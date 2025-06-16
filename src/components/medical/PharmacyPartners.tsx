
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Truck,
  Star,
  ExternalLink,
  Leaf
} from "lucide-react";
import { usePharmacyPartners } from "@/hooks/usePharmacyPartners";

const PharmacyPartners = () => {
  const { partners, loading } = usePharmacyPartners();

  // Временные партнеры до полной интеграции
  const staticPartners = [
    {
      id: 'ecoherbs-1',
      name: 'EcoHerbs',
      address: 'ул. Эко, 12, Москва',
      phone: '+7 (495) 555-01-23',
      email: 'info@ecoherbs.ru',
      website: 'https://ecoherbs.ru',
      delivery_available: true,
      working_hours: {
        'пн-пт': '9:00-21:00',
        'сб-вс': '10:00-20:00'
      },
      delivery_zones: ['Центральный АО', 'Северный АО', 'Западный АО'],
      is_active: true,
      rating: 4.9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      specialty: 'Натуральные препараты и травы'
    },
    {
      id: '366-apteka',
      name: '36.6 Аптека',
      address: 'пр-т Мира, 45, Москва',
      phone: '+7 (495) 234-56-78',
      website: 'https://366.ru',
      delivery_available: true,
      working_hours: {
        'пн-пт': '8:00-22:00',
        'сб-вс': '9:00-21:00'
      },
      delivery_zones: ['Центральный АО', 'Восточный АО'],
      is_active: true,
      rating: 4.6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rigla-apteka',
      name: 'Аптека Ригла',
      address: 'ул. Тверская, 15, Москва',
      phone: '+7 (495) 123-45-67',
      website: 'https://rigla.ru',
      delivery_available: true,
      working_hours: {
        'пн-вс': '24/7'
      },
      delivery_zones: ['Центральный АО', 'Северный АО'],
      is_active: true,
      rating: 4.7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const formatWorkingHours = (hours?: Record<string, string>) => {
    if (!hours || Object.keys(hours).length === 0) return 'Часы работы не указаны';
    
    return Object.entries(hours).map(([days, time]) => (
      <div key={days} className="text-sm">
        <span className="font-medium">{days}:</span> {time}
      </div>
    ));
  };

  const handleOrderRedirect = (partner: any) => {
    if (partner.website) {
      window.open(partner.website, '_blank', 'noopener,noreferrer');
    }
  };

  const getPartnerIcon = (partnerName: string) => {
    if (partnerName.toLowerCase().includes('ecoherbs')) {
      return <Leaf className="w-5 h-5 text-green-600" />;
    }
    return <Truck className="w-5 h-5 text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Truck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Загрузка аптек-партнеров...</p>
        </div>
      </div>
    );
  }

  // Объединяем партнеров из базы данных со статическими
  const allPartners = [...staticPartners, ...partners];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Аптеки-партнеры
        </h2>
        <p className="text-gray-600">
          Заказывайте лекарства в проверенных аптеках с доставкой
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPartners.map(partner => (
          <Card key={partner.id} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getPartnerIcon(partner.name)}
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                </div>
                {partner.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{partner.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {partner.delivery_available && (
                  <Badge variant="secondary" className="w-fit">
                    <Truck className="w-3 h-3 mr-1" />
                    Доставка
                  </Badge>
                )}
                {partner.specialty && (
                  <Badge variant="outline" className="w-fit text-green-700 border-green-300">
                    {partner.specialty}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {partner.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{partner.address}</span>
                </div>
              )}

              {partner.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a 
                    href={`tel:${partner.phone}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {partner.phone}
                  </a>
                </div>
              )}

              {partner.working_hours && (
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    {formatWorkingHours(partner.working_hours)}
                  </div>
                </div>
              )}

              {partner.delivery_zones && partner.delivery_zones.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Зоны доставки:</h4>
                  <div className="flex flex-wrap gap-1">
                    {partner.delivery_zones.map((zone, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {zone}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  className="w-full"
                  onClick={() => handleOrderRedirect(partner)}
                  disabled={!partner.website}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Заказать лекарства
                </Button>
                
                {partner.website && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(partner.website, '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Сайт аптеки</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {allPartners.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Аптеки не найдены</h3>
            <p className="text-gray-600">
              В данный момент нет доступных аптек-партнеров в вашем регионе
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Временное перенаправление</h4>
            <p className="text-sm text-blue-700">
              До завершения интеграции вы будете перенаправлены на сайт партнера для оформления заказа. 
              В будущем заказ будет оформляться прямо в нашем приложении.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyPartners;
