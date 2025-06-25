
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LifestyleData } from '../../../types/health';

interface LifestyleStepProps {
  data?: LifestyleData;
  onComplete: (data: LifestyleData) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<LifestyleData>({
    smoking: { status: 'never', packYears: null, quitDate: null },
    alcohol: { frequency: 'monthly', drinksPerWeek: 2 },
    exercise: { frequency: 'weekly', intensity: 'moderate', types: [], minutesPerWeek: 150 },
    diet: { type: 'standard', supplements: [], waterIntake: 8 },
    stress: { level: 5, sources: [], copingMethods: [] },
    work: { type: 'office', stressLevel: 5, chemicalExposure: false, nightShifts: false },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Информация об образе жизни...</p>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">Продолжить</Button>
      </div>
    </div>
  );
};

export default LifestyleStep;
