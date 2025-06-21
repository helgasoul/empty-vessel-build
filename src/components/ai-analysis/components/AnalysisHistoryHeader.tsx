
/**
 * Analysis History Header Component
 * Header section for the analysis history
 */

import React from 'react';
import { Brain } from 'lucide-react';

interface AnalysisHistoryHeaderProps {
  isEmpty: boolean;
}

export const AnalysisHistoryHeader: React.FC<AnalysisHistoryHeaderProps> = ({ isEmpty }) => {
  if (isEmpty) {
    return (
      <div className="p-12 text-center">
        <Brain className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
        <h3 className="text-h4 text-text-primary font-semibold mb-2">
          История анализов пуста
        </h3>
        <p className="text-body text-text-secondary">
          Запустите ваш первый анализ ИИ, чтобы создать историю
        </p>
      </div>
    );
  }

  return null;
};
