
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardiovascularData } from '../../../types/health';

interface CardiovascularStepProps {
  data?: CardiovascularData;
  onComplete: (data: CardiovascularData) => void;
}

const CardiovascularStep: React.FC<CardiovascularStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<CardiovascularData>({
    bloodPressure: { systolic: 120, diastolic: 80, measurementDate: null },
    heartRate: { resting: 70, measurementDate: null },
    cholesterol: { total: null, hdl: null, ldl: null, triglycerides: null, lastTest: null },
    conditions: { hypertension: false, heartDisease: false, stroke: false, diabetes: false },
    familyHistory: { heartDisease: false, stroke: false, diabetes: false },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Информация о сердечно-сосудистой системе...</p>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">Продолжить</Button>
      </div>
    </div>
  );
};

export default CardiovascularStep;
