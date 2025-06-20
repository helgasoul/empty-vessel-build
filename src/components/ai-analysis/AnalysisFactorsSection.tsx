
import React from 'react';
import { CheckCircle } from "lucide-react";

interface AnalysisFactorsSectionProps {
  factors: string[];
}

const AnalysisFactorsSection = ({ factors }: AnalysisFactorsSectionProps) => {
  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Что анализирует наш ИИ</h2>
          <p className="text-lg text-gray-700">Мультифакторная оценка включает:</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factors.map((factor, index) => (
            <div key={index} className="flex items-start space-x-3 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100 min-h-[100px]">
              <CheckCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800 font-medium leading-relaxed text-sm">{factor}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalysisFactorsSection;
