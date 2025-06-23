
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface HormoneTestTipsProps {
  testCategory: string;
}

const HormoneTestTips: React.FC<HormoneTestTipsProps> = ({ testCategory }) => {
  if (testCategory !== 'hormones') {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Важно для гормональных анализов:</p>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>ФСГ, ЛГ: 3-5 день цикла</li>
            <li>Прогестерон: 20-22 день цикла (при 28-дневном цикле)</li>
            <li>Эстрадиол: 5-7 день или 20-22 день цикла</li>
            <li>Пролактин: любой день цикла, натощак, в утренние часы</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HormoneTestTips;
