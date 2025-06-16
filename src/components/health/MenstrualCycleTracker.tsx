
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { useMenstrualCycle, MenstrualCycle } from '@/hooks/useMenstrualCycle';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
    notes: ''
  });

  const symptomOptions = [
    'Боли в животе', 'Головная боль', 'Тошнота', 'Усталость', 
    'Раздражительность', 'Перепады настроения', 'Отеки', 
    'Болезненность груди', 'Акне', 'Бессонница'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cycleData = {
        ...formData,
        period_length: formData.period_length ? parseInt(formData.period_length) : undefined,
        cycle_end_date: formData.cycle_end_date || undefined
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
      notes: ''
    });
  };

  const handleEdit = (cycle: MenstrualCycle) => {
    setFormData({
      cycle_start_date: cycle.cycle_start_date,
      cycle_end_date: cycle.cycle_end_date || '',
      period_length: cycle.period_length?.toString() || '',
      flow_intensity: cycle.flow_intensity || '',
      symptoms: cycle.symptoms || [],
      notes: cycle.notes || ''
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
        <h2 className="text-2xl font-bold text-#F0A1C0">Трекер менструального цикла</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-#F0A1C0 hover:bg-#F0A1C0/90"
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
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
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
              </div>

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
                <Button type="submit" className="bg-#F0A1C0 hover:bg-#F0A1C0/90">
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-#F0A1C0" />
                    <span className="font-medium">
                      {format(new Date(cycle.cycle_start_date), 'dd MMMM yyyy', { locale: ru })}
                      {cycle.cycle_end_date && (
                        <> - {format(new Date(cycle.cycle_end_date), 'dd MMMM yyyy', { locale: ru })}</>
                      )}
                    </span>
                  </div>
                  
                  {cycle.period_length && (
                    <p className="text-sm text-gray-600">
                      Продолжительность: {cycle.period_length} дней
                    </p>
                  )}
                  
                  {cycle.flow_intensity && (
                    <p className="text-sm text-gray-600">
                      Интенсивность: {
                        cycle.flow_intensity === 'light' ? 'Слабая' :
                        cycle.flow_intensity === 'moderate' ? 'Умеренная' : 'Обильная'
                      }
                    </p>
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
