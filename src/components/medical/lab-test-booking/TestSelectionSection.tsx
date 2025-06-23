
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TestSelectionSectionProps {
  testCode: string;
  testName: string;
  onTestCodeChange: (value: string) => void;
  onTestNameChange: (value: string) => void;
  onCommonTestSelect: (testCode: string) => void;
}

const commonTests = [
  { code: 'HORMONES_BASIC', name: 'Базовая панель гормонов', category: 'hormones' },
  { code: 'THYROID_PANEL', name: 'Гормоны щитовидной железы', category: 'hormones' },
  { code: 'REPRODUCTIVE_HORMONES', name: 'Репродуктивные гормоны', category: 'hormones' },
  { code: 'ONCO_MARKERS_F', name: 'Онкомаркеры (женские)', category: 'oncology_markers' },
  { code: 'MICROBIOME_VAGINAL', name: 'Микробиом влагалища', category: 'microbiome' },
  { code: 'GENETIC_BRCA', name: 'Генетический тест BRCA1/BRCA2', category: 'genetics' },
  { code: 'GENERAL_BLOOD', name: 'Общий анализ крови', category: 'general' },
  { code: 'BIOCHEMISTRY', name: 'Биохимический анализ крови', category: 'general' },
];

const TestSelectionSection: React.FC<TestSelectionSectionProps> = ({
  testCode,
  testName,
  onTestCodeChange,
  onTestNameChange,
  onCommonTestSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="common_tests">Выберите анализ</Label>
        <Select onValueChange={onCommonTestSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите из часто назначаемых анализов" />
          </SelectTrigger>
          <SelectContent>
            {commonTests.map((test) => (
              <SelectItem key={test.code} value={test.code}>
                {test.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="test_code">Код анализа</Label>
          <Input
            id="test_code"
            value={testCode}
            onChange={(e) => onTestCodeChange(e.target.value)}
            placeholder="Например: HORMONES_BASIC"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test_name">Название анализа</Label>
          <Input
            id="test_name"
            value={testName}
            onChange={(e) => onTestNameChange(e.target.value)}
            placeholder="Например: Базовая панель гормонов"
            required
          />
        </div>
      </div>
    </div>
  );
};

export { commonTests };
export default TestSelectionSection;
