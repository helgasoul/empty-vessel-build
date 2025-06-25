
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FamilyHistoryData } from '../../../types/health';

interface FamilyHistoryStepProps {
  data?: FamilyHistoryData;
  onComplete: (data: FamilyHistoryData) => void;
}

const FamilyHistoryStep: React.FC<FamilyHistoryStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<FamilyHistoryData>({
    cancers: {
      breastCancer: [],
      ovarianCancer: [],
      colorectalCancer: [],
      lungCancer: [],
      otherCancers: []
    },
    cardiovascular: {
      heartAttack: [],
      stroke: [],
      hypertension: []
    },
    metabolic: {
      diabetes: [],
      thyroidDisease: [],
      osteoporosis: []
    },
    neurological: {
      alzheimer: [],
      parkinson: [],
      otherDementia: []
    },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Информация о семейном анамнезе...</p>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">Завершить анкету</Button>
      </div>
    </div>
  );
};

export default FamilyHistoryStep;
