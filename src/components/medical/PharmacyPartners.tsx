import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Building,
  Star,
  ExternalLink,
  Calendar
} from "lucide-react";
import { usePharmacyPartners } from "@/hooks/usePharmacyPartners";

const PharmacyPartners = () => {
  const { partners, loading } = usePharmacyPartners();

  // Обновленные клиники-партнеры
  const staticPartners = [
    {
      id: 'chaika-clinic',
      name: 'Клиника Чайка',
      address: 'Литовский бульвар, 1А, Москва',
      phone: '+7 (495) 104-80-03',
      website: 'https://chaika.com',
      delivery_available: false,
      working_hours: {
        'пн-пт': '8:00-21:00',
        'сб-вс': '9:00-20:00'
      },
      delivery_zones: [],
      is_active: true,
      rating: 4.8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      specialty: 'Многопрофильная клиника'
    },
    {
      id: 'ilinskaya-hospital',
      name: 'Ильинская больница',
      address: 'пос. Отрадное, ул. Красногорская, д. 15, стр. 1',
      phone: '+7 (495) 620-84-30',
      website: 'https://ilinskaya-hospital.ru',
      delivery_available: false,
      working_hours: {
        'пн-вс': '24/7'
      },
      delivery_zones: [],
      is_active: true,
      rating: 4.9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      specialty: 'Многопрофильная больница'
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

  const handleAppointmentRedirect = (partner: any) => {
    if (partner.website) {
      window.open(partner.website, '_blank', 'noopener,noreferrer');
    }
  };

  const getPartnerIcon = (partnerName: string) => {
    return <Building className="w-5 h-5 text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Загрузка клиник-партнеров...</p>
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
          Клиники-партнеры
        </h2>
        <p className="text-gray-600">
          Записывайтесь на прием в проверенные медицинские учреждения
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
                <Badge variant="secondary" className="w-fit">
                  <Calendar className="w-3 h-3 mr-1" />
                  Запись на прием
                </Badge>
                {partner.specialty && (
                  <Badge variant="outline" className="w-fit text-blue-700 border-blue-300">
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

              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  className="w-full"
                  onClick={() => handleAppointmentRedirect(partner)}
                  disabled={!partner.website}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Записаться на прием
                </Button>
                
                {partner.website && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(partner.website, '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Сайт клиники</span>
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
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Клиники не найдены</h3>
            <p className="text-gray-600">
              В данный момент нет доступных клиник-партнеров в вашем регионе
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Переход на сайт клиники</h4>
            <p className="text-sm text-blue-700">
              При нажатии на кнопку "Записаться на прием" вы будете перенаправлены на официальный сайт клиники 
              для записи на консультацию к врачу.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyPartners;
