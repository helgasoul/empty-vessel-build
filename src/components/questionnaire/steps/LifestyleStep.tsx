
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LifestyleData } from '../../../types/health';

interface LifestyleStepProps {
  data?: LifestyleData;
  onComplete: (data: LifestyleData) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<LifestyleData>({
    smoking: { status: 'never', packYears: null, quitDate: null },
    alcohol: { frequency: 'monthly', drinksPerWeek: 2 },
    exercise: { frequency: 'weekly', intensity: 'moderate', types: [], minutesPerWeek: 150 },
    diet: { type: 'standard', supplements: [], waterIntake: 8 },
    stress: { level: 5, sources: [], copingMethods: [] },
    work: { type: 'office', stressLevel: 5, chemicalExposure: false, nightShifts: false },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  const updateSmoking = (field: keyof typeof formData.smoking, value: any) => {
    setFormData(prev => ({
      ...prev,
      smoking: { ...prev.smoking, [field]: value }
    }));
  };

  const updateAlcohol = (field: keyof typeof formData.alcohol, value: any) => {
    setFormData(prev => ({
      ...prev,
      alcohol: { ...prev.alcohol, [field]: value }
    }));
  };

  const updateExercise = (field: keyof typeof formData.exercise, value: any) => {
    setFormData(prev => ({
      ...prev,
      exercise: { ...prev.exercise, [field]: value }
    }));
  };

  const updateDiet = (field: keyof typeof formData.diet, value: any) => {
    setFormData(prev => ({
      ...prev,
      diet: { ...prev.diet, [field]: value }
    }));
  };

  const updateStress = (field: keyof typeof formData.stress, value: any) => {
    setFormData(prev => ({
      ...prev,
      stress: { ...prev.stress, [field]: value }
    }));
  };

  const updateWork = (field: keyof typeof formData.work, value: any) => {
    setFormData(prev => ({
      ...prev,
      work: { ...prev.work, [field]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Курение */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Курение</CardTitle>
            <CardDescription>История курения и текущие привычки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Курение</Label>
              <RadioGroup
                value={formData.smoking.status}
                onValueChange={(value) => updateSmoking('status', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="neverSmoked" />
                  <Label htmlFor="neverSmoked">Никогда не курила</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="former" id="formerSmoker" />
                  <Label htmlFor="formerSmoker">Раньше курила, бросила</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="currentSmoker" />
                  <Label htmlFor="currentSmoker">Курю в настоящее время</Label>
                </div>
              </RadioGroup>
            </div>

            {(formData.smoking.status === 'former' || formData.smoking.status === 'current') && (
              <div className="space-y-2">
                <Label htmlFor="packYears">Стаж курения (пачко-лет)</Label>
                <Input
                  id="packYears"
                  type="number"
                  value={formData.smoking.packYears || ''}
                  onChange={(e) => updateSmoking('packYears', e.target.value ? parseFloat(e.target.value) : null)}
                  step="0.5"
                  min="0"
                  max="100"
                  placeholder="10"
                />
                <span className="text-sm text-gray-500">Количество пачек в день × количество лет</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Алкоголь */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Употребление алкоголя</CardTitle>
            <CardDescription>Частота и количество употребления алкоголя</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Частота употребления</Label>
              <RadioGroup
                value={formData.alcohol.frequency}
                onValueChange={(value) => updateAlcohol('frequency', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="neverDrink" />
                  <Label htmlFor="neverDrink">Никогда</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Несколько раз в месяц</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Несколько раз в неделю</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Ежедневно</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.alcohol.frequency !== 'never' && (
              <div className="space-y-2">
                <Label htmlFor="drinksPerWeek">Количество порций в неделю</Label>
                <Input
                  id="drinksPerWeek"
                  type="number"
                  value={formData.alcohol.drinksPerWeek}
                  onChange={(e) => updateAlcohol('drinksPerWeek', parseInt(e.target.value) || 0)}
                  min="0"
                  max="50"
                  placeholder="2"
                />
                <span className="text-sm text-gray-500">1 порция = 1 бокал вина / 0.5л пива / 50мл крепкого алкоголя</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Физическая активность */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Физическая активность</CardTitle>
            <CardDescription>Регулярность и интенсивность тренировок</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Частота тренировок</Label>
              <RadioGroup
                value={formData.exercise.frequency}
                onValueChange={(value) => updateExercise('frequency', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="neverExercise" />
                  <Label htmlFor="neverExercise">Не тренируюсь</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rarely" id="rarelyExercise" />
                  <Label htmlFor="rarelyExercise">Редко (меньше 1 раза в неделю)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weeklyExercise" />
                  <Label htmlFor="weeklyExercise">1-3 раза в неделю</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="dailyExercise" />
                  <Label htmlFor="dailyExercise">Почти ежедневно</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.exercise.frequency !== 'never' && (
              <>
                <div className="space-y-3">
                  <Label>Интенсивность</Label>
                  <RadioGroup
                    value={formData.exercise.intensity}
                    onValueChange={(value) => updateExercise('intensity', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Легкая (прогулки, йога)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Умеренная (быстрая ходьба, плавание)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vigorous" id="vigorous" />
                      <Label htmlFor="vigorous">Интенсивная (бег, силовые тренировки)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minutesPerWeek">Минут в неделю</Label>
                  <Input
                    id="minutesPerWeek"
                    type="number"
                    value={formData.exercise.minutesPerWeek}
                    onChange={(e) => updateExercise('minutesPerWeek', parseInt(e.target.value) || 0)}
                    min="0"
                    max="2000"
                    placeholder="150"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Питание */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Питание</CardTitle>
            <CardDescription>Тип питания и пищевые привычки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dietType">Тип питания</Label>
              <Select value={formData.diet.type} onValueChange={(value) => updateDiet('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип питания" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Обычное питание</SelectItem>
                  <SelectItem value="vegetarian">Вегетарианское</SelectItem>
                  <SelectItem value="vegan">Веганское</SelectItem>
                  <SelectItem value="keto">Кетогенная диета</SelectItem>
                  <SelectItem value="mediterranean">Средиземноморская диета</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="waterIntake">Количество воды в день (стаканов)</Label>
              <Input
                id="waterIntake"
                type="number"
                value={formData.diet.waterIntake}
                onChange={(e) => updateDiet('waterIntake', parseInt(e.target.value) || 0)}
                min="0"
                max="20"
                placeholder="8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Стресс */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Уровень стресса</CardTitle>
            <CardDescription>Оценка стресса по шкале от 1 до 10</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Label>Общий уровень стресса: {formData.stress.level}/10</Label>
              <Slider
                value={[formData.stress.level]}
                onValueChange={(value) => updateStress('level', value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Минимальный</span>
                <span>Максимальный</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Работа */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Условия работы</CardTitle>
            <CardDescription>Тип работы и профессиональные риски</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workType">Тип работы</Label>
              <Select value={formData.work.type} onValueChange={(value) => updateWork('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип работы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Офисная работа</SelectItem>
                  <SelectItem value="physical">Физический труд</SelectItem>
                  <SelectItem value="healthcare">Медицина</SelectItem>
                  <SelectItem value="outdoor">Работа на открытом воздухе</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Уровень стресса на работе: {formData.work.stressLevel}/10</Label>
              <Slider
                value={[formData.work.stressLevel]}
                onValueChange={(value) => updateWork('stressLevel', value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chemicalExposure"
                  checked={formData.work.chemicalExposure}
                  onCheckedChange={(checked) => updateWork('chemicalExposure', !!checked)}
                />
                <Label htmlFor="chemicalExposure">Контакт с химическими веществами</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nightShifts"
                  checked={formData.work.nightShifts}
                  onCheckedChange={(checked) => updateWork('nightShifts', !!checked)}
                />
                <Label htmlFor="nightShifts">Работа в ночные смены</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">Продолжить</Button>
      </div>
    </div>
  );
};

export default LifestyleStep;
