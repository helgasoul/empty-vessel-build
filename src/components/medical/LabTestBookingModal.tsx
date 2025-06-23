
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateLabTest } from '@/hooks/useMedicalPartners';
import { TestTube, Calendar, FileText, AlertTriangle } from 'lucide-react';

interface LabTestBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: any;
}

const LabTestBookingModal: React.FC<LabTestBookingModalProps> = ({
  open,
  onOpenChange,
  partner
}) => {
  const [formData, setFormData] = useState({
    test_code: '',
    test_name: '',
    test_category: 'general',
    collection_date: '',
    collection_time: '',
    optimal_cycle_phase: '',
    cost: '',
    preparation_instructions: [] as string[],
  });

  const [preparationNotes, setPreparationNotes] = useState('');

  const createLabTest = useCreateLabTest();

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

  const handleTestSelect = (testCode: string) => {
    const selectedTest = commonTests.find(t => t.code === testCode);
    if (selectedTest) {
      setFormData(prev => ({
        ...prev,
        test_code: selectedTest.code,
        test_name: selectedTest.name,
        test_category: selectedTest.category,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const preparationInstructions = preparationNotes
      .split('\n')
      .filter(note => note.trim())
      .map(note => note.trim());

    try {
      await createLabTest.mutateAsync({
        ...formData,
        partner_id: partner?.id,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        preparation_instructions: preparationInstructions,
        preparation_completed: false,
        results: {},
        reference_ranges: {},
      });
      
      onOpenChange(false);
      setFormData({
        test_code: '',
        test_name: '',
        test_category: 'general',
        collection_date: '',
        collection_time: '',
        optimal_cycle_phase: '',
        cost: '',
        preparation_instructions: [],
      });
      setPreparationNotes('');
    } catch (error) {
      console.error('Error creating lab test:', error);
    }
  };

  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Запись на анализы в {partner.partner_name}
          </DialogTitle>
          <DialogDescription>
            Выберите анализы и запланируйте сдачу
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="common_tests">Выберите анализ</Label>
            <Select onValueChange={handleTestSelect}>
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
                value={formData.test_code}
                onChange={(e) => setFormData(prev => ({ ...prev, test_code: e.target.value }))}
                placeholder="Например: HORMONES_BASIC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="test_name">Название анализа</Label>
              <Input
                id="test_name"
                value={formData.test_name}
                onChange={(e) => setFormData(prev => ({ ...prev, test_name: e.target.value }))}
                placeholder="Например: Базовая панель гормонов"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="test_category">Категория</Label>
              <Select 
                value={formData.test_category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, test_category: value }))}
              >
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
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection_date">Дата сдачи</Label>
              <Input
                id="collection_date"
                type="date"
                value={formData.collection_date}
                onChange={(e) => setFormData(prev => ({ ...prev, collection_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection_time">Время сдачи</Label>
              <Input
                id="collection_time"
                type="time"
                value={formData.collection_time}
                onChange={(e) => setFormData(prev => ({ ...prev, collection_time: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="optimal_cycle_phase">Оптимальная фаза цикла (для гормональных анализов)</Label>
            <Select 
              value={formData.optimal_cycle_phase} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, optimal_cycle_phase: value }))}
            >
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

          <div className="space-y-2">
            <Label htmlFor="preparation_notes">Подготовка к анализам</Label>
            <Textarea
              id="preparation_notes"
              value={preparationNotes}
              onChange={(e) => setPreparationNotes(e.target.value)}
              placeholder="Каждую инструкцию с новой строки, например:&#10;Натощак (не есть 8-12 часов)&#10;Исключить алкоголь за 24 часа&#10;Исключить физические нагрузки за 24 часа"
              rows={4}
            />
          </div>

          {formData.test_category === 'hormones' && (
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
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createLabTest.isPending}>
              {createLabTest.isPending ? 'Планирую...' : 'Запланировать анализ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LabTestBookingModal;
