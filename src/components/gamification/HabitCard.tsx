
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Flame, Target, Calendar } from "lucide-react";
import { HealthHabit, useCompleteHabit } from "@/hooks/useHealthHabits";

interface HabitCardProps {
  habit: HealthHabit;
}

const HabitCard = ({ habit }: HabitCardProps) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const completeHabit = useCompleteHabit();

  const handleComplete = () => {
    completeHabit.mutate({ 
      habitId: habit.id, 
      notes: notes.trim() || undefined 
    });
    setShowNotes(false);
    setNotes('');
  };

  const getHabitTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'weekly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'custom':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHabitTypeName = (type: string) => {
    switch (type) {
      case 'daily':
        return 'Ежедневно';
      case 'weekly':
        return 'Еженедельно';
      case 'custom':
        return 'Особый режим';
      default:
        return type;
    }
  };

  const streakPercentage = Math.min(((habit.current_streak || 0) / 30) * 100, 100);

  return (
    <Card className="prevent-card hover:shadow-md transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="font-montserrat">{habit.habit_name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getHabitTypeColor(habit.habit_type)}>
                {getHabitTypeName(habit.habit_type)}
              </Badge>
              <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                +{habit.points_per_completion || 10} очков
              </Badge>
            </div>
          </div>
          <Button
            onClick={() => setShowNotes(true)}
            disabled={completeHabit.isPending}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Выполнить
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">Серия</span>
              </div>
              <div className="text-lg font-semibold">{habit.current_streak || 0}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Лучшая</span>
              </div>
              <div className="text-lg font-semibold">{habit.best_streak || 0}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Всего</span>
              </div>
              <div className="text-lg font-semibold">{habit.total_completions || 0}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Прогресс серии (30 дней)</span>
              <span>{habit.current_streak || 0}/30</span>
            </div>
            <Progress value={streakPercentage} className="h-2" />
          </div>
        </div>

        {showNotes && (
          <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-700">
              Добавить заметку (необязательно):
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Как прошло выполнение привычки сегодня?"
              className="min-h-[80px]"
            />
            <div className="flex space-x-2">
              <Button 
                onClick={handleComplete}
                disabled={completeHabit.isPending}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                {completeHabit.isPending ? 'Сохранение...' : 'Подтвердить'}
              </Button>
              <Button 
                onClick={() => setShowNotes(false)}
                variant="outline"
                size="sm"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;
