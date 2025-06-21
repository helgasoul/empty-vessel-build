
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

const MetabolicCalculators = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span>Метаболические калькуляторы</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Здесь будут размещены калькуляторы для оценки метаболических процессов:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Расчет базального метаболизма (BMR)</li>
            <li>• Индекс массы тела (ИМТ)</li>
            <li>• Оценка липидного профиля</li>
            <li>• Калькуляторы энергетических потребностей</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetabolicCalculators;
