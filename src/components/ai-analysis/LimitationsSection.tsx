
import React from 'react';
import { AlertTriangle } from "lucide-react";

interface LimitationsSectionProps {
  limitations: string[];
}

const LimitationsSection = ({ limitations }: LimitationsSectionProps) => {
  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">Ограничения ИИ</h2>
          <p className="text-lg text-gray-600 mb-8">Что важно понимать:</p>
        </div>
        
        <div className="space-y-4">
          {limitations.map((limitation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-200">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700 font-medium">{limitation}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LimitationsSection;
