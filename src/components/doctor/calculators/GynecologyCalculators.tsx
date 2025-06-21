
import React, { useState } from 'react';
import { FertilityCalculationForm, FertilityResultsDisplay, calculateFertility, FertilityResult } from './gynecology';

const GynecologyCalculators = () => {
  const [gynData, setGynData] = useState({
    lastPeriodDate: '',
    cycleLength: '28',
    amh: '',
    age: '',
    fsh: '',
    lh: '',
    antralFollicles: ''
  });

  const [result, setResult] = useState<FertilityResult | null>(null);

  const handleCalculate = () => {
    const calculatedResult = calculateFertility(gynData);
    setResult(calculatedResult);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FertilityCalculationForm
          fertilityData={gynData}
          onDataChange={setGynData}
          onCalculate={handleCalculate}
        />

        {result && (
          <FertilityResultsDisplay result={result} />
        )}
      </div>
    </div>
  );
};

export default GynecologyCalculators;
