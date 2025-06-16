
import React from 'react';
import { AlertTriangle } from "lucide-react";

const BRCAWarning: React.FC = () => {
  return (
    <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <div className="flex items-start space-x-2">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-800">Важное предупреждение</h4>
          <p className="text-sm text-amber-700 mt-1">
            Данная оценка носит информационный характер. Результаты генетического тестирования 
            должны интерпретироваться только квалифицированным генетиком или онкологом.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BRCAWarning;
