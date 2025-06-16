
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Award, Users, Heart } from "lucide-react";
import { useFounderInfo } from '@/hooks/useFounderInfo';
import FounderEditForm from './FounderEditForm';

const FounderSection = () => {
  const { data: founderInfo, isLoading } = useFounderInfo();

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-full max-w-md mx-auto mb-4"></div>
            <div className="h-16 bg-gray-200 rounded max-w-2xl mx-auto mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-xl max-w-4xl mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Если данных нет, используем данные по умолчанию
  const founder = founderInfo || {
    name: 'Др. Анна Петрова',
    title: 'MD, PhD • Основатель и CEO PREVENT',
    description: 'Доктор медицинских наук с 15-летним опытом работы в области превентивной медицины и женского здоровья. Автор более 50 научных публикаций по персонализированной медицине. Анна создала PREVENT после собственного опыта с системой здравоохранения, когда поняла, что женщинам нужен более персонализированный подход к профилактике заболеваний.',
    education: [
      'РНИМУ им. Н.И. Пирогова, лечебный факультет',
      'PhD, Превентивная медицина, Гарвардская школа общественного здравоохранения',
      'MBA, Здравоохранение и биотехнологии, Стэнфорд'
    ],
    achievements: [
      'Лауреат премии "Инновации в медицине" 2023',
      'Член экспертного совета ВОЗ по женскому здоровью',
      'Спикер на международных конференциях по превентивной медицине'
    ],
    quote: 'Моя миссия — дать каждой женщине возможность контролировать свое здоровье с помощью науки и персонализированных данных. Превентивная медицина — это будущее.',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  return (
    <section className="py-20 relative">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Основатель проекта</span>
        </div>
        
        <h2 className="text-4xl font-montserrat font-bold text-gray-900 mb-4">
          Кто стоит за <span className="prevent-gradient-primary bg-clip-text text-transparent">PREVENT</span>
        </h2>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-roboto">
          Встречайте визионера, который создал революционную платформу превентивной медицины
        </p>
      </div>

      <Card className="max-w-4xl mx-auto overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Фотография */}
            <div className="relative h-96 md:h-full">
              <img
                src={founder.image_url}
                alt={`${founder.name} - Основатель PREVENT`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Информация */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
                  {founder.name}
                </h3>
                <p className="text-xl text-primary font-medium mb-4">
                  {founder.title}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Award className="w-3 h-3 mr-1" />
                    15+ лет опыта
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    <Users className="w-3 h-3 mr-1" />
                    50+ публикаций
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    <Heart className="w-3 h-3 mr-1" />
                    Женское здоровье
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 text-gray-600 font-roboto">
                {founder.description && (
                  <p className="leading-relaxed">
                    {founder.description}
                  </p>
                )}

                {founder.education && founder.education.length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Образование:</h4>
                    <ul className="text-sm space-y-1">
                      {founder.education.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {founder.achievements && founder.achievements.length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Достижения:</h4>
                    <ul className="text-sm space-y-1">
                      {founder.achievements.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {founder.quote && (
                <div className="mt-8 p-6 prevent-gradient-accent rounded-xl text-white">
                  <blockquote className="text-lg font-medium leading-relaxed">
                    "{founder.quote}"
                  </blockquote>
                  <cite className="block mt-3 text-accent-foreground/90 font-medium">
                    — {founder.name}
                  </cite>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <FounderEditForm />
    </section>
  );
};

export default FounderSection;
