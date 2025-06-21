
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const HormonalMetabolicCalculators = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <span>Гормональные и метаболические калькуляторы</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Здесь будут размещены калькуляторы для оценки гормонального статуса и метаболических показателей:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Индекс инсулинорезистентности (HOMA-IR)</li>
            <li>• Оценка андрогенного профиля</li>
            <li>• Расчет индекса свободных андрогенов (FAI)</li>
            <li>• Анализ соотношения эстрогенов</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HormonalMetabolicCalculators;
