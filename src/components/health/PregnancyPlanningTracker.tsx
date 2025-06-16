
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Baby, Heart, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { usePregnancyPlanning, PregnancyPlan } from '@/hooks/usePregnancyPlanning';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const PregnancyPlanningTracker = () => {
  const { plans, loading, addPlan, updatePlan, deletePlan } = usePregnancyPlanning();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    planning_start_date: '',
    target_conception_date: '',
    prenatal_vitamins: false,
    folic_acid_intake: false,
    lifestyle_changes: [] as string[],
    medical_checkups: [] as string[],
    partner_health_check: false,
    fertility_tracking: true,
    ovulation_prediction: true,
    notes: '',
    is_active: true
  });

  const lifestyleOptions = [
    'Здоровое питание', 'Отказ от курения', 'Ограничение алкоголя', 
    'Регулярные упражнения', 'Снижение стресса', 'Здоровый сон',
    'Прием витаминов', 'Контроль веса'
  ];

  const checkupOptions = [
    'Общий анализ крови', 'Анализ на TORCH-инфекции', 'Фолиевая кислота',
    'Витамин D', 'Гормоны щитовидной железы', 'Репродуктивные гормоны',
    'Стоматологический осмотр', 'Гинекологический осмотр'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updatePlan(editingId, formData);
        setEditingId(null);
      } else {
        await addPlan(formData);
        setIsAdding(false);
      }
      resetForm();
    } catch (error) {
      console.error('Ошибка при сохранении плана:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      planning_start_date: '',
      target_conception_date: '',
      prenatal_vitamins: false,
      folic_acid_intake: false,
      lifestyle_changes: [],
      medical_checkups: [],
      partner_health_check: false,
      fertility_tracking: true,
      ovulation_prediction: true,
      notes: '',
      is_active: true
    });
  };

  const handleEdit = (plan: PregnancyPlan) => {
    setFormData({
      planning_start_date: plan.planning_start_date,
      target_conception_date: plan.target_conception_date || '',
      prenatal_vitamins: plan.prenatal_vitamins,
      folic_acid_intake: plan.folic_acid_intake,
      lifestyle_changes: plan.lifestyle_changes || [],
      medical_checkups: plan.medical_checkups || [],
      partner_health_check: plan.partner_health_check,
      fertility_tracking: plan.fertility_tracking,
      ovulation_prediction: plan.ovulation_prediction,
      notes: plan.notes || '',
      is_active: plan.is_active
    });
    setEditingId(plan.id);
    setIsAdding(true);
  };

  const handleArrayToggle = (array: string[], item: string, field: 'lifestyle_changes' | 'medical_checkups') => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-600">Планирование беременности</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новый план
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-pink-600" />
              {editingId ? 'Редактировать план' : 'Новый план беременности'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Дата начала планирования</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.planning_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, planning_start_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="target-date">Желаемая дата зачатия</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={formData.target_conception_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_conception_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Витамины и добавки</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.prenatal_vitamins}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prenatal_vitamins: checked }))}
                      />
                      <Label>Пренатальные витамины</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.folic_acid_intake}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, folic_acid_intake: checked }))}
                      />
                      <Label>Фолиевая кислота</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Отслеживание</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.fertility_tracking}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, fertility_tracking: checked }))}
                      />
                      <Label>Трекинг фертильности</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.ovulation_prediction}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ovulation_prediction: checked }))}
                      />
                      <Label>Прогноз овуляции</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.partner_health_check}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, partner_health_check: checked }))}
                      />
                      <Label>Проверка здоровья партнера</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Изменения образа жизни</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lifestyleOptions.map(option => (
                    <Badge
                      key={option}
                      variant={formData.lifestyle_changes.includes(option) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleArrayToggle(formData.lifestyle_changes, option, 'lifestyle_changes')}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Медицинские обследования</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {checkupOptions.map(option => (
                    <Badge
                      key={option}
                      variant={formData.medical_checkups.includes(option) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleArrayToggle(formData.medical_checkups, option, 'medical_checkups')}
                    >
                      {option}
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
                  placeholder="Дополнительные заметки, цели, планы..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  {editingId ? 'Обновить' : 'Создать план'}
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
        {plans.map(plan => (
          <Card key={plan.id} className={plan.is_active ? 'border-pink-200' : 'opacity-60'}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-600" />
                    <span className="font-medium">
                      Начало: {format(new Date(plan.planning_start_date), 'dd MMMM yyyy', { locale: ru })}
                    </span>
                    {plan.target_conception_date && (
                      <>
                        <Heart className="w-4 h-4 text-pink-600 ml-4" />
                        <span>
                          Цель: {format(new Date(plan.target_conception_date), 'dd MMMM yyyy', { locale: ru })}
                        </span>
                      </>
                    )}
                    {plan.is_active && (
                      <Badge className="bg-green-100 text-green-800">Активный</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Витамины и добавки:</h4>
                      <div className="space-y-1">
                        {plan.prenatal_vitamins && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Пренатальные витамины</span>
                          </div>
                        )}
                        {plan.folic_acid_intake && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Фолиевая кислота</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Отслеживание:</h4>
                      <div className="space-y-1">
                        {plan.fertility_tracking && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Трекинг фертильности</span>
                          </div>
                        )}
                        {plan.ovulation_prediction && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Прогноз овуляции</span>
                          </div>
                        )}
                        {plan.partner_health_check && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Проверка партнера</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {plan.lifestyle_changes && plan.lifestyle_changes.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Изменения образа жизни:</h4>
                      <div className="flex flex-wrap gap-1">
                        {plan.lifestyle_changes.map(change => (
                          <Badge key={change} variant="secondary" className="text-xs">
                            {change}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.medical_checkups && plan.medical_checkups.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Медицинские обследования:</h4>
                      <div className="flex flex-wrap gap-1">
                        {plan.medical_checkups.map(checkup => (
                          <Badge key={checkup} variant="outline" className="text-xs">
                            {checkup}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Заметки:</h4>
                      <p className="text-sm text-gray-600 italic">{plan.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePlan(plan.id)}
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

export default PregnancyPlanningTracker;
