
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAutomationWorkflows, useWorkflowExecutions, useAutomationUserSettings } from '@/hooks/useAutomationWorkflows';
import { Settings, Play, Pause, Plus, Activity, Calendar, Target, Zap } from 'lucide-react';
import CreateWorkflowModal from './CreateWorkflowModal';
import WorkflowCard from './WorkflowCard';
import AutomationSettings from './AutomationSettings';
import ExecutionHistory from './ExecutionHistory';

const AutomationDashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('workflows');
  
  const { data: workflows, isLoading: workflowsLoading } = useAutomationWorkflows();
  const { data: executions, isLoading: executionsLoading } = useWorkflowExecutions();
  const { data: settings } = useAutomationUserSettings();

  const activeWorkflows = workflows?.filter(w => w.workflow_status === 'active') || [];
  const totalExecutions = executions?.length || 0;
  const successfulExecutions = executions?.filter(e => e.execution_status === 'completed').length || 0;
  const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

  const getWorkflowTypeIcon = (type: string) => {
    switch (type) {
      case 'cycle_support': return <Calendar className="w-4 h-4" />;
      case 'screening_automation': return <Activity className="w-4 h-4" />;
      case 'pregnancy_support': return <Target className="w-4 h-4" />;
      case 'menopause_support': return <Zap className="w-4 h-4" />;
      case 'contraception_management': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getWorkflowTypeLabel = (type: string) => {
    const labels = {
      cycle_support: 'Поддержка цикла',
      screening_automation: 'Автоматизация скрининга',
      pregnancy_support: 'Поддержка беременности',
      menopause_support: 'Поддержка менопаузы',
      contraception_management: 'Управление контрацепцией'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (workflowsLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-text-primary">
            Автоматизация здоровья
          </h1>
          <p className="text-text-secondary mt-2">
            Умные workflow для поддержки женского здоровья
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Создать workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего workflow</p>
                <p className="text-2xl font-bold">{workflows?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Активные</p>
                <p className="text-2xl font-bold">{activeWorkflows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Выполнений</p>
                <p className="text-2xl font-bold">{totalExecutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Успешность</p>
                <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflow</TabsTrigger>
          <TabsTrigger value="executions">История выполнений</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {!workflows || workflows.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Нет автоматизированных workflow
                </h3>
                <p className="text-gray-500 text-center mb-4">
                  Создайте первый workflow для автоматизации задач по здоровью
                </p>
                <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Создать workflow
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {workflows.map((workflow) => (
                <WorkflowCard 
                  key={workflow.id} 
                  workflow={workflow}
                  getTypeIcon={getWorkflowTypeIcon}
                  getTypeLabel={getWorkflowTypeLabel}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="executions">
          <ExecutionHistory 
            executions={executions} 
            isLoading={executionsLoading}
          />
        </TabsContent>

        <TabsContent value="settings">
          <AutomationSettings settings={settings} />
        </TabsContent>
      </Tabs>

      {/* Create Workflow Modal */}
      <CreateWorkflowModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default AutomationDashboard;
