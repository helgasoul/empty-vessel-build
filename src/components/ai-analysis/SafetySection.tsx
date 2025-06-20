
import React from 'react';
import { LucideIcon } from "lucide-react";

interface SafetyFeature {
  icon: LucideIcon;
  text: string;
  color: string;
}

interface SafetySectionProps {
  safetyFeatures: SafetyFeature[];
}

const SafetySection = ({ safetyFeatures }: SafetySectionProps) => {
  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">Точность и безопасность</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {safetyFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                <IconComponent className={`w-6 h-6 ${feature.color} flex-shrink-0 mt-1`} />
                <span className="text-gray-700 font-medium leading-relaxed">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
