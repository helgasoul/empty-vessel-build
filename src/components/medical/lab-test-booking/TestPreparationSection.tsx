
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TestPreparationSectionProps {
  preparationNotes: string;
  onPreparationNotesChange: (value: string) => void;
}

const TestPreparationSection: React.FC<TestPreparationSectionProps> = ({
  preparationNotes,
  onPreparationNotesChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="preparation_notes">Подготовка к анализам</Label>
      <Textarea
        id="preparation_notes"
        value={preparationNotes}
        onChange={(e) => onPreparationNotesChange(e.target.value)}
        placeholder="Каждую инструкцию с новой строки, например:&#10;Натощак (не есть 8-12 часов)&#10;Исключить алкоголь за 24 часа&#10;Исключить физические нагрузки за 24 часа"
        rows={4}
      />
    </div>
  );
};

export default TestPreparationSection;
