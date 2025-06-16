
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Award, Users, Heart } from "lucide-react";

const FounderSection = () => {
  return (
    <section className="py-20">
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
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Анна Петрова - Основатель PREVENT"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Информация */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
                  Др. Анна Петрова
                </h3>
                <p className="text-xl text-primary font-medium mb-4">
                  MD, PhD • Основатель и CEO PREVENT
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
                <p className="leading-relaxed">
                  Доктор медицинских наук с 15-летним опытом работы в области превентивной медицины и женского здоровья. 
                  Автор более 50 научных публикаций по персонализированной медицине.
                </p>
                
                <p className="leading-relaxed">
                  Анна создала PREVENT после собственного опыта с системой здравоохранения, когда поняла, 
                  что женщинам нужен более персонализированный подход к профилактике заболеваний.
                </p>

                <div className="pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Образование:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• РНИМУ им. Н.И. Пирогова, лечебный факультет</li>
                    <li>• PhD, Превентивная медицина, Гарвардская школа общественного здравоохранения</li>
                    <li>• MBA, Здравоохранение и биотехнологии, Стэнфорд</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Достижения:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Лауреат премии "Инновации в медицине" 2023</li>
                    <li>• Член экспертного совета ВОЗ по женскому здоровью</li>
                    <li>• Спикер на международных конференциях по превентивной медицине</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 prevent-gradient-accent rounded-xl text-white">
                <blockquote className="text-lg font-medium leading-relaxed">
                  "Моя миссия — дать каждой женщине возможность контролировать свое здоровье с помощью 
                  науки и персонализированных данных. Превентивная медицина — это будущее."
                </blockquote>
                <cite className="block mt-3 text-accent-foreground/90 font-medium">
                  — Др. Анна Петрова
                </cite>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FounderSection;
