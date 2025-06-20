
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target, 
  Plus, 
  Droplets, 
  Apple, 
  CheckCircle2,
  Clock,
  Utensils,
  Activity,
  Heart,
  Moon,
  TrendingUp,
  Calendar,
  Edit3,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  type: 'water' | 'nutrition' | 'exercise' | 'sleep' | 'meditation' | 'custom';
  title: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  isCompleted?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  action: () => void;
  icon: React.ReactNode;
  color: string;
}

const EnhancedTodayGoals = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      type: 'water',
      title: 'Выпить воды',
      target: 8,
      current: 3,
      unit: 'стаканов',
      icon: <Droplets className="w-5 h-5" />,
      color: 'text-blue-500'
    },
    {
      id: '2',
      type: 'nutrition',
      title: 'Калории',
      target: 2000,
      current: 850,
      unit: 'ккал',
      icon: <Apple className="w-5 h-5" />,
      color: 'text-green-500'
    },
    {
      id: '3',
      type: 'exercise',
      title: 'Шаги',
      target: 10000,
      current: 4200,
      unit: 'шагов',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-orange-500'
    },
    {
      id: '4',
      type: 'sleep',
      title: 'Сон',
      target: 8,
      current: 0,
      unit: 'часов',
      icon: <Moon className="w-5 h-5" />,
      color: 'text-purple-500'
    }
  ]);

  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', type: 'custom', unit: '' });

  // Быстрые действия для обновления целей
  const quickActions: QuickAction[] = [
    {
      id: 'water',
      label: '+1 стакан воды',
      action: () => updateGoal('1', 1),
      icon: <Droplets className="w-4 h-4" />,
      color: 'bg-blue-500'
    },
    {
      id: 'steps',
      label: '+1000 шагов',
      action: () => updateGoal('3', 1000),
      icon: <Activity className="w-4 h-4" />,
      color: 'bg-orange-500'
    },
    {
      id: 'meal',
      label: 'Добавить прием пищи',
      action: () => toast({ title: "Открыть дневник питания", description: "Переход к записи приема пищи" }),
      icon: <Utensils className="w-4 h-4" />,
      color: 'bg-green-500'
    },
    {
      id: 'meditation',
      label: '10 мин медитации',
      action: () => addMeditationGoal(),
      icon: <Heart className="w-4 h-4" />,
      color: 'bg-pink-500'
    }
  ];

  const updateGoal = (goalId: string, increment: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + increment, goal.target);
        const isCompleted = newCurrent >= goal.target;
        
        if (isCompleted && !goal.isCompleted) {
          toast({
            title: "🎉 Цель достигнута!",
            description: `Поздравляем! Вы выполнили цель: ${goal.title}`,
          });
        }
        
        return { ...goal, current: newCurrent, isCompleted };
      }
      return goal;
    }));
  };

  const addMeditationGoal = () => {
    const meditationGoal: Goal = {
      id: Date.now().toString(),
      type: 'meditation',
      title: 'Медитация',
      target: 10,
      current: 0,
      unit: 'минут',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-pink-500'
    };
    
    setGoals(prev => [...prev, meditationGoal]);
    toast({
      title: "Цель добавлена!",
      description: "Медитация на 10 минут добавлена в ваши цели",
    });
  };

  const addCustomGoal = () => {
    if (newGoal.title && newGoal.target && newGoal.unit) {
      const customGoal: Goal = {
        id: Date.now().toString(),
        type: 'custom',
        title: newGoal.title,
        target: parseInt(newGoal.target),
        current: 0,
        unit: newGoal.unit,
        icon: <Target className="w-5 h-5" />,
        color: 'text-indigo-500'
      };
      
      setGoals(prev => [...prev, customGoal]);
      setNewGoal({ title: '', target: '', type: 'custom', unit: '' });
      setIsAddGoalDialogOpen(false);
      
      toast({
        title: "Цель добавлена!",
        description: `${customGoal.title} добавлена в ваши цели на сегодня`,
      });
    }
  };

  const removeGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Цель удалена",
      description: "Цель успешно удалена из списка",
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const totalProgress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

  return (
    <Card className="prevent-card-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-lg">Ваши цели на сегодня</CardTitle>
              <CardDescription>
                {completedGoals} из {goals.length} целей выполнено
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={totalProgress === 100 ? "default" : "secondary"} className="font-medium">
              {Math.round(totalProgress)}%
            </Badge>
            
            <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="prevent-button-soft">
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Добавить новую цель</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal-title">Название цели</Label>
                    <Input
                      id="goal-title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Например: Выпить зеленый чай"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goal-target">Цель</Label>
                      <Input
                        id="goal-target"
                        type="number"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-unit">Единица</Label>
                      <Input
                        id="goal-unit"
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="чашек"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={addCustomGoal}
                      className="flex-1"
                      disabled={!newGoal.title || !newGoal.target || !newGoal.unit}
                    >
                      Добавить цель
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddGoalDialogOpen(false)}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Общий прогресс */}
        <div className="mt-4">
          <Progress value={totalProgress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Список целей */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            
            return (
              <div key={goal.id} className="group relative">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-purple-100/50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`${goal.color} bg-opacity-10 p-2 rounded-lg`}>
                      {goal.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">
                        {goal.current} / {goal.target} {goal.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {goal.isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    <Badge variant={goal.isCompleted ? "default" : "secondary"}>
                      {Math.round(percentage)}%
                    </Badge>
                    
                    {goal.type === 'custom' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                        onClick={() => removeGoal(goal.id)}
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <Progress 
                  value={percentage} 
                  className="h-1 mt-2"
                />
              </div>
            );
          })}
        </div>

        {/* Быстрые действия */}
        <div className="pt-4 border-t border-gray-200/50">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Быстрые действия
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="justify-start h-auto p-3 text-left hover:shadow-md transition-all"
                onClick={action.action}
              >
                <div className={`w-6 h-6 ${action.color} rounded-md flex items-center justify-center mr-2 shrink-0`}>
                  {React.cloneElement(action.icon as React.ReactElement, { className: "w-3 h-3 text-white" })}
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Статистика дня */}
        <div className="pt-4 border-t border-gray-200/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{completedGoals}</div>
              <div className="text-xs text-gray-600">Выполнено</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{goals.length - completedGoals}</div>
              <div className="text-xs text-gray-600">В процессе</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{Math.round(totalProgress)}%</div>
              <div className="text-xs text-gray-600">Общий прогресс</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTodayGoals;
