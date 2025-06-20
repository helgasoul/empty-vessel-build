
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Brain, Heart, Users } from "lucide-react";

const PlatformMission = () => {
  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-purple-100 text-purple-800 mb-6 hover:bg-purple-200 transition-colors duration-200">
            🎯 Наша миссия
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-6">
            Миссия PREVENT
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Мы создаем будущее превентивной медицины, где каждая женщина имеет доступ к 
            персонализированному анализу рисков здоровья и научно-обоснованным рекомендациям 
            для их предотвращения
          </p>
        </div>

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
    </section>
  );
};

export default PlatformMission;
