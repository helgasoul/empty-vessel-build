
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Trash2, Activity, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useHormonalHealth, HormonalHealthRecord } from '@/hooks/useHormonalHealth';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const HormonalHealthTracker = () => {
  const { records, loading, addRecord, updateRecord, deleteRecord } = useHormonalHealth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tracking_date: '',
    hormone_type: '' as HormonalHealthRecord['hormone_type'] | '',
    level_value: '',
    level_unit: '',
    test_type: '' as HormonalHealthRecord['test_type'] | '',
    lab_name: '',
    reference_range_min: '',
    reference_range_max: '',
    symptoms: [] as string[],
    prescribed_by: '',
    notes: ''
  });

  const hormoneTypes = [
    { value: 'estrogen', label: 'Эстроген', unit: 'пг/мл' },
    { value: 'progesterone', label: 'Прогестерон', unit: 'нг/мл' },
    { value: 'lh', label: 'ЛГ (лютеинизирующий гормон)', unit: 'мМЕ/мл' },
    { value: 'fsh', label: 'ФСГ (фолликулостимулирующий)', unit: 'мМЕ/мл' },
    { value: 'testosterone', label: 'Тестостерон', unit: 'нг/дл' },
    { value: 'cortisol', label: 'Кортизол', unit: 'мкг/дл' },
    { value: 'thyroid', label: 'Гормоны щитовидной железы', unit: 'различные' }
  ];

  const symptomOptions = [
    'Нерегулярные месячные', 'Отсутствие месячных', 'Сильные боли', 
    'Перепады настроения', 'Депрессия', 'Тревожность', 'Усталость',
    'Бессонница', 'Увеличение веса', 'Потеря веса', 'Акне', 
    'Выпадение волос', 'Избыточный рост волос', 'Приливы',
    'Сухость влагалища', 'Снижение либидо', 'Головные боли'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const recordData = {
        tracking_date: formData.tracking_date,
        hormone_type: formData.hormone_type as HormonalHealthRecord['hormone_type'],
        level_value: formData.level_value ? parseFloat(formData.level_value) : undefined,
        level_unit: formData.level_unit || undefined,
        test_type: formData.test_type as HormonalHealthRecord['test_type'] || undefined,
        lab_name: formData.lab_name || undefined,
        reference_range_min: formData.reference_range_min ? parseFloat(formData.reference_range_min) : undefined,
        reference_range_max: formData.reference_range_max ? parseFloat(formData.reference_range_max) : undefined,
        is_within_range: calculateWithinRange(),
        symptoms: formData.symptoms,
        prescribed_by: formData.prescribed_by || undefined,
        notes: formData.notes || undefined
      };

      if (editingId) {
        await updateRecord(editingId, recordData);
        setEditingId(null);
      } else {
        await addRecord(recordData);
        setIsAdding(false);
      }

      resetForm();
    } catch (error) {
      console.error('Ошибка при сохранении записи:', error);
    }
  };

  const calculateWithinRange = () => {
    if (!formData.level_value || !formData.reference_range_min || !formData.reference_range_max) {
      return undefined;
    }
    const value = parseFloat(formData.level_value);
    const min = parseFloat(formData.reference_range_min);
    const max = parseFloat(formData.reference_range_max);
    return value >= min && value <= max;
  };

  const resetForm = () => {
    setFormData({
      tracking_date: '',
      hormone_type: '',
      level_value: '',
      level_unit: '',
      test_type: '',
      lab_name: '',
      reference_range_min: '',
      reference_range_max: '',
      symptoms: [],
      prescribed_by: '',
      notes: ''
    });
  };

  const handleEdit = (record: HormonalHealthRecord) => {
    setFormData({
      tracking_date: record.tracking_date,
      hormone_type: record.hormone_type,
      level_value: record.level_value?.toString() || '',
      level_unit: record.level_unit || '',
      test_type: record.test_type || '',
      lab_name: record.lab_name || '',
      reference_range_min: record.reference_range_min?.toString() || '',
      reference_range_max: record.reference_range_max?.toString() || '',
      symptoms: record.symptoms || [],
      prescribed_by: record.prescribed_by || '',
      notes: record.notes || ''
    });
    setEditingId(record.id);
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

  const getHormoneLabel = (type: string) => {
    return hormoneTypes.find(h => h.value === type)?.label || type;
  };

  const getStatusIcon = (record: HormonalHealthRecord) => {
    if (record.is_within_range === undefined) return null;
    if (record.is_within_range) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-600">Мониторинг гормонального здоровья</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить запись
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              {editingId ? 'Редактировать запись' : 'Новая запись о гормонах'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tracking-date">Дата анализа</Label>
                  <Input
                    id="tracking-date"
                    type="date"
                    value={formData.tracking_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, tracking_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hormone-type">Тип гормона</Label>
                  <Select value={formData.hormone_type} onValueChange={(value) => {
                    const hormone = hormoneTypes.find(h => h.value === value);
                    setFormData(prev => ({ 
                      ...prev, 
                      hormone_type: value as any,
                      level_unit: hormone?.unit || ''
                    }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите гормон" />
                    </SelectTrigger>
                    <SelectContent>
                      {hormoneTypes.map(hormone => (
                        <SelectItem key={hormone.value} value={hormone.value}>
                          {hormone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="level-value">Значение</Label>
                  <Input
                    id="level-value"
                    type="number"
                    step="0.001"
                    value={formData.level_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, level_value: e.target.value }))}
                    placeholder="Введите значение"
                  />
                </div>
                <div>
                  <Label htmlFor="level-unit">Единица измерения</Label>
                  <Input
                    id="level-unit"
                    value={formData.level_unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, level_unit: e.target.value }))}
                    placeholder="нг/мл"
                  />
                </div>
                <div>
                  <Label htmlFor="test-type">Тип теста</Label>
                  <Select value={formData.test_type} onValueChange={(value) => setFormData(prev => ({ ...prev, test_type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Тип теста" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood">Анализ крови</SelectItem>
                      <SelectItem value="saliva">Анализ слюны</SelectItem>
                      <SelectItem value="urine">Анализ мочи</SelectItem>
                      <SelectItem value="home_test">Домашний тест</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ref-min">Норма от</Label>
                  <Input
                    id="ref-min"
                    type="number"
                    step="0.001"
                    value={formData.reference_range_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference_range_min: e.target.value }))}
                    placeholder="Минимум"
                  />
                </div>
                <div>
                  <Label htmlFor="ref-max">Норма до</Label>
                  <Input
                    id="ref-max"
                    type="number"
                    step="0.001"
                    value={formData.reference_range_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference_range_max: e.target.value }))}
                    placeholder="Максимум"
                  />
                </div>
                <div>
                  <Label htmlFor="lab-name">Лаборатория</Label>
                  <Input
                    id="lab-name"
                    value={formData.lab_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, lab_name: e.target.value }))}
                    placeholder="Название лаборатории"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prescribed-by">Назначено врачом</Label>
                <Input
                  id="prescribed-by"
                  value={formData.prescribed_by}
                  onChange={(e) => setFormData(prev => ({ ...prev, prescribed_by: e.target.value }))}
                  placeholder="Имя врача или клиника"
                />
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
                  placeholder="Дополнительные заметки, наблюдения..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
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
        {records.map(record => (
          <Card key={record.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">
                      {getHormoneLabel(record.hormone_type)}
                    </span>
                    <span className="text-gray-500">
                      {format(new Date(record.tracking_date), 'dd MMMM yyyy', { locale: ru })}
                    </span>
                    {getStatusIcon(record)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      {record.level_value && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Значение:</span>
                          <span className={record.is_within_range === false ? 'text-red-600 font-medium' : ''}>
                            {record.level_value} {record.level_unit}
                          </span>
                        </p>
                      )}
                      {record.reference_range_min && record.reference_range_max && (
                        <p>
                          <span className="font-medium">Норма:</span>
                          {record.reference_range_min} - {record.reference_range_max} {record.level_unit}
                        </p>
                      )}
                      {record.test_type && (
                        <p>
                          <span className="font-medium">Тип теста:</span>
                          {record.test_type === 'blood' ? 'Кровь' :
                           record.test_type === 'saliva' ? 'Слюна' :
                           record.test_type === 'urine' ? 'Моча' : 'Домашний тест'}
                        </p>
                      )}
                    </div>

                    <div>
                      {record.lab_name && (
                        <p>
                          <span className="font-medium">Лаборатория:</span>
                          {record.lab_name}
                        </p>
                      )}
                      {record.prescribed_by && (
                        <p>
                          <span className="font-medium">Врач:</span>
                          {record.prescribed_by}
                        </p>
                      )}
                      {record.is_within_range !== undefined && (
                        <p className={record.is_within_range ? 'text-green-600' : 'text-red-600'}>
                          {record.is_within_range ? '✓ В норме' : '⚠ Вне нормы'}
                        </p>
                      )}
                    </div>
                  </div>

                  {record.symptoms && record.symptoms.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Симптомы:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {record.symptoms.map(symptom => (
                          <Badge key={symptom} variant="secondary" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <p className="text-sm text-gray-600 italic">{record.notes}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(record)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteRecord(record.id)}
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

export default HormonalHealthTracker;
