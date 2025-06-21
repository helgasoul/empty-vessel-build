
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import BackButton from '@/components/ui/back-button';
import { 
  Stethoscope, 
  Star, 
  Calendar, 
  Users,
  Award,
  MapPin,
  Clock,
  Video,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import ExpertsPanel from '@/components/experts/ExpertsPanel';

const Experts = () => {
  const doctors = [
    {
      id: 1,
      name: "Доктор Ольга Пучкова",
      specialization: "Маммология, ИИ в медицине",
      experience: "15+ лет",
      rating: 4.9,
      reviews: 234,
      location: "Москва",
      price: "5000 ₽",
      availability: "Доступна сегодня",
      badges: ["Основатель PREVENT", "EUSOBI", "SberMed.AI"],
      consultations: 1200
    },
    {
      id: 2,
      name: "Доктор Анна Иванова",
      specialization: "Эндокринология, гормоны",
      experience: "12+ лет",
      rating: 4.8,
      reviews: 189,
      location: "Санкт-Петербург",
      price: "4000 ₽",
      availability: "Доступна завтра",
      badges: ["Ведущий эндокринолог", "Кандидат наук"],
      consultations: 850
    },
    {
      id: 3,
      name: "Доктор Мария Смирнова",
      specialization: "Гинекология, репродуктология",
      experience: "10+ лет",
      rating: 4.7,
      reviews: 156,
      location: "Екатеринбург",
      price: "3500 ₽",
      availability: "Доступна через 2 дня",
      badges: ["Специалист по ЭКО", "Врач высшей категории"],
      consultations: 620
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600/90 to-blue-600/90 text-white py-20">
        <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <BackButton fallbackPath="/" className="mb-6 bg-white/20 hover:bg-white/30 text-white border-white/30" />
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Врачи-эксперты PREVENT
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Ведущие специалисты в области женского здоровья, которые создают персональные рекомендации для каждой пациентки
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 text-center p-6 hover:shadow-2xl transition-all duration-300">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Экспертов</div>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 text-center p-6 hover:shadow-2xl transition-all duration-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-sm text-gray-600">Консультаций</div>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 text-center p-6 hover:shadow-2xl transition-all duration-300">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.9</div>
            <div className="text-sm text-gray-600">Средний рейтинг</div>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 text-center p-6 hover:shadow-2xl transition-all duration-300">
            <div className="text-3xl font-bold text-pink-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Довольных пациентов</div>
          </Card>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto">
                      <Stethoscope className="w-10 h-10 text-purple-600" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{doctor.specialization}</p>
                  
                  <div className="text-2xl font-bold text-gray-900 mb-1">{doctor.price}</div>
                  <div className="text-sm text-gray-500 mb-4">за консультацию</div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {doctor.badges.map((badge, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Award className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                    <span>{doctor.rating} ({doctor.reviews})</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                    <span>{doctor.availability}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Записаться на прием
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Чат
                    </Button>
                    <Button variant="outline" className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50">
                      <Video className="w-4 h-4 mr-2" />
                      Видео
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Experts Panel */}
        <div className="mt-12">
          <ExpertsPanel />
        </div>
      </div>
    </div>
  );
};

export default Experts;
