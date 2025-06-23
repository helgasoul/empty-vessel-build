
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCreateAutomationWorkflow } from '@/hooks/useAutomationWorkflows';
import { AutomationWorkflow } from '@/hooks/useAutomationWorkflows';
import { Calendar, Activity, Target, Zap, Settings } from 'lucide-react';

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    workflow_name: '',
    workflow_description: '',
    workflow_type: '' as AutomationWorkflow['workflow_type'],
    trigger_type: '' as AutomationWorkflow['trigger_type'],
    cycle_phase_awareness: false,
    hormonal_adaptation: false,
    age_related_customization: false,
    life_stage_adaptation: false,
  });

  const createWorkflow = useCreateAutomationWorkflow();

  const workflowTypes = [
    { value: 'cycle_support', label: 'Поддержка цикла', icon: Calendar },
    { value: 'screening_automation', label: 'Автоматизация скрининга', icon: Activity },
    { value: 'pregnancy_support', label: 'Поддержка беременности', icon: Target },
    { value: 'menopause_support', label: 'Поддержка менопаузы', icon: Zap },
    { value: 'contraception_management', label: 'Управление контрацепцией', icon: Settings },
  ];

  const triggerTypes = [
    { value: 'cycle_phase_change', label: 'Смена фазы цикла' },
    { value: 'schedule', label: 'По расписанию' },
    { value: 'user_goal_set', label: 'Постановка цели' },
    { value: 'health_data_change', label: 'Изменение данных здоровья' },
    { value: 'pregnancy_confirmed', label: 'Подтверждение беременности' },
    { value: 'menopause_transition_detected', label: 'Обнаружен переход к менопаузе' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.workflow_name || !formData.workflow_type || !formData.trigger_type) {
      return;
    }

    try {
      await createWorkflow.mutateAsync({
        ...formData,
        trigger_conditions: {},
        actions: [],
      });
      
      // Reset form
      setFormData({
        workflow_name: '',
        workflow_description: '',
        workflow_type: '' as AutomationWorkflow['workflow_type'],
        trigger_type: '' as AutomationWorkflow['trigger_type'],
        cycle_phase_awareness: false,
        hormonal_adaptation: false,
        age_related_customization: false,
        life_stage_adaptation: false,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Создать новый workflow</DialogTitle>
          <DialogDescription>
            Настройте автоматизацию для поддержки вашего здоровья
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workflow_name">Название workflow</Label>
              <Input
                id="workflow_name"
                placeholder="Например, Поддержка менструального цикла"
                value={formData.workflow_name}
                onChange={(e) => setFormData(prev => ({ ...prev, workflow_name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflow_description">Описание (опционально)</Label>
              <Textarea
                id="workflow_description"
                placeholder="Описание того, что делает этот workflow..."
                value={formData.workflow_description}
                onChange={(e) => setFormData(prev => ({ ...prev, workflow_description: e.target.value }))}
              />
            </div>
          </div>

          {/* Workflow Type */}
          <div className="space-y-2">
            <Label>Тип workflow</Label>
            <Select
              value={formData.workflow_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, workflow_type: value as AutomationWorkflow['workflow_type'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип workflow" />
              </SelectTrigger>
              <SelectContent>
                {workflowTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Trigger Type */}
          <div className="space-y-2">
            <Label>Триггер запуска</Label>
            <Select
              value={formData.trigger_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, trigger_type: value as AutomationWorkflow['trigger_type'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите триггер" />
              </SelectTrigger>
              <SelectContent>
                {triggerTypes.map((trigger) => (
                  <SelectItem key={trigger.value} value={trigger.value}>
                    {trigger.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Features */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Продвинутые функции</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cycle_phase_awareness">Учет фазы цикла</Label>
                  <p className="text-sm text-gray-500">
                    Адаптация рекомендаций под текущую фазу менструального цикла
                  </p>
                </div>
                <Switch
                  id="cycle_phase_awareness"
                  checked={formData.cycle_phase_awareness}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, cycle_phase_awareness: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hormonal_adaptation">Гормональная адаптация</Label>
                  <p className="text-sm text-gray-500">
                    Учет гормональных изменений при выборе действий
                  </p>
                </div>
                <Switch
                  id="hormonal_adaptation"
                  checked={formData.hormonal_adaptation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hormonal_adaptation: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="age_related_customization">Возрастная адаптация</Label>
                  <p className="text-sm text-gray-500">
                    Персонализация с учетом возрастных особенностей
                  </p>
                </div>
                <Switch
                  id="age_related_customization"
                  checked={formData.age_related_customization}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, age_related_customization: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="life_stage_adaptation">Адаптация к жизненному этапу</Label>
                  <p className="text-sm text-gray-500">
                    Учет текущего жизненного этапа (подростковый, репродуктивный, менопауза)
                  </p>
                </div>
                <Switch
                  id="life_stage_adaptation"
                  checked={formData.life_stage_adaptation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, life_stage_adaptation: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createWorkflow.isPending}>
              {createWorkflow.isPending ? 'Создание...' : 'Создать workflow'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkflowModal;
