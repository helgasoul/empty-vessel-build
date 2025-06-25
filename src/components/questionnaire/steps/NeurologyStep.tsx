
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { NeurologyData } from '../../../types/health';

interface NeurologyStepProps {
  data?: NeurologyData;
  onComplete: (data: NeurologyData) => void;
}

const NeurologyStep: React.FC<NeurologyStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<NeurologyData>({
    mentalHealth: { depression: false, anxiety: false, currentTherapy: false, medications: [] },
    sleep: { hoursPerNight: 8, quality: 'good', sleepDisorders: [] },
    cognition: { memoryConcerns: false, concentrationIssues: false, familyDementia: false },
    headaches: { frequency: 'rarely', type: '', triggers: [] },
    ...data
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  const updateMentalHealth = (field: keyof typeof formData.mentalHealth, value: any) => {
    setFormData(prev => ({
      ...prev,
      mentalHealth: { ...prev.mentalHealth, [field]: value }
    }));
  };

  const updateSleep = (field: keyof typeof formData.sleep, value: any) => {
    setFormData(prev => ({
      ...prev,
      sleep: { ...prev.sleep, [field]: value }
    }));
  };

  const updateCognition = (field: keyof typeof formData.cognition, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      cognition: { ...prev.cognition, [field]: value }
    }));
  };

  const updateHeadaches = (field: keyof typeof formData.headaches, value: any) => {
    setFormData(prev => ({
      ...prev,
      headaches: { ...prev.headaches, [field]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Психическое здоровье */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Психическое здоровье</CardTitle>
            <CardDescription>Настроение, эмоциональное состояние</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="depression"
                checked={formData.mentalHealth.depression}
                onCheckedChange={(checked) => updateMentalHealth('depression', !!checked)}
              />
              <Label htmlFor="depression">Депрессия или расстройства настроения</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anxiety"
                checked={formData.mentalHealth.anxiety}
                onCheckedChange={(checked) => updateMentalHealth('anxiety', !!checked)}
              />
              <Label htmlFor="anxiety">Тревожные расстройства</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="therapy"
                checked={formData.mentalHealth.currentTherapy}
                onCheckedChange={(checked) => updateMentalHealth('currentTherapy', !!checked)}
              />
              <Label htmlFor="therapy">Прохожу психотерапию или консультации</Label>
            </div>
          </CardContent>
        </Card>

        {/* Сон */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Качество сна</CardTitle>
            <CardDescription>Режим сна и его качество</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sleepHours">Количество часов сна в сутки</Label>
              <Input
                id="sleepHours"
                type="number"
                value={formData.sleep.hoursPerNight}
                onChange={(e) => updateSleep('hoursPerNight', parseInt(e.target.value) || 0)}
                min="3"
                max="12"
                placeholder="8"
              />
            </div>

            <div className="space-y-3">
              <Label>Качество сна</Label>
              <RadioGroup
                value={formData.sleep.quality}
                onValueChange={(value) => updateSleep('quality', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent">Отличное</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good">Хорошее</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="fair" />
                  <Label htmlFor="fair">Удовлетворительное</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="poor" />
                  <Label htmlFor="poor">Плохое</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Когнитивные функции */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Когнитивные функции</CardTitle>
            <CardDescription>Память, концентрация, внимание</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="memory"
                checked={formData.cognition.memoryConcerns}
                onCheckedChange={(checked) => updateCognition('memoryConcerns', !!checked)}
              />
              <Label htmlFor="memory">Проблемы с памятью</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="concentration"
                checked={formData.cognition.concentrationIssues}
                onCheckedChange={(checked) => updateCognition('concentrationIssues', !!checked)}
              />
              <Label htmlFor="concentration">Проблемы с концентрацией внимания</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="familyDementia"
                checked={formData.cognition.familyDementia}
                onCheckedChange={(checked) => updateCognition('familyDementia', !!checked)}
              />
              <Label htmlFor="familyDementia">Деменция у родственников</Label>
            </div>
          </CardContent>
        </Card>

        {/* Головные боли */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Головные боли</CardTitle>
            <CardDescription>Частота и характер головных болей</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Частота головных болей</Label>
              <RadioGroup
                value={formData.headaches.frequency}
                onValueChange={(value) => updateHeadaches('frequency', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Никогда</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rarely" id="rarely" />
                  <Label htmlFor="rarely">Редко (реже 1 раза в месяц)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Ежемесячно</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Еженедельно</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Ежедневно</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.headaches.frequency !== 'never' && (
              <div className="space-y-2">
                <Label htmlFor="headacheType">Тип головной боли</Label>
                <Select value={formData.headaches.type} onValueChange={(value) => updateHeadaches('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tension">Головная боль напряжения</SelectItem>
                    <SelectItem value="migraine">Мигрень</SelectItem>
                    <SelectItem value="cluster">Кластерная головная боль</SelectItem>
                    <SelectItem value="sinus">Синусная головная боль</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">Продолжить</Button>
      </div>
    </div>
  );
};

export default NeurologyStep;
