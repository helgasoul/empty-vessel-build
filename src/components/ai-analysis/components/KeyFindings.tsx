
/**
 * Key Findings Component
 * Displays key findings preview
 */

import React from 'react';

interface KeyFindingsProps {
  keyFindings: string[];
}

export const KeyFindings: React.FC<KeyFindingsProps> = ({ keyFindings }) => {
  if (!keyFindings || keyFindings.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-border-light pt-4">
      <p className="text-body-small text-text-secondary font-medium mb-2">
        Ключевые выводы:
      </p>
      <div className="space-y-1">
        {keyFindings.slice(0, 2).map((finding, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-body-small text-text-primary line-clamp-2">
              {finding}
            </p>
          </div>
        ))}
        {keyFindings.length > 2 && (
          <p className="text-body-small text-text-secondary pl-4">
            +{keyFindings.length - 2} дополнительных выводов
          </p>
        )}
      </div>
    </div>
  );
};
