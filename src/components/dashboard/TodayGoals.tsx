
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Plus, 
  Droplets, 
  Apple, 
  CheckCircle2,
  Clock,
  Utensils
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  type: 'water' | 'nutrition' | 'exercise' | 'sleep';
  title: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  addedAt: Date;
}

const TodayGoals = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      type: 'water',
      title: 'Выпить воды',
      target: 8,
      current: 3,
      unit: 'стаканов',
      icon: <Droplets className="w-5 h-5 text-blue-500" />
    },
    {
      id: '2',
      type: 'nutrition',
      title: 'Калории',
      target: 2000,
      current: 850,
      unit: 'ккал',
      icon: <Apple className="w-5 h-5 text-green-500" />
    },
    {
      id: '3',
      type: 'exercise',
      title: 'Шаги',
      target: 10000,
      current: 4200,
      unit: 'шагов',
      icon: <Target className="w-5 h-5 text-orange-500" />
    }
  ]);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [waterGlasses, setWaterGlasses] = useState(3);

  // Диалоги
  const [isWaterDialogOpen, setIsWaterDialogOpen] = useState(false);
  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);

  // Формы
  const [waterAmount, setWaterAmount] = useState('1');
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodCategory, setFoodCategory] = useState('');

  const addWater = () => {
    const amount = parseInt(waterAmount);
    if (amount > 0) {
      const newWaterCount = waterGlasses + amount;
      setWaterGlasses(newWaterCount);
      
      setGoals(prev => prev.map(goal => 
        goal.type === 'water' 
          ? { ...goal, current: newWaterCount }
          : goal
      ));

      toast({
        title: "Вода добавлена!",
        description: `Добавлено ${amount} ${amount === 1 ? 'стакан' : 'стаканов'} воды`,
      });

      setWaterAmount('1');
      setIsWaterDialogOpen(false);
    }
  };

  const addFood = () => {
    if (foodName && foodCalories) {
      const calories = parseInt(foodCalories);
      const newFood: FoodItem = {
        id: Date.now().toString(),
        name: foodName,
        calories: calories,
        addedAt: new Date()
      };

      setFoodItems(prev => [...prev, newFood]);

      setGoals(prev => prev.map(goal => 
        goal.type === 'nutrition' 
          ? { ...goal, current: goal.current + calories }
          : goal
      ));

      toast({
        title: "Продукт добавлен!",
        description: `${foodName} (${calories} ккал) добавлен в дневник питания`,
      });

      setFoodName('');
      setFoodCalories('');
      setFoodCategory('');
      setIsFoodDialogOpen(false);
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const formatProgress = (current: number, target: number, unit: string) => {
    if (unit === 'ккал') {
      return `${current.toLocaleString()} / ${target.toLocaleString()} ${unit}`;
    }
    return `${current} / ${target} ${unit}`;
  };

  return (
    <Card className="prevent-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Ваши цели на сегодня
        </CardTitle>
        <CardDescription>
          Отслеживайте прогресс по ключевым показателям здоровья
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const isCompleted = goal.current >= goal.target;
          
          return (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {goal.icon}
                  <div>
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <p className="text-sm text-gray-600">
                      {formatProgress(goal.current, goal.target, goal.unit)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <Badge variant={isCompleted ? "default" : "secondary"}>
                    {Math.round(percentage)}%
                  </Badge>
                </div>
              </div>
              
              <Progress 
                value={percentage} 
                className="h-2"
              />
            </div>
          );
        })}

        {/* Кнопки быстрых действий */}
        <div className="pt-4 border-t border-gray-200">
          <h5 className="font-medium text-gray-900 mb-3">Быстрые действия</h5>
          <div className="flex gap-2 flex-wrap">
            {/* Кнопка добавления воды */}
            <Dialog open={isWaterDialogOpen} onOpenChange={setIsWaterDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                >
                  <Droplets className="w-4 h-4 text-blue-500" />
                  Добавить воду
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    Добавить воду
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="water-amount">Количество стаканов</Label>
                    <Select value={waterAmount} onValueChange={setWaterAmount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 стакан (250 мл)</SelectItem>
                        <SelectItem value="2">2 стакана (500 мл)</SelectItem>
                        <SelectItem value="3">3 стакана (750 мл)</SelectItem>
                        <SelectItem value="4">4 стакана (1 л)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addWater} className="flex-1">
                      Добавить
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsWaterDialogOpen(false)}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Кнопка добавления продукта */}
            <Dialog open={isFoodDialogOpen} onOpenChange={setIsFoodDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200"
                >
                  <Apple className="w-4 h-4 text-green-500" />
                  Добавить продукт
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Apple className="w-5 h-5 text-green-500" />
                    Добавить продукт
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="food-name">Название продукта</Label>
                    <Input
                      id="food-name"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      placeholder="Например: Овсяная каша"
                    />
                  </div>
                  <div>
                    <Label htmlFor="food-calories">Калории</Label>
                    <Input
                      id="food-calories"
                      type="number"
                      value={foodCalories}
                      onChange={(e) => setFoodCalories(e.target.value)}
                      placeholder="Например: 350"
                    />
                  </div>
                  <div>
                    <Label htmlFor="food-category">Категория</Label>
                    <Select value={foodCategory} onValueChange={setFoodCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Завтрак</SelectItem>
                        <SelectItem value="lunch">Обед</SelectItem>
                        <SelectItem value="dinner">Ужин</SelectItem>
                        <SelectItem value="snack">Перекус</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={addFood}
                      className="flex-1"
                      disabled={!foodName || !foodCalories}
                    >
                      Добавить
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsFoodDialogOpen(false)}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-200"
            >
              <Clock className="w-4 h-4 text-purple-500" />
              Записать симптомы
            </Button>
          </div>
        </div>

        {/* Последние добавленные продукты */}
        {foodItems.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Последние продукты
            </h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {foodItems.slice(-3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{item.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {item.calories} ккал
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayGoals;
