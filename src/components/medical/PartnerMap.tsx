
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  Search,
  Filter,
  Building2
} from "lucide-react";

interface PartnerClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  specializations: string[];
  workingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  website?: string;
  description: string;
}

const PartnerMap = () => {
  const [clinics] = useState<PartnerClinic[]>([
    {
      id: '1',
      name: 'Медицинский центр "Здоровье+"',
      address: 'ул. Тверская, 15, Москва',
      phone: '+7 (495) 123-45-67',
      rating: 4.8,
      specializations: ['Гинекология', 'Кардиология', 'Терапия'],
      workingHours: 'Пн-Пт: 8:00-20:00, Сб: 9:00-18:00',
      coordinates: { lat: 55.7558, lng: 37.6176 },
      description: 'Современный медицинский центр с опытными специалистами'
    },
    {
      id: '2',
      name: 'Клиника "МедЭксперт"',
      address: 'Проспект Мира, 102, Москва',
      phone: '+7 (495) 234-56-78',
      rating: 4.6,
      specializations: ['Эндокринология', 'Онкология', 'Диагностика'],
      workingHours: 'Пн-Вс: 9:00-21:00',
      coordinates: { lat: 55.7797, lng: 37.6336 },
      description: 'Клиника экспертного уровня с современным оборудованием'
    },
    {
      id: '3',
      name: 'Центр женского здоровья "Виталайф"',
      address: 'ул. Арбат, 28, Москва',
      phone: '+7 (495) 345-67-89',
      rating: 4.9,
      specializations: ['Женское здоровье', 'Репродуктология', 'УЗИ'],
      workingHours: 'Пн-Пт: 8:00-19:00, Сб: 9:00-15:00',
      coordinates: { lat: 55.7520, lng: 37.5920 },
      description: 'Специализированный центр для женского здоровья'
    },
    {
      id: '4',
      name: 'Лаборатория "БиоТест"',
      address: 'ул. Новый Арбат, 36, Москва',
      phone: '+7 (495) 456-78-90',
      rating: 4.7,
      specializations: ['Лабораторная диагностика', 'Генетика', 'Биохимия'],
      workingHours: 'Пн-Пт: 7:00-18:00, Сб: 8:00-16:00',
      coordinates: { lat: 55.7539, lng: 37.5893 },
      description: 'Современная лаборатория с быстрыми и точными результатами'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<PartnerClinic | null>(null);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
                                  clinic.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  const allSpecializations = Array.from(
    new Set(clinics.flatMap(clinic => clinic.specializations))
  );

  const handleGetDirections = (clinic: PartnerClinic) => {
    const url = `https://yandex.ru/maps/?rtext=~${clinic.coordinates.lat},${clinic.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const ClinicCard = ({ clinic }: { clinic: PartnerClinic }) => (
    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{clinic.name}</CardTitle>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{clinic.rating}</span>
            </div>
          </div>
          <Building2 className="w-6 h-6 text-gray-400" />
        </div>
        <CardDescription>{clinic.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
          <span className="text-sm">{clinic.address}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{clinic.phone}</span>
        </div>

        <div className="flex items-start space-x-2">
          <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
          <span className="text-sm">{clinic.workingHours}</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Специализации:</p>
          <div className="flex flex-wrap gap-1">
            {clinic.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex space-x-2 pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleGetDirections(clinic)}
          >
            <Navigation className="w-4 h-4 mr-1" />
            Маршрут
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1">
                Подробнее
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{clinic.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{clinic.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{clinic.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{clinic.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{clinic.workingHours}</span>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Специализации:</p>
                  <div className="flex flex-wrap gap-1">
                    {clinic.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleGetDirections(clinic)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Маршрут
                  </Button>
                  <Button className="flex-1">
                    Записаться
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Клиники-партнёры
        </h2>
        <p className="text-lg text-gray-600">
          Найдите ближайшую клиику-партнёр для записи на приём
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Поиск по названию или адресу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="sm:w-64">
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Все специализации</option>
            {allSpecializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map(clinic => (
          <ClinicCard key={clinic.id} clinic={clinic} />
        ))}
      </div>

      {filteredClinics.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Клиники не найдены
          </h3>
          <p className="text-gray-600">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Как записаться на приём</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">1. Выберите клинику</h4>
              <p className="text-sm text-gray-600">
                Найдите подходящую клинику рядом с вами
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">2. Свяжитесь с клиникой</h4>
              <p className="text-sm text-gray-600">
                Позвоните или запишитесь онлайн
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">3. Посетите приём</h4>
              <p className="text-sm text-gray-600">
                Получите качественную медицинскую помощь
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerMap;
