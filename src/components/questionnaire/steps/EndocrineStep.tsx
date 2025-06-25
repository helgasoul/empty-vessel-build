
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { EndocrineData } from '../../../types/health';

interface EndocrineStepProps {
  data?: EndocrineData;
  onComplete: (data: EndocrineData) => void;
}

const EndocrineStep: React.FC<EndocrineStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<EndocrineData>({
    diabetes: { type: 'none', diagnosisAge: null, medications: [], lastHbA1c: null },
    thyroid: { hasDisease: false, diseaseType: '', medications: [], lastTSH: null, lastT4: null },
    reproductive: { pcos: false, endometriosis: false, fibroids: false, fertilityIssues: false },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Информация об эндокринной системе...</p>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">Продолжить</Button>
      </div>
    </div>
  );
};

export default EndocrineStep;
