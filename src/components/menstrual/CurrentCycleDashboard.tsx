import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Droplets, Heart, Zap, Plus, Edit, Clock, Activity } from 'lucide-react';
import { useMenstrualCycle } from '@/hooks/useMenstrualCycle';
import { useSymptomMoodLog } from '@/hooks/useSymptomMoodLog';
import QuickSymptomDialog from './QuickSymptomDialog';
import { format, differenceInDays, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const CurrentCycleDashboard = () => {
  const { cycles, loading, addCycle } = useMenstrualCycle();
  const { addLog } = useSymptomMoodLog();
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);
  const [newCycleOpen, setNewCycleOpen] = useState(false);
  const [symptomDialogOpen, setSymptomDialogOpen] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  
  // Получаем текущий цикл (последний начатый)
  const currentCycle = cycles.find(cycle => !cycle.cycle_end_date) || cycles[0];
  
  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Расчет фазы цикла и прогнозов
  const getCyclePhase = () => {
    if (!currentCycle) return { phase: 'Нет данных', day: 0, progress: 0 };
    
    const startDate = new Date(currentCycle.cycle_start_date);
    const today = new Date();
    const dayOfCycle = differenceInDays(today, startDate) + 1;
    const cycleLength = currentCycle.cycle_length || 28;
    const progress = Math.min((dayOfCycle / cycleLength) * 100, 100);
    
    let phase = '';
    if (dayOfCycle <= (currentCycle.period_length || 5)) {
      phase = 'Менструация';
    } else if (dayOfCycle <= 13) {
      phase = 'Фолликулярная фаза';
    } else if (dayOfCycle <= 15) {
      phase = 'Овуляция';
    } else {
      phase = 'Лютеиновая фаза';
    }
    
    return { phase, day: dayOfCycle, progress };
  };

  const { phase, day, progress } = getCyclePhase();

  const getNextPredictions = () => {
    if (!currentCycle) return { nextPeriod: null, nextOvulation: null };
    
    const startDate = new Date(currentCycle.cycle_start_date);
    const cycleLength = currentCycle.cycle_length || 28;
    const nextPeriod = addDays(startDate, cycleLength);
    const nextOvulation = addDays(startDate, Math.floor(cycleLength / 2));
    
    return { nextPeriod, nextOvulation };
  };

  const { nextPeriod, nextOvulation } = getNextPredictions();

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Менструация': return 'from-red-500 to-red-600';
      case 'Фолликулярная фаза': return 'from-blue-500 to-blue-600';
      case 'Овуляция': return 'from-green-500 to-green-600';
      case 'Лютеиновая фаза': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getMetricColor = (type: 'day' | 'cycle' | 'period') => {
    switch (type) {
      case 'day': return 'from-pink-500 to-rose-500';
      case 'cycle': return 'from-indigo-500 to-purple-500';
      case 'period': return 'from-teal-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleQuickNote = async () => {
    if (!quickNote.trim()) return;
    
    try {
      await addLog({
        log_date: new Date().toISOString().split('T')[0],
        notes: quickNote,
        symptoms: [],
        mood_rating: undefined
      });
      setQuickNote('');
      setQuickNoteOpen(false);
      toast.success('Заметка добавлена');
    } catch (error) {
      toast.error('Ошибка при добавлении заметки');
    }
  };

  const handleNewCycle = async () => {
    try {
      await addCycle({
        cycle_start_date: new Date().toISOString().split('T')[0],
        cycle_length: 28,
        period_length: 5
      });
      setNewCycleOpen(false);
      toast.success('Новый цикл начат');
    } catch (error) {
      toast.error('Ошибка при добавлении цикла');
    }
  };

  const commonSymptoms = [
    'Боли внизу живота', 'Головная боль', 'Усталость', 
    'Тошнота', 'Раздражительность', 'Отеки'
  ];

  const handleQuickSymptom = async (symptom: string) => {
    try {
      await addLog({
        log_date: new Date().toISOString().split('T')[0],
        symptoms: [symptom],
        notes: `Быстро добавлено: ${symptom}`
      });
      toast.success(`Симптом "${symptom}" добавлен`);
    } catch (error) {
      toast.error('Ошибка при добавлении симптома');
    }
  };

  return (
    <div className="space-y-8">
      {/* Текущий цикл с улучшенной визуализацией */}
      <Card className="border-2 border-gradient-to-r from-pink-200 via-purple-200 to-blue-200 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Текущий цикл
              </CardTitle>
              <CardDescription className="text-lg text-gray-700 mt-2">
                {currentCycle ? 
                  `Начался ${format(new Date(currentCycle.cycle_start_date), 'dd MMMM yyyy', { locale: ru })}` :
                  'Готовы начать отслеживание? Добавьте свой первый цикл!'
                }
              </CardDescription>
            </div>
            <Badge className={`bg-gradient-to-r ${getPhaseColor(phase)} text-white text-base px-4 py-2 shadow-md`}>
              {phase}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center group">
              <div className={`text-4xl font-bold bg-gradient-to-r ${getMetricColor('day')} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200`}>
                {day}
              </div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                День цикла
              </div>
            </div>
            <div className="text-center group">
              <div className={`text-4xl font-bold bg-gradient-to-r ${getMetricColor('cycle')} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200`}>
                {currentCycle?.cycle_length || 28}
              </div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Длина цикла
              </div>
            </div>
            <div className="text-center group">
              <div className={`text-4xl font-bold bg-gradient-to-r ${getMetricColor('period')} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200`}>
                {currentCycle?.period_length || 5}
              </div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Дней менструации
              </div>
            </div>
          </div>
          
          {/* Улучшенная визуализация прогресса */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-800 mb-4">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Прогресс цикла
              </span>
              <span className={`text-2xl font-bold bg-gradient-to-r ${getPhaseColor(phase)} bg-clip-text text-transparent`}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner"
              />
              <div 
                className={`absolute top-0 left-0 h-4 bg-gradient-to-r ${getPhaseColor(phase)} rounded-full transition-all duration-500 shadow-md`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Начало</span>
              <span className="font-medium">{phase}</span>
              <span>Конец цикла</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Прогнозы с улучшенной визуализацией */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-red-100 to-pink-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-red-700 text-xl">
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              Следующая менструация
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {nextPeriod ? (
              <div>
                <div className="text-3xl font-bold text-red-700 mb-3">
                  {format(nextPeriod, 'dd MMMM', { locale: ru })}
                </div>
                <div className="text-lg text-gray-700 font-medium">
                  Через {differenceInDays(nextPeriod, new Date())} дней
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-lg">Нет данных для прогноза</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-green-700 text-xl">
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                <Zap className="w-6 h-6 text-white" />
              </div>
              Следующая овуляция
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {nextOvulation ? (
              <div>
                <div className="text-3xl font-bold text-green-700 mb-3">
                  {format(nextOvulation, 'dd MMMM', { locale: ru })}
                </div>
                <div className="text-lg text-gray-700 font-medium">
                  Через {Math.max(0, differenceInDays(nextOvulation, new Date()))} дней
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-lg">Нет данных для прогноза</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Быстрые действия с улучшенной интерактивностью */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-gradient-to-r from-purple-200 to-pink-200">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" />
            Быстрые действия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Dialog open={newCycleOpen} onOpenChange={setNewCycleOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12">
                  <Plus className="w-5 h-5 mr-2" />
                  Начать новый цикл
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Начать новый цикл</DialogTitle>
                  <DialogDescription>
                    Это действие начнет отслеживание нового менструального цикла с сегодняшней даты.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4 pt-4">
                  <Button onClick={handleNewCycle} className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700">
                    Подтвердить
                  </Button>
                  <Button variant="outline" onClick={() => setNewCycleOpen(false)} className="flex-1">
                    Отмена
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={quickNoteOpen} onOpenChange={setQuickNoteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-300 h-12">
                  <Edit className="w-5 h-5 mr-2" />
                  Быстрая заметка
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить заметку</DialogTitle>
                  <DialogDescription>
                    Запишите что-то важное о своем самочувствии сегодня.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Напишите вашу заметку..."
                  className="min-h-24"
                />
                <div className="flex gap-4 pt-4">
                  <Button onClick={handleQuickNote} className="flex-1" disabled={!quickNote.trim()}>
                    Сохранить
                  </Button>
                  <Button variant="outline" onClick={() => setQuickNoteOpen(false)} className="flex-1">
                    Отмена
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300 h-12"
              onClick={() => setSymptomDialogOpen(true)}
            >
              <Heart className="w-5 h-5 mr-2" />
              Добавить симптомы
            </Button>

            <Button variant="outline" className="border-2 border-green-200 text-green-700 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-300 h-12">
              <Calendar className="w-5 h-5 mr-2" />
              Просмотреть историю
            </Button>
          </div>

          {/* Быстрое добавление частых симптомов */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Быстро добавить симптом
            </h4>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <Button
                  key={symptom}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSymptom(symptom)}
                  className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Диалог добавления симптомов */}
      <QuickSymptomDialog 
        open={symptomDialogOpen} 
        onOpenChange={setSymptomDialogOpen} 
      />
    </div>
  );
};

export default CurrentCycleDashboard;
