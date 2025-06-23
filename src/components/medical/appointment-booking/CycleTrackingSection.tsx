
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

interface CycleTrackingSectionProps {
  cycleDay: string;
  cyclePhase: CyclePhase | '';
  onCycleDayChange: (value: string) => void;
  onCyclePhaseChange: (value: CyclePhase) => void;
}

const CycleTrackingSection: React.FC<CycleTrackingSectionProps> = ({
  cycleDay,
  cyclePhase,
  onCycleDayChange,
  onCyclePhaseChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cycle_day">День цикла (по желанию)</Label>
        <Input
          id="cycle_day"
          type="number"
          min="1"
          max="35"
          value={cycleDay}
          onChange={(e) => onCycleDayChange(e.target.value)}
          placeholder="1-35"
        />
      </div>

      {cycleDay && (
        <div className="space-y-2">
          <Label htmlFor="cycle_phase">Фаза цикла</Label>
          <Select value={cyclePhase} onValueChange={onCyclePhaseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите фазу цикла" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menstrual">Менструальная</SelectItem>
              <SelectItem value="follicular">Фолликулярная</SelectItem>
              <SelectItem value="ovulation">Овуляция</SelectItem>
              <SelectItem value="luteal">Лютеиновая</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CycleTrackingSection;
