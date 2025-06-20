
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Activity, Plus, Save, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface HealthMetric {
  id: string;
  family_member_id: string;
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
  updated_at: string;
}

interface HealthMetricsTabProps {
  memberId: string;
}

const HealthMetricsTab: React.FC<HealthMetricsTabProps> = ({ memberId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    metric_type: 'blood_pressure',
    value_numeric: '',
    value_text: '',
    unit: '',
    reference_range_min: '',
    reference_range_max: '',
    measurement_date: new Date().toISOString().split('T')[0],
    measured_by: '',
    notes: ''
  });

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
      console.error('Error loading metrics:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить показатели здоровья",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const newMetric = {
        family_member_id: memberId,
        metric_type: formData.metric_type,
        value_numeric: formData.value_numeric ? parseFloat(formData.value_numeric) : null,
        value_text: formData.value_text || null,
        unit: formData.unit || null,
        reference_range_min: formData.reference_range_min ? parseFloat(formData.reference_range_min) : null,
        reference_range_max: formData.reference_range_max ? parseFloat(formData.reference_range_max) : null,
        measurement_date: formData.measurement_date,
        measured_by: formData.measured_by || null,
        notes: formData.notes || null,
        created_by: user.id
      };

      // Calculate if value is within normal range
      if (newMetric.value_numeric && newMetric.reference_range_min && newMetric.reference_range_max) {
        const isWithinRange = newMetric.value_numeric >= newMetric.reference_range_min && 
                              newMetric.value_numeric <= newMetric.reference_range_max;
        (newMetric as any).is_within_normal_range = isWithinRange;
      }

      const { error } = await supabase
        .from('family_member_health_metrics')
        .insert(newMetric);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Показатель здоровья добавлен"
      });

      // Reset form
      setFormData({
        metric_type: 'blood_pressure',
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
      console.error('Error adding metric:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить показатель",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getMetricTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'blood_pressure': 'Артериальное давление',
      'heart_rate': 'Частота пульса',
      'temperature': 'Температура тела',
      'weight': 'Вес',
      'height': 'Рост',
      'cholesterol': 'Холестерин',
      'glucose': 'Глюкоза',
      'bmi': 'ИМТ',
      'other': 'Другое'
    };
    return labels[type] || type;
  };

  const getRangeStatus = (metric: HealthMetric) => {
    if (metric.is_within_normal_range === null || metric.is_within_normal_range === undefined) {
      return null;
    }
    return metric.is_within_normal_range;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка показателей...</p>
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
                Отслеживайте важные показатели здоровья во времени
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить показатель
            </Button>
          </div>
        </CardHeader>

        {showAddForm && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metric_type">Тип показателя</Label>
                  <select
                    id="metric_type"
                    className="w-full p-2 border rounded"
                    value={formData.metric_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, metric_type: e.target.value }))}
                  >
                    <option value="blood_pressure">Артериальное давление</option>
                    <option value="heart_rate">Частота пульса</option>
                    <option value="temperature">Температура тела</option>
                    <option value="weight">Вес</option>
                    <option value="height">Рост</option>
                    <option value="cholesterol">Холестерин</option>
                    <option value="glucose">Глюкоза</option>
                    <option value="bmi">ИМТ</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="measurement_date">Дата измерения</Label>
                  <Input
                    id="measurement_date"
                    type="date"
                    value={formData.measurement_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, measurement_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value_numeric">Числовое значение</Label>
                  <Input
                    id="value_numeric"
                    type="number"
                    step="0.01"
                    value={formData.value_numeric}
                    onChange={(e) => setFormData(prev => ({ ...prev, value_numeric: e.target.value }))}
                    placeholder="Например: 120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Единица измерения</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="Например: мм рт.ст., кг, °C"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference_range_min">Норма (мин)</Label>
                  <Input
                    id="reference_range_min"
                    type="number"
                    step="0.01"
                    value={formData.reference_range_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference_range_min: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference_range_max">Норма (макс)</Label>
                  <Input
                    id="reference_range_max"
                    type="number"
                    step="0.01"
                    value={formData.reference_range_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference_range_max: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value_text">Текстовое значение</Label>
                  <Input
                    id="value_text"
                    value={formData.value_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, value_text: e.target.value }))}
                    placeholder="Например: 120/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="measured_by">Измерено</Label>
                  <Input
                    id="measured_by"
                    value={formData.measured_by}
                    onChange={(e) => setFormData(prev => ({ ...prev, measured_by: e.target.value }))}
                    placeholder="Врач, клиника или самостоятельно"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Примечания</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Дополнительная информация..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Сохраняется...' : 'Сохранить'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История показателей</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Нет записей о показателях
              </h3>
              <p className="text-gray-600">
                Добавьте первый показатель здоровья
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.map((metric) => {
                const rangeStatus = getRangeStatus(metric);
                return (
                  <div
                    key={metric.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">
                            {getMetricTypeLabel(metric.metric_type)}
                          </h4>
                          {rangeStatus !== null && (
                            <Badge className={rangeStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {rangeStatus ? (
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
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          {metric.value_numeric && (
                            <p>
                              <strong>Значение:</strong> {metric.value_numeric}
                              {metric.unit && ` ${metric.unit}`}
                            </p>
                          )}
                          {metric.value_text && (
                            <p><strong>Текст:</strong> {metric.value_text}</p>
                          )}
                          {metric.reference_range_min && metric.reference_range_max && (
                            <p>
                              <strong>Норма:</strong> {metric.reference_range_min} - {metric.reference_range_max}
                              {metric.unit && ` ${metric.unit}`}
                            </p>
                          )}
                          {metric.measured_by && (
                            <p><strong>Измерено:</strong> {metric.measured_by}</p>
                          )}
                          {metric.notes && (
                            <p><strong>Примечания:</strong> {metric.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(metric.measurement_date), 'dd MMM yyyy', { locale: ru })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMetricsTab;
