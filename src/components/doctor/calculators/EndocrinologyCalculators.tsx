
import React, { useState } from 'react';
import { ThyroidCalculationForm, ThyroidResultsDisplay, calculateThyroidFunction, ThyroidResult } from './endocrinology';

const EndocrinologyCalculators = () => {
  const [thyroidData, setThyroidData] = useState({
    tsh: '',
    ft4: '',
    ft3: '',
    rt3: '',
    totalTestosterone: '',
    shbg: '',
    age: '',
    phase: 'follicular'
  });

  const [result, setResult] = useState<ThyroidResult | null>(null);

  const handleCalculate = () => {
    const calculatedResult = calculateThyroidFunction(thyroidData);
    setResult(calculatedResult);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThyroidCalculationForm
          thyroidData={thyroidData}
          onDataChange={setThyroidData}
          onCalculate={handleCalculate}
        />

        {result && (
          <ThyroidResultsDisplay result={result} />
        )}
      </div>
    </div>
  );
};

export default EndocrinologyCalculators;
