
/**
 * Key Findings Section Component
 * Displays key findings from analysis results
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface KeyFindingsSectionProps {
  keyFindings: string[];
}

export const KeyFindingsSection: React.FC<KeyFindingsSectionProps> = ({ keyFindings }) => {
  return (
    <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="text-h4 text-text-primary flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          Ключевые выводы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-body text-text-primary">{finding}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
