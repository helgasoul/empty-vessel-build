
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Heart, Brain, Shield } from "lucide-react";

const UserTestimonials = () => {
  const testimonials = [
    {
      name: "Анна К.",
      age: "38 лет, маркетолог",
      avatar: "АК",
      rating: 5,
      text: "Благодаря PREVENT я обнаружила предрасположенность к диабету и изменила питание. Через 6 месяцев все показатели в норме! Платформа дала мне конкретный план действий.",
      highlight: "предрасположенность к диабету",
      icon: Heart,
      result: "Снижение риска на 40%"
    },
    {
      name: "Мария С.",
      age: "42 года, дизайнер",
      avatar: "МС",
      rating: 5,
      text: "Платформа помогла мне подготовиться к менопаузе. Теперь я знаю, что делать и чувствую себя уверенно. Персональные рекомендации изменили мое отношение к здоровью.",
      highlight: "подготовиться к менопаузе",
      icon: Brain,
      result: "100% готовность к изменениям"
    },
    {
      name: "Елена Р.",
      age: "35 лет, врач",
      avatar: "ЕР",
      rating: 5,
      text: "Как врач, я ценю научный подход PREVENT. Рекомендации основаны на доказательной медицине. Использую платформу и для себя, и рекомендую пациенткам.",
      highlight: "научный подход",
      icon: Shield,
      result: "Профессиональное одобрение"
    }
  ];

  const stats = [
    { number: "1000+", label: "Довольных пользователей", color: "text-purple-600" },
    { number: "95%", label: "Точность прогнозов", color: "text-green-600" },
    { number: "24/7", label: "Поддержка и мониторинг", color: "text-blue-600" },
    { number: "100%", label: "Конфиденциальность", color: "text-red-600" }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-6 hover:bg-green-200 transition-colors duration-200">
            ⭐ Отзывы пользователей
          </Badge>
          <h2 className="text-4xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6">
            Истории наших пользователей
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Узнайте, как PREVENT помог тысячам женщин взять здоровье под контроль 
            и получить персональные рекомендации
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => {
            const IconComponent = testimonial.icon;
            return (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 font-medium">{testimonial.age}</p>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full">
                      <IconComponent className="w-4 h-4 text-gray-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {testimonial.result}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="w-6 h-6 text-purple-300 mb-3" aria-hidden="true" />
                  <p className="text-gray-800 leading-relaxed font-medium">
                    {testimonial.text.split(testimonial.highlight)[0]}
                    <span className="font-bold text-purple-700 bg-purple-100 px-1 rounded">{testimonial.highlight}</span>
                    {testimonial.text.split(testimonial.highlight)[1]}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                {stat.number}
              </div>
              <p className="text-gray-700 font-semibold text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Безопасность и доверие</h3>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-green-600" aria-hidden="true" />
              <span className="text-sm text-gray-800 font-semibold">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span className="text-sm text-gray-800 font-semibold">256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Heart className="w-5 h-5 text-purple-600" aria-hidden="true" />
              <span className="text-sm text-gray-800 font-semibold">Врачебная этика</span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <Star className="w-5 h-5 text-yellow-600" aria-hidden="true" />
              <span className="text-sm text-gray-800 font-semibold">Научная точность</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTestimonials;
