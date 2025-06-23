
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useUpdateAutomationWorkflow } from '@/hooks/useAutomationWorkflows';
import { AutomationWorkflow } from '@/hooks/useAutomationWorkflows';
import { Play, Pause, MoreHorizontal, Calendar, Zap, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface WorkflowCardProps {
  workflow: AutomationWorkflow;
  getTypeIcon: (type: string) => React.ReactNode;
  getTypeLabel: (type: string) => string;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ 
  workflow, 
  getTypeIcon, 
  getTypeLabel 
}) => {
  const updateWorkflow = useUpdateAutomationWorkflow();

  const handleToggleStatus = async (checked: boolean) => {
    await updateWorkflow.mutateAsync({
      id: workflow.id,
      updates: {
        workflow_status: checked ? 'active' : 'inactive'
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, label: 'Активен', className: 'bg-green-100 text-green-800' },
      inactive: { variant: 'secondary' as const, label: 'Неактивен', className: 'bg-gray-100 text-gray-600' },
      paused: { variant: 'default' as const, label: 'Приостановлен', className: 'bg-yellow-100 text-yellow-800' },
      error: { variant: 'destructive' as const, label: 'Ошибка', className: 'bg-red-100 text-red-800' }
    };

    const config = variants[status as keyof typeof variants] || variants.inactive;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getTriggerLabel = (triggerType: string) => {
    const labels = {
      cycle_phase_change: 'Смена фазы цикла',
      schedule: 'По расписанию',
      user_goal_set: 'Постановка цели',
      health_data_change: 'Изменение данных здоровья',
      pregnancy_confirmed: 'Подтверждение беременности',
      menopause_transition_detected: 'Обнаружен переход к менопаузе'
    };
    return labels[triggerType as keyof typeof labels] || triggerType;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getTypeIcon(workflow.workflow_type)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{workflow.workflow_name}</CardTitle>
              <CardDescription className="mt-1">
                {workflow.workflow_description || 'Нет описания'}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {getTypeLabel(workflow.workflow_type)}
                </Badge>
                {getStatusBadge(workflow.workflow_status)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={workflow.workflow_status === 'active'}
              onCheckedChange={handleToggleStatus}
              disabled={updateWorkflow.isPending}
            />
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Trigger Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="w-4 h-4" />
            <span>Триггер: {getTriggerLabel(workflow.trigger_type)}</span>
          </div>

          {/* Execution Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Выполнений</p>
              <p className="font-medium">{workflow.execution_count}</p>
            </div>
            <div>
              <p className="text-gray-600">Успешность</p>
              <p className="font-medium">{(workflow.success_rate * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-gray-600">Ошибки</p>
              <p className="font-medium">{workflow.total_errors}</p>
            </div>
          </div>

          {/* Last Execution */}
          {workflow.last_execution && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Последнее выполнение: {format(new Date(workflow.last_execution), 'dd.MM.yyyy HH:mm', { locale: ru })}
              </span>
            </div>
          )}

          {/* Advanced Features */}
          <div className="flex flex-wrap gap-2">
            {workflow.cycle_phase_awareness && (
              <Badge variant="outline" className="text-xs">
                Учет фазы цикла
              </Badge>
            )}
            {workflow.hormonal_adaptation && (
              <Badge variant="outline" className="text-xs">
                Гормональная адаптация
              </Badge>
            )}
            {workflow.age_related_customization && (
              <Badge variant="outline" className="text-xs">
                Возрастная адаптация
              </Badge>
            )}
            {workflow.life_stage_adaptation && (
              <Badge variant="outline" className="text-xs">
                Адаптация к жизненному этапу
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Настроить
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="w-4 h-4" />
              Запустить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;
