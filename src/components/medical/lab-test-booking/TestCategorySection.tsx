
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TestCategory = 'hormones' | 'oncology_markers' | 'genetics' | 'microbiome' | 'general';

interface TestCategorySectionProps {
  testCategory: TestCategory;
  cost: string;
  onTestCategoryChange: (value: TestCategory) => void;
  onCostChange: (value: string) => void;
}

const TestCategorySection: React.FC<TestCategorySectionProps> = ({
  testCategory,
  cost,
  onTestCategoryChange,
  onCostChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="test_category">Категория</Label>
        <Select value={testCategory} onValueChange={onTestCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hormones">Гормоны</SelectItem>
            <SelectItem value="oncology_markers">Онкомаркеры</SelectItem>
            <SelectItem value="genetics">Генетика</SelectItem>
            <SelectItem value="microbiome">Микробиом</SelectItem>
            <SelectItem value="general">Общие анализы</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Стоимость (руб.)</Label>
        <Input
          id="cost"
          type="number"
          min="0"
          step="0.01"
          value={cost}
          onChange={(e) => onCostChange(e.target.value)}
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

export default TestCategorySection;
