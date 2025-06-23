
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

interface CyclePhaseSectionProps {
  optimalCyclePhase: CyclePhase | '';
  onOptimalCyclePhaseChange: (value: CyclePhase) => void;
}

const CyclePhaseSection: React.FC<CyclePhaseSectionProps> = ({
  optimalCyclePhase,
  onOptimalCyclePhaseChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="optimal_cycle_phase">Оптимальная фаза цикла (для гормональных анализов)</Label>
      <Select value={optimalCyclePhase} onValueChange={onOptimalCyclePhaseChange}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите фазу цикла" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Любая фаза</SelectItem>
          <SelectItem value="menstrual">Менструальная (1-5 день)</SelectItem>
          <SelectItem value="follicular">Фолликулярная (6-14 день)</SelectItem>
          <SelectItem value="ovulation">Овуляция (14-16 день)</SelectItem>
          <SelectItem value="luteal">Лютеиновая (17-28 день)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CyclePhaseSection;
