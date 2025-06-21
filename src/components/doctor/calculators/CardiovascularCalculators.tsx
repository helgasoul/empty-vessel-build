
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const CardiovascularCalculators = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span>Кардиологические калькуляторы</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Здесь будут размещены калькуляторы для оценки сердечно-сосудистых рисков:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Калькулятор QRISK3</li>
            <li>• Фрамингемская шкала риска</li>
            <li>• Оценка артериального давления</li>
            <li>• Анализ ЭКГ параметров</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardiovascularCalculators;
