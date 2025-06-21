
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const GynecologyCalculators = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <span>Гинекологические калькуляторы</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Здесь будут размещены специализированные гинекологические калькуляторы:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Расчет менструального цикла</li>
            <li>• Оценка фертильности</li>
            <li>• Калькуляторы беременности</li>
            <li>• Анализ гормонального статуса</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GynecologyCalculators;
