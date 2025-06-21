
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft, MapPin, Phone, Globe, Star, Heart } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Partners = () => {
  const navigate = useNavigate();

  const partners = [
    {
      name: 'Медицинский центр "Здоровье+"',
      type: 'Многопрофильная клиника',
      location: 'Москва, ул. Тверская, 15',
      rating: 4.8,
      services: ['Гинекология', 'Кардиология', 'Эндокринология', 'Лабораторная диагностика'],
      specialties: 'Женское здоровье, профилактическая медицина',
      phone: '+7 (495) 123-45-67',
      website: 'zdravplus.ru'
    },
    {
      name: 'Лаборатория "ДНК-Диагностика"',
      type: 'Генетическая лаборатория',
      location: 'Санкт-Петербург, Невский пр., 82',
      rating: 4.9,
      services: ['Генетические тесты', 'Молекулярная диагностика', 'Фармакогенетика'],
      specialties: 'Наследственные заболевания, персонализированная медицина',
      phone: '+7 (812) 987-65-43',
      website: 'dna-lab.ru'
    },
    {
      name: 'Центр репродуктивного здоровья "Мать и дитя"',
      type: 'Специализированная клиника',
      location: 'Екатеринбург, ул. Ленина, 35',
      rating: 4.7,
      services: ['Планирование беременности', 'ЭКО', 'Гинекология', 'Андрология'],
      specialties: 'Репродуктивная медицина, бесплодие',
      phone: '+7 (343) 555-12-34',
      website: 'mother-child.ru'
    }
  ];

  const partnerTypes = [
    {
      type: 'Медицинские центры',
      count: 45,
      description: 'Многопрофильные клиники для комплексного обследования',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      type: 'Лаборатории',
      count: 28,
      description: 'Современные лаборатории для точной диагностики',
      icon: Heart,
      color: 'bg-green-500'
    },
    {
      type: 'Генетические центры',
      count: 12,
      description: 'Специализированные центры генетических исследований',
      icon: Building2,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Партнеры платформы PREVENT
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Сеть проверенных медицинских центров, лабораторий и клиник, с которыми мы сотрудничаем для обеспечения качественной медицинской помощи.
          </p>
        </div>

        {/* Статистика партнеров */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {partnerTypes.map((type, index) => (
            <Card key={index} className="prevent-card-hover">
              <CardHeader className="pb-4">
                <div className={`prevent-icon-container ${type.color} mb-4`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{type.type}</CardTitle>
                <div className="text-3xl font-bold text-purple-600">{type.count}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Список партнеров */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">Наши партнеры</h2>
          
          {partners.map((partner, index) => (
            <Card key={index} className="prevent-card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{partner.name}</CardTitle>
                    <Badge variant="secondary" className="prevent-badge-soft mb-3">
                      {partner.type}
                    </Badge>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{partner.rating}</span>
                      <span className="text-gray-500 text-sm">рейтинг</span>
                    </div>
                  </div>
                  <div className="prevent-icon-container bg-purple-500">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Контактная информация</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{partner.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{partner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-purple-600">{partner.website}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Услуги и специализация</h4>
                    <p className="text-sm text-gray-600 mb-3">{partner.specialties}</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.services.map((service, serviceIndex) => (
                        <Badge key={serviceIndex} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <Button size="sm" className="prevent-button-primary">
                      Записаться на прием
                    </Button>
                    <Button size="sm" variant="outline">
                      Подробнее
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Как стать партнером */}
        <Card className="prevent-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center">Станьте партнером PREVENT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Присоединяйтесь к нашей сети медицинских учреждений и помогайте женщинам заботиться о своем здоровье с помощью современных технологий превентивной медицины.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Для клиник</h4>
                  <p className="text-sm text-gray-600">Расширение клиентской базы и современные инструменты диагностики</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Для лабораторий</h4>
                  <p className="text-sm text-gray-600">Интеграция с платформой и автоматизация процессов</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Для врачей</h4>
                  <p className="text-sm text-gray-600">Доступ к пациентам и современным протоколам лечения</p>
                </div>
              </div>
              <Button className="prevent-button-primary">
                Стать партнером
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="prevent-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <Building2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Страница находится в разработке</h3>
              <p className="text-gray-600 mb-4">
                Мы активно формируем сеть партнеров по всей России для обеспечения доступности качественной медицинской помощи.
              </p>
              <Button 
                onClick={() => navigate('/subscription')}
                className="prevent-button-primary"
              >
                Узнать о планах сотрудничества
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Partners;
