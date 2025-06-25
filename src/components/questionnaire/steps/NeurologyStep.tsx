
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { NeurologyData } from '../../../types/health';

interface NeurologyStepProps {
  data?: NeurologyData;
  onComplete: (data: NeurologyData) => void;
}

const NeurologyStep: React.FC<NeurologyStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<NeurologyData>({
    mentalHealth: { depression: false, anxiety: false, currentTherapy: false, medications: [] },
    sleep: { hoursPerNight: 8, quality: 'good', sleepDisorders: [] },
    cognition: { memoryConcerns: false, concentrationIssues: false, familyDementia: false },
    headaches: { frequency: 'rarely', type: '', triggers: [] },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Информация о неврологии и психологии...</p>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">Продолжить</Button>
      </div>
    </div>
  );
};

export default NeurologyStep;
