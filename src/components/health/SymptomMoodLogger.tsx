
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Plus, Heart, Brain, Zap, Bed, AlertCircle } from 'lucide-react';
import { useSymptomMoodLog, SymptomMoodLog } from '@/hooks/useSymptomMoodLog';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const SymptomMoodLogger = () => {
  const { logs, loading, addLog } = useSymptomMoodLog();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    symptoms: [] as string[],
    mood_rating: [5],
    mood_tags: [] as string[],
    energy_level: [5],
    sleep_quality: [5],
    stress_level: [5],
    notes: ''
  });

  const symptomOptions = [
    'Головная боль', 'Боли в животе', 'Тошнота', 'Усталость', 
    'Раздражительность', 'Тревожность', 'Депрессия', 'Отеки',
    'Болезненность груди', 'Акне', 'Бессонница', 'Боли в спине'
  ];

  const moodTagOptions = [
    'Счастливая', 'Грустная', 'Тревожная', 'Спокойная', 
    'Раздраженная', 'Энергичная', 'Подавленная', 'Оптимистичная'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addLog({
        log_date: formData.log_date,
        symptoms: formData.symptoms.length > 0 ? formData.symptoms : undefined,
        mood_rating: formData.mood_rating[0],
        mood_tags: formData.mood_tags.length > 0 ? formData.mood_tags : undefined,
        energy_level: formData.energy_level[0],
        sleep_quality: formData.sleep_quality[0],
        stress_level: formData.stress_level[0],
        notes: formData.notes || undefined
      });
      
      setIsAdding(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка при сохранении записи:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      log_date: new Date().toISOString().split('T')[0],
      symptoms: [],
      mood_rating: [5],
      mood_tags: [],
      energy_level: [5],
      sleep_quality: [5],
      stress_level: [5],
      notes: ''
    });
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const toggleMoodTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      mood_tags: prev.mood_tags.includes(tag)
        ? prev.mood_tags.filter(t => t !== tag)
        : [...prev.mood_tags, tag]
    }));
  };

  const getRatingColor = (value: number) => {
    if (value <= 3) return 'text-red-500';
    if (value <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRatingIcon = (type: string) => {
    switch (type) {
      case 'mood': return <Heart className="w-4 h-4" />;
      case 'energy': return <Zap className="w-4 h-4" />;
      case 'sleep': return <Bed className="w-4 h-4" />;
      case 'stress': return <AlertCircle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-#61D5A4">Дневник симптомов и настроения</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-#61D5A4 hover:bg-#61D5A4/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новая запись
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Новая запись</CardTitle>
            <CardDescription>Отметьте свое состояние и симптомы</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="log-date">Дата</Label>
                <Input
                  id="log-date"
                  type="date"
                  value={formData.log_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, log_date: e.target.value }))}
                  required
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
                      onClick={() => toggleSymptom(symptom)}
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getRatingIcon('mood')}
                    <Label>Настроение: {formData.mood_rating[0]}/10</Label>
                  </div>
                  <Slider
                    value={formData.mood_rating}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, mood_rating: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getRatingIcon('energy')}
                    <Label>Уровень энергии: {formData.energy_level[0]}/10</Label>
                  </div>
                  <Slider
                    value={formData.energy_level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, energy_level: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getRatingIcon('sleep')}
                    <Label>Качество сна: {formData.sleep_quality[0]}/10</Label>
                  </div>
                  <Slider
                    value={formData.sleep_quality}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sleep_quality: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getRatingIcon('stress')}
                    <Label>Уровень стресса: {formData.stress_level[0]}/10</Label>
                  </div>
                  <Slider
                    value={formData.stress_level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, stress_level: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Настроение (теги)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {moodTagOptions.map(tag => (
                    <Badge
                      key={tag}
                      variant={formData.mood_tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleMoodTag(tag)}
                    >
                      {tag}
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
                  placeholder="Дополнительные заметки о состоянии..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-#61D5A4 hover:bg-#61D5A4/90">
                  Сохранить
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
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
        {logs.map(log => (
          <Card key={log.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    {format(new Date(log.log_date), 'dd MMMM yyyy', { locale: ru })}
                  </h3>
                </div>

                {log.symptoms && log.symptoms.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Симптомы:</p>
                    <div className="flex flex-wrap gap-1">
                      {log.symptoms.map(symptom => (
                        <Badge key={symptom} variant="secondary" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {log.mood_rating && (
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span className={getRatingColor(log.mood_rating)}>
                        Настроение: {log.mood_rating}/10
                      </span>
                    </div>
                  )}
                  
                  {log.energy_level && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className={getRatingColor(log.energy_level)}>
                        Энергия: {log.energy_level}/10
                      </span>
                    </div>
                  )}
                  
                  {log.sleep_quality && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4" />
                      <span className={getRatingColor(log.sleep_quality)}>
                        Сон: {log.sleep_quality}/10
                      </span>
                    </div>
                  )}
                  
                  {log.stress_level && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className={getRatingColor(11 - log.stress_level)}>
                        Стресс: {log.stress_level}/10
                      </span>
                    </div>
                  )}
                </div>

                {log.mood_tags && log.mood_tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Настроение:</p>
                    <div className="flex flex-wrap gap-1">
                      {log.mood_tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {log.notes && (
                  <p className="text-sm text-gray-600 italic border-l-2 border-gray-200 pl-3">
                    {log.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SymptomMoodLogger;
