
import React from 'react';
import { Microscope } from "lucide-react";

interface ScientificBasisSectionProps {
  scientificBasis: string[];
}

const ScientificBasisSection = ({ scientificBasis }: ScientificBasisSectionProps) => {
  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">Научная основа</h2>
          <p className="text-lg text-gray-600 mb-8">Наши алгоритмы основаны на:</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {scientificBasis.map((basis, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200">
              <Microscope className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700 font-medium">{basis}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScientificBasisSection;
