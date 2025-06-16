
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateHealthHabit } from "@/hooks/useHealthHabits";

interface CreateHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateHabitModal = ({ open, onOpenChange }: CreateHabitModalProps) => {
  const [habitName, setHabitName] = useState('');
  const [habitType, setHabitType] = useState<string>('');
  const [targetFrequency, setTargetFrequency] = useState('1');
  const [pointsPerCompletion, setPointsPerCompletion] = useState('10');

  const createHabit = useCreateHealthHabit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habitName.trim() || !habitType) {
      return;
    }

    createHabit.mutate({
      habit_name: habitName.trim(),
      habit_type: habitType,
      target_frequency: parseInt(targetFrequency),
      points_per_completion: parseInt(pointsPerCompletion),
      is_active: true,
    });

    // Reset form
    setHabitName('');
    setHabitType('');
    setTargetFrequency('1');
    setPointsPerCompletion('10');
    onOpenChange(false);
  };

  const habitSuggestions = [
    'Выпить 8 стаканов воды',
    'Пройти 10000 шагов',
    'Медитировать 10 минут',
    'Принять витамины',
    'Сделать утреннюю зарядку',
    'Записать в дневник настроения',
    'Съесть 5 порций овощей и фруктов',
    'Спать 8 часов',
    'Прочитать 30 минут',
    'Сделать дыхательные упражнения',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Создать новую привычку</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Название привычки</Label>
            <Input
              id="habit-name"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Например: Выпить 8 стаканов воды"
              required
            />
            <div className="text-xs text-gray-500">
              Предложения: {habitSuggestions.slice(0, 3).join(', ')}...
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="habit-type">Тип привычки</Label>
            <Select value={habitType} onValueChange={setHabitType} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Ежедневная</SelectItem>
                <SelectItem value="weekly">Еженедельная</SelectItem>
                <SelectItem value="custom">Особый режим</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-frequency">Цель (раз в период)</Label>
              <Input
                id="target-frequency"
                type="number"
                min="1"
                max="10"
                value={targetFrequency}
                onChange={(e) => setTargetFrequency(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Очки за выполнение</Label>
              <Input
                id="points"
                type="number"
                min="1"
                max="100"
                value={pointsPerCompletion}
                onChange={(e) => setPointsPerCompletion(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              disabled={createHabit.isPending || !habitName.trim() || !habitType}
              className="flex-1"
            >
              {createHabit.isPending ? 'Создание...' : 'Создать привычку'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHabitModal;
