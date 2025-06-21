
import React from 'react';
import { TrendingUp, Heart, Activity } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Научный подход",
      description: "Все рекомендации основаны на последних научных исследованиях и международных стандартах",
      colorFrom: "from-purple-500",
      colorTo: "to-pink-500",
      borderColor: "border-purple-100"
    },
    {
      icon: Heart,
      title: "Персонализация",
      description: "Индивидуальные рекомендации с учетом возраста, образа жизни и особенностей организма",
      colorFrom: "from-blue-500",
      colorTo: "to-cyan-500",
      borderColor: "border-blue-100"
    },
    {
      icon: Activity,
      title: "Комплексность",
      description: "Полный спектр решений для поддержания женского здоровья на каждом этапе жизни",
      colorFrom: "from-green-500",
      colorTo: "to-emerald-500",
      borderColor: "border-green-100"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {benefits.map((benefit, index) => {
        const IconComponent = benefit.icon;
        return (
          <div 
            key={index}
            className={`text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border ${benefit.borderColor}`}
          >
            <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${benefit.colorFrom} ${benefit.colorTo} rounded-full flex items-center justify-center`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BenefitsSection;
