
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateLabTest } from '@/hooks/useMedicalPartners';
import { TestTube } from 'lucide-react';
import TestSelectionSection, { commonTests } from './lab-test-booking/TestSelectionSection';
import TestCategorySection from './lab-test-booking/TestCategorySection';
import TestSchedulingSection from './lab-test-booking/TestSchedulingSection';
import CyclePhaseSection from './lab-test-booking/CyclePhaseSection';
import TestPreparationSection from './lab-test-booking/TestPreparationSection';
import HormoneTestTips from './lab-test-booking/HormoneTestTips';

interface LabTestBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: any;
}

type TestCategory = 'hormones' | 'oncology_markers' | 'genetics' | 'microbiome' | 'general';
type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

const LabTestBookingModal: React.FC<LabTestBookingModalProps> = ({
  open,
  onOpenChange,
  partner
}) => {
  const [formData, setFormData] = useState({
    test_code: '',
    test_name: '',
    test_category: 'general' as TestCategory,
    collection_date: '',
    collection_time: '',
    optimal_cycle_phase: '' as CyclePhase | '',
    cost: '',
  });

  const [preparationNotes, setPreparationNotes] = useState('');

  const createLabTest = useCreateLabTest();

  const handleTestSelect = (testCode: string) => {
    const selectedTest = commonTests.find(t => t.code === testCode);
    if (selectedTest) {
      setFormData(prev => ({
        ...prev,
        test_code: selectedTest.code,
        test_name: selectedTest.name,
        test_category: selectedTest.category as TestCategory,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.test_code || !formData.test_name) {
      return;
    }

    const preparationInstructions = preparationNotes
      .split('\n')
      .filter(note => note.trim())
      .map(note => note.trim());

    try {
      await createLabTest.mutateAsync({
        test_code: formData.test_code,
        test_name: formData.test_name,
        test_category: formData.test_category,
        partner_id: partner?.id,
        collection_date: formData.collection_date || undefined,
        collection_time: formData.collection_time || undefined,
        optimal_cycle_phase: formData.optimal_cycle_phase || undefined,
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
      });
      setPreparationNotes('');
    } catch (error) {
      console.error('Error creating lab test:', error);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <TestSelectionSection
            testCode={formData.test_code}
            testName={formData.test_name}
            onTestCodeChange={(value) => updateFormData('test_code', value)}
            onTestNameChange={(value) => updateFormData('test_name', value)}
            onCommonTestSelect={handleTestSelect}
          />

          <TestCategorySection
            testCategory={formData.test_category}
            cost={formData.cost}
            onTestCategoryChange={(value) => updateFormData('test_category', value)}
            onCostChange={(value) => updateFormData('cost', value)}
          />

          <TestSchedulingSection
            collectionDate={formData.collection_date}
            collectionTime={formData.collection_time}
            onCollectionDateChange={(value) => updateFormData('collection_date', value)}
            onCollectionTimeChange={(value) => updateFormData('collection_time', value)}
          />

          <CyclePhaseSection
            optimalCyclePhase={formData.optimal_cycle_phase}
            onOptimalCyclePhaseChange={(value) => updateFormData('optimal_cycle_phase', value)}
          />

          <TestPreparationSection
            preparationNotes={preparationNotes}
            onPreparationNotesChange={setPreparationNotes}
          />

          <HormoneTestTips testCategory={formData.test_category} />

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
