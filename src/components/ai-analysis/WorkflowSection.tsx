
import React from 'react';
import { LucideIcon } from "lucide-react";

interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface WorkflowSectionProps {
  workflowSteps: WorkflowStep[];
}

const WorkflowSection = ({ workflowSteps }: WorkflowSectionProps) => {
  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Как это работает</h2>
          <p className="text-lg text-gray-700">Пошаговый процесс анализа</p>
        </div>
        
        <div className="space-y-6">
          {workflowSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100/50 p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
