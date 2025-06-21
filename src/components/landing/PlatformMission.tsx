
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Brain, Heart, Users } from "lucide-react";
import { useMissionImages } from '@/hooks/useMissionImages';
import MissionImageManager from '@/components/mission/MissionImageManager';

const PlatformMission = () => {
  const { data: missionImages = [], isLoading } = useMissionImages();

  return (
    <section id="ai-analysis" className="py-16 px-4 md:px-6 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Миссия PREVENT
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Мы поддерживаем женщин во всем мире в заботе о своем здоровье, предоставляя персонализированные, научно обоснованные рекомендации для предотвращения заболеваний до их появления
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <img
              src="/lovable-uploads/0d284322-f92c-4a79-a82b-576ce951a7fa.png"
              alt="Команда PREVENT - женщины разных возрастов"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
          <p className="text-gray-600 mt-4 italic">
            Забота о здоровье женщин на всех этапах жизни
          </p>
        </div>

        {/* Mission Images Section */}
        {!isLoading && missionImages.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
              {missionImages[0]?.title || 'Наша команда'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {missionImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  {image.description && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-xl flex items-end">
                      <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">{image.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: "ИИ-анализ",
              description: "Современные алгоритмы для точного прогнозирования",
              color: "from-purple-500 to-indigo-500",
              bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
              borderColor: "border-purple-200"
            },
            {
              icon: Shield,
              title: "Безопасность",
              description: "Защита данных на уровне медицинских стандартов",
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
              borderColor: "border-green-200"
            },
            {
              icon: Heart,
              title: "Персонализация",
              description: "Индивидуальный подход к каждой женщине",
              color: "from-pink-500 to-rose-500",
              bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
              borderColor: "border-pink-200"
            },
            {
              icon: Users,
              title: "Поддержка",
              description: "Сообщество экспертов и единомышленников",
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
              borderColor: "border-blue-200"
            }
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={index} 
                className={`${item.bgColor} ${item.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer`}
                role="button"
                tabIndex={0}
                aria-label={`Узнать больше о ${item.title}`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-100 max-w-3xl mx-auto">
            <p className="text-gray-800 font-medium text-lg leading-relaxed">
              "Превентивная медицина — это не только технологии, но и забота о будущем каждой женщины. 
              Мы верим, что знание своих рисков — это первый шаг к здоровой и долгой жизни."
            </p>
            <p className="text-purple-700 font-semibold mt-4">— Команда PREVENT</p>
          </div>
        </div>
      </div>

      <MissionImageManager />
    </section>
  );
};

export default PlatformMission;
