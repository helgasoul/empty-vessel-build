
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar, Plus, Edit2, Trash2, Thermometer, Heart, Smile } from 'lucide-react';
import { useMenstrualCycle, MenstrualCycle } from '@/hooks/useMenstrualCycle';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

type CervicalMucusType = 'dry' | 'sticky' | 'creamy' | 'egg_white' | 'watery' | '';

const MenstrualCycleTracker = () => {
  const { cycles, loading, addCycle, updateCycle, deleteCycle } = useMenstrualCycle();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cycle_start_date: '',
    cycle_end_date: '',
    period_length: '',
    flow_intensity: '' as 'light' | 'moderate' | 'heavy' | '',
    symptoms: [] as string[],
    notes: '',
    // Новые поля
    basal_temperature: '',
    cervical_mucus: '' as CervicalMucusType,
    ovulation_test_result: false,
    ovulation_date: '',
    mood_rating: [3] as number[],
    pain_level: [0] as number[],
    breast_tenderness: false,
    bloating: false,
    cycle_type: 'regular' as 'regular' | 'irregular' | 'anovulatory'
  });

  const symptomOptions = [
    'Боли в животе', 'Головная боль', 'Тошнота', 'Усталость', 
    'Раздражительность', 'Перепады настроения', 'Отеки', 
    'Болезненность груди', 'Акне', 'Бессонница', 'Тяга к сладкому',
    'Боли в спине', 'Диарея', 'Запор'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cycleData = {
        cycle_start_date: formData.cycle_start_date,
        cycle_end_date: formData.cycle_end_date || undefined,
        period_length: formData.period_length ? parseInt(formData.period_length) : undefined,
        flow_intensity: formData.flow_intensity || undefined,
        symptoms: formData.symptoms,
        notes: formData.notes,
        // Новые поля
        basal_temperature: formData.basal_temperature ? parseFloat(formData.basal_temperature) : undefined,
        cervical_mucus: formData.cervical_mucus || undefined,
        ovulation_test_result: formData.ovulation_test_result || undefined,
        ovulation_date: formData.ovulation_date || undefined,
        mood_rating: formData.mood_rating[0],
        pain_level: formData.pain_level[0],
        breast_tenderness: formData.breast_tenderness,
        bloating: formData.bloating,
        cycle_type: formData.cycle_type
      };

      if (editingId) {
        await updateCycle(editingId, cycleData);
        setEditingId(null);
      } else {
        await addCycle(cycleData);
        setIsAdding(false);
      }

      resetForm();
    } catch (error) {
      console.error('Ошибка при сохранении цикла:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      cycle_start_date: '',
      cycle_end_date: '',
      period_length: '',
      flow_intensity: '',
      symptoms: [],
      notes: '',
      basal_temperature: '',
      cervical_mucus: '',
      ovulation_test_result: false,
      ovulation_date: '',
      mood_rating: [3],
      pain_level: [0],
      breast_tenderness: false,
      bloating: false,
      cycle_type: 'regular'
    });
  };

  const handleEdit = (cycle: MenstrualCycle) => {
    setFormData({
      cycle_start_date: cycle.cycle_start_date,
      cycle_end_date: cycle.cycle_end_date || '',
      period_length: cycle.period_length?.toString() || '',
      flow_intensity: cycle.flow_intensity || '',
      symptoms: cycle.symptoms || [],
      notes: cycle.notes || '',
      basal_temperature: cycle.basal_temperature?.toString() || '',
      cervical_mucus: (cycle.cervical_mucus as CervicalMucusType) || '',
      ovulation_test_result: cycle.ovulation_test_result || false,
      ovulation_date: cycle.ovulation_date || '',
      mood_rating: [cycle.mood_rating || 3],
      pain_level: [cycle.pain_level || 0],
      breast_tenderness: cycle.breast_tenderness || false,
      bloating: cycle.bloating || false,
      cycle_type: cycle.cycle_type || 'regular'
    });
    setEditingId(cycle.id);
    setIsAdding(true);
  };

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-600">Трекер менструального цикла</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить цикл
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Редактировать цикл' : 'Новый цикл'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основная информация */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Дата начала цикла</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.cycle_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, cycle_start_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Дата окончания (опционально)</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.cycle_end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, cycle_end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="period-length">Продолжительность месячных (дней)</Label>
                  <Input
                    id="period-length"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.period_length}
                    onChange={(e) => setFormData(prev => ({ ...prev, period_length: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="flow-intensity">Интенсивность</Label>
                  <Select value={formData.flow_intensity} onValueChange={(value) => setFormData(prev => ({ ...prev, flow_intensity: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите интенсивность" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Слабая</SelectItem>
                      <SelectItem value="moderate">Умеренная</SelectItem>
                      <SelectItem value="heavy">Обильная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cycle-type">Тип цикла</Label>
                  <Select value={formData.cycle_type} onValueChange={(value) => setFormData(prev => ({ ...prev, cycle_type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Тип цикла" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Регулярный</SelectItem>
                      <SelectItem value="irregular">Нерегулярный</SelectItem>
                      <SelectItem value="anovulatory">Ановуляторный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Отслеживание овуляции */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Отслеживание овуляции</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ovulation-date">Дата овуляции</Label>
                    <Input
                      id="ovulation-date"
                      type="date"
                      value={formData.ovulation_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, ovulation_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="basal-temp">Базальная температура (°C)</Label>
                    <Input
                      id="basal-temp"
                      type="number"
                      step="0.1"
                      min="35"
                      max="42"
                      value={formData.basal_temperature}
                      onChange={(e) => setFormData(prev => ({ ...prev, basal_temperature: e.target.value }))}
                      placeholder="36.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cervical-mucus">Цервикальная слизь</Label>
                    <Select value={formData.cervical_mucus} onValueChange={(value: CervicalMucusType) => setFormData(prev => ({ ...prev, cervical_mucus: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Тип слизи" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry">Сухая</SelectItem>
                        <SelectItem value="sticky">Липкая</SelectItem>
                        <SelectItem value="creamy">Кремовая</SelectItem>
                        <SelectItem value="egg_white">Яичный белок</SelectItem>
                        <SelectItem value="watery">Водянистая</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={formData.ovulation_test_result}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ovulation_test_result: checked }))}
                    />
                    <Label>Положительный тест на овуляцию</Label>
                  </div>
                </div>
              </div>

              {/* Самочувствие */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Самочувствие</Label>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Настроение (1-5): {formData.mood_rating[0]}</Label>
                    <Slider
                      value={formData.mood_rating}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, mood_rating: value }))}
                      max={5}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Плохое</span>
                      <span>Отличное</span>
                    </div>
                  </div>
                  <div>
                    <Label>Уровень боли (0-10): {formData.pain_level[0]}</Label>
                    <Slider
                      value={formData.pain_level}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, pain_level: value }))}
                      max={10}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Нет боли</span>
                      <span>Сильная боль</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.breast_tenderness}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, breast_tenderness: checked }))}
                    />
                    <Label>Болезненность груди</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.bloating}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, bloating: checked }))}
                    />
                    <Label>Вздутие живота</Label>
                  </div>
                </div>
              </div>

              {/* Симптомы */}
              <div>
                <Label>Симптомы</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {symptomOptions.map(symptom => (
                    <Badge
                      key={symptom}
                      variant={formData.symptoms.includes(symptom) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleSymptomToggle(symptom)}
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Заметки</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Дополнительные заметки..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  {editingId ? 'Обновить' : 'Добавить'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetForm();
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {cycles.map(cycle => (
          <Card key={cycle.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-600" />
                    <span className="font-medium">
                      {format(new Date(cycle.cycle_start_date), 'dd MMMM yyyy', { locale: ru })}
                      {cycle.cycle_end_date && (
                        <> - {format(new Date(cycle.cycle_end_date), 'dd MMMM yyyy', { locale: ru })}</>
                      )}
                    </span>
                    {cycle.cycle_type && (
                      <Badge variant="secondary" className="text-xs">
                        {cycle.cycle_type === 'regular' ? 'Регулярный' : 
                         cycle.cycle_type === 'irregular' ? 'Нерегулярный' : 'Ановуляторный'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      {cycle.period_length && (
                        <p>Продолжительность: {cycle.period_length} дней</p>
                      )}
                      {cycle.flow_intensity && (
                        <p>Интенсивность: {
                          cycle.flow_intensity === 'light' ? 'Слабая' :
                          cycle.flow_intensity === 'moderate' ? 'Умеренная' : 'Обильная'
                        }</p>
                      )}
                      {cycle.ovulation_date && (
                        <p>Овуляция: {format(new Date(cycle.ovulation_date), 'dd MMM', { locale: ru })}</p>
                      )}
                    </div>

                    <div>
                      {cycle.basal_temperature && (
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3" />
                          <span>Температура: {cycle.basal_temperature}°C</span>
                        </div>
                      )}
                      {cycle.mood_rating && (
                        <div className="flex items-center gap-1">
                          <Smile className="w-3 h-3" />
                          <span>Настроение: {cycle.mood_rating}/5</span>
                        </div>
                      )}
                      {cycle.pain_level !== undefined && cycle.pain_level > 0 && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>Боль: {cycle.pain_level}/10</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {(cycle.breast_tenderness || cycle.bloating || cycle.ovulation_test_result) && (
                    <div className="flex gap-2">
                      {cycle.breast_tenderness && (
                        <Badge variant="outline" className="text-xs">Болезненность груди</Badge>
                      )}
                      {cycle.bloating && (
                        <Badge variant="outline" className="text-xs">Вздутие</Badge>
                      )}
                      {cycle.ovulation_test_result && (
                        <Badge variant="outline" className="text-xs">Положительный тест на овуляцию</Badge>
                      )}
                    </div>
                  )}
                  
                  {cycle.symptoms && cycle.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cycle.symptoms.map(symptom => (
                        <Badge key={symptom} variant="secondary" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {cycle.notes && (
                    <p className="text-sm text-gray-600 italic">{cycle.notes}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(cycle)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteCycle(cycle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenstrualCycleTracker;
