
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
  ExternalLink
} from "lucide-react";
import { usePharmacyPartners } from "@/hooks/usePharmacyPartners";

const PharmacyPartners = () => {
  const { partners, loading } = usePharmacyPartners();

  const formatWorkingHours = (hours?: Record<string, string>) => {
    if (!hours || Object.keys(hours).length === 0) return 'Часы работы не указаны';
    
    return Object.entries(hours).map(([days, time]) => (
      <div key={days} className="text-sm">
        <span className="font-medium">{days}:</span> {time}
      </div>
    ));
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
        {partners.map(partner => (
          <Card key={partner.id} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{partner.name}</CardTitle>
                {partner.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{partner.rating}</span>
                  </div>
                )}
              </div>
              {partner.delivery_available && (
                <Badge variant="secondary" className="w-fit">
                  <Truck className="w-3 h-3 mr-1" />
                  Доставка
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {partner.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
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
                <Button className="w-full">
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

      {partners.length === 0 && (
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
    </div>
  );
};

export default PharmacyPartners;
