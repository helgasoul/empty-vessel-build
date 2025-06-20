
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RiskType {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface RiskTypesSectionProps {
  analysisTypes: RiskType[];
}

const RiskTypesSection = ({ analysisTypes }: RiskTypesSectionProps) => {
  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">Виды рисков, которые мы прогнозируем</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {analysisTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <Card key={index} className={`${type.bgColor} border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${type.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-700">{type.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{type.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RiskTypesSection;
