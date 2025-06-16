
import React from 'react';
import { calculateBMI, getBMICategory, getBMICategoryColor } from '@/lib/bmiCalculator';
import { Card, CardContent } from '@/components/ui/card';

interface BMIDisplayProps {
  weight?: number | null;
  height?: number | null;
  className?: string;
}

export const BMIDisplay: React.FC<BMIDisplayProps> = ({ weight, height, className }) => {
  if (!weight || !height) {
    return null;
  }

  const bmi = calculateBMI(weight, height);
  const category = getBMICategory(bmi);
  const colorClass = getBMICategoryColor(bmi);

  if (bmi === 0) {
    return null;
  }

  return (
    <Card className={`bg-gray-50 ${className}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{bmi}</div>
          <div className="text-sm text-gray-600">ИМТ</div>
          <div className={`text-sm font-medium ${colorClass}`}>
            {category}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
