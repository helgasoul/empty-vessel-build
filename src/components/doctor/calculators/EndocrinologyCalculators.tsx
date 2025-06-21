
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";

const EndocrinologyCalculators = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="w-5 h-5 text-purple-600" />
            <span>Эндокринологические калькуляторы</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Здесь будут размещены специализированные эндокринологические калькуляторы:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Оценка функции надпочечников</li>
            <li>• Калькуляторы для диабета</li>
            <li>• Расчеты дозировок гормональных препаратов</li>
            <li>• Анализ костного метаболизма</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EndocrinologyCalculators;
