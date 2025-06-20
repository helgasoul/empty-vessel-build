
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Activity, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface HealthMetric {
  id: string;
  metric_type: string;
  value_numeric?: number;
  value_text?: string;
  unit?: string;
  reference_range_min?: number;
  reference_range_max?: number;
  is_within_normal_range?: boolean;
  measurement_date: string;
  measured_by?: string;
  notes?: string;
  created_at: string;
}

interface HealthMetricsTabProps {
  memberId: string;
}

const HealthMetricsTab: React.FC<HealthMetricsTabProps> = ({ memberId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMetric, setNewMetric] = useState({
    metric_type: '',
    value_numeric: '',
    value_text: '',
    unit: '',
    reference_range_min: '',
    reference_range_max: '',
    measurement_date: new Date().toISOString().split('T')[0],
    measured_by: '',
    notes: ''
  });

  const metricTypes = [
    { value: 'blood_pressure', label: 'Артериальное давление', unit: 'мм рт.ст.' },
    { value: 'heart_rate', label: 'Пульс', unit: 'уд/мин' },
    { value: 'weight', label: 'Вес', unit: 'кг' },
    { value: 'height', label: 'Рост', unit: 'см' },
    { value: 'bmi', label: 'ИМТ', unit: 'кг/м²' },
    { value: 'cholesterol_total', label: 'Общий холестерин', unit: 'ммоль/л' },
    { value: 'cholesterol_ldl', label: 'ЛПНП холестерин', unit: 'ммоль/л' },
    { value: 'cholesterol_hdl', label: 'ЛПВП холестерин', unit: 'ммоль/л' },
    { value: 'glucose', label: 'Глюкоза', unit: 'ммоль/л' },
    { value: 'hemoglobin', label: 'Гемоглобин', unit: 'г/л' },
    { value: 'temperature', label: 'Температура', unit: '°C' },
    { value: 'other', label: 'Другое', unit: '' }
  ];

  useEffect(() => {
    loadMetrics();
  }, [memberId]);

  const loadMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('family_member_health_metrics')
        .select('*')
        .eq('family_member_id', memberId)
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error loading health metrics:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить показатели здоровья",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addMetric = async () => {
    if (!user || !newMetric.metric_type || (!newMetric.value_numeric && !newMetric.value_text)) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive"
      });
      return;
    }

    try {
      const metricData = {
        family_member_id: memberId,
        metric_type: newMetric.metric_type,
        value_numeric: newMetric.value_numeric ? parseFloat(newMetric.value_numeric) : null,
        value_text: newMetric.value_text || null,
        unit: newMetric.unit || null,
        reference_range_min: newMetric.reference_range_min ? parseFloat(newMetric.reference_range_min) : null,
        reference_range_max: newMetric.reference_range_max ? parseFloat(newMetric.reference_range_max) : null,
        measurement_date: newMetric.measurement_date,
        measured_by: newMetric.measured_by || null,
        notes: newMetric.notes || null,
        created_by: user.id
      };

      // Определяем, находится ли значение в норме
      if (metricData.value_numeric && metricData.reference_range_min && metricData.reference_range_max) {
        metricData.is_within_normal_range = 
          metricData.value_numeric >= metricData.reference_range_min && 
          metricData.value_numeric <= metricData.reference_range_max;
      }

      const { error } = await supabase
        .from('family_member_health_metrics')
        .insert(metricData);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Показатель добавлен"
      });

      setNewMetric({
        metric_type: '',
        value_numeric: '',
        value_text: '',
        unit: '',
        reference_range_min: '',
        reference_range_max: '',
        measurement_date: new Date().toISOString().split('T')[0],
        measured_by: '',
        notes: ''
      });
      setShowAddForm(false);
      loadMetrics();
    } catch (error) {
      console.error('Error adding health metric:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить показатель",
        variant: "destructive"
      });
    }
  };

  const getMetricLabel = (type: string) => {
    const metricType = metricTypes.find(mt => mt.value === type);
    return metricType ? metricType.label : type;
  };

  const getStatusBadge = (metric: HealthMetric) => {
    if (metric.is_within_normal_range === null) return null;
    
    return (
      <Badge 
        className={metric.is_within_normal_range ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      >
        {metric.is_within_normal_range ? (
          <>
            <TrendingUp className="w-3 h-3 mr-1" />
            Норма
          </>
        ) : (
          <>
            <TrendingDown className="w-3 h-3 mr-1" />
            Вне нормы
          </>
        )}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка показателей...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Показатели здоровья</span>
              </CardTitle>
              <CardDescription>
                Медицинские показатели и результаты анализов
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить показатель
            </Button>
          </div>
        </CardHeader>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Новый показатель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metric_type">Тип показателя</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newMetric.metric_type}
                  onChange={(e) => {
                    const selectedType = metricTypes.find(mt => mt.value === e.target.value);
                    setNewMetric(prev => ({
                      ...prev,
                      metric_type: e.target.value,
                      unit: selectedType?.unit || ''
                    }));
                  }}
                >
                  <option value="">Выберите тип</option>
                  {metricTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurement_date">Дата измерения</Label>
                <Input
                  id="measurement_date"
                  type="date"
                  value={newMetric.measurement_date}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, measurement_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value_numeric">Числовое значение</Label>
                <Input
                  id="value_numeric"
                  type="number"
                  step="0.1"
                  value={newMetric.value_numeric}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, value_numeric: e.target.value }))}
                  placeholder="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Единица измерения</Label>
                <Input
                  id="unit"
                  value={newMetric.unit}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="мм рт.ст."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_range_min">Норма от</Label>
                <Input
                  id="reference_range_min"
                  type="number"
                  step="0.1"
                  value={newMetric.reference_range_min}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, reference_range_min: e.target.value }))}
                  placeholder="90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_range_max">Норма до</Label>
                <Input
                  id="reference_range_max"
                  type="number"
                  step="0.1"
                  value={newMetric.reference_range_max}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, reference_range_max: e.target.value }))}
                  placeholder="140"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="measured_by">Кто измерял</Label>
                <Input
                  id="measured_by"
                  value={newMetric.measured_by}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, measured_by: e.target.value }))}
                  placeholder="Врач, самостоятельно..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value_text">Текстовое значение</Label>
                <Input
                  id="value_text"
                  value={newMetric.value_text}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, value_text: e.target.value }))}
                  placeholder="120/80"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
                value={newMetric.notes}
                onChange={(e) => setNewMetric(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Дополнительные заметки..."
                rows={2}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={addMetric}>Добавить</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {metrics.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет показателей здоровья
            </h3>
            <p className="text-gray-600">
              Добавьте первый показатель здоровья для отслеживания состояния
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{getMetricLabel(metric.metric_type)}</h3>
                      {getStatusBadge(metric)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Значение:</span>
                        <p className="font-medium">
                          {metric.value_numeric ? `${metric.value_numeric} ${metric.unit || ''}` : metric.value_text}
                        </p>
                      </div>
                      
                      {metric.reference_range_min && metric.reference_range_max && (
                        <div>
                          <span className="text-gray-600">Норма:</span>
                          <p className="font-medium">
                            {metric.reference_range_min} - {metric.reference_range_max} {metric.unit || ''}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-gray-600">Дата:</span>
                        <p className="font-medium">
                          {format(new Date(metric.measurement_date), 'dd MMM yyyy', { locale: ru })}
                        </p>
                      </div>
                      
                      {metric.measured_by && (
                        <div>
                          <span className="text-gray-600">Кто измерял:</span>
                          <p className="font-medium">{metric.measured_by}</p>
                        </div>
                      )}
                    </div>
                    
                    {metric.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{metric.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthMetricsTab;
