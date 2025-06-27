
/**
 * Analysis Results Header Component
 * Header section with close button and completion status
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';

interface AnalysisResultsHeaderProps {
  onClose: () => void;
}

export const AnalysisResultsHeader: React.FC<AnalysisResultsHeaderProps> = ({ onClose }) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-h3 text-text-primary flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Анализ завершен
            </CardTitle>
            <CardDescription>
              Результаты анализа ваших данных о здоровье
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
