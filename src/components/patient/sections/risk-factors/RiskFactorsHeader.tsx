
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RiskFactorsHeaderProps {
  onRecalculate: () => void;
}

export default function RiskFactorsHeader({ onRecalculate }: RiskFactorsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Факторы риска</h2>
      <Button 
        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
        onClick={onRecalculate}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Пересчитать риски
      </Button>
    </div>
  );
}
