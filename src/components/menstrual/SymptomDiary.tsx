
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SymptomMoodLogger from '@/components/health/SymptomMoodLogger';

const SymptomDiary = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Дневник симптомов и настроения</CardTitle>
        </CardHeader>
        <CardContent>
          <SymptomMoodLogger />
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomDiary;
