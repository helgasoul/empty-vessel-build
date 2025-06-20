import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Plus, Pill, Clock, CheckCircle, AlertTriangle, Calendar, User, Sun, Moon } from 'lucide-react';
import { useMedications } from '@/hooks/useMedications';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const MedicationReminders = () => {
  const { treatmentPlans, medications, reminders, loading, addTreatmentPlan, addMedication, addReminder, logMedicationTaken } = useMedications();
  const [activeTab, setActiveTab] = useState<'plans' | 'medications' | 'reminders'>('plans');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    // Treatment Plan
    plan_name: '',
    doctor_name: '',
    start_date: '',
    end_date: '',
    notes: '',
    // Medication
    medication_name: '',
    dosage: '',
    frequency: '',
    times_per_day: '1',
    instructions: '',
    side_effects: '',
    treatment_plan_id: '',
    // Reminder
    reminder_time: '',
    days_of_week: [1, 2, 3, 4, 5, 6, 7] as number[],
    medication_id: ''
  });

  const weekDays = [
    { value: 1, label: 'Пн' },
    { value: 2, label: 'Вт' },
    { value: 3, label: 'Ср' },
    { value: 4, label: 'Чт' },
    { value: 5, label: 'Пт' },
    { value: 6, label: 'Сб' },
    { value: 7, label: 'Вс' }
  ];

  const medicationTypes = {
    hormones: { color: 'bg-purple-100 border-purple-300 text-purple-800', icon: '🌸' },
    vitamins: { color: 'bg-yellow-100 border-yellow-300 text-yellow-800', icon: '☀️' },
    cardiac: { color: 'bg-red-100 border-red-300 text-red-800', icon: '❤️' },
    pain: { color: 'bg-blue-100 border-blue-300 text-blue-800', icon: '💊' },
    default: { color: 'bg-gray-100 border-gray-300 text-gray-800', icon: '💊' }
  };

  const getMedicationType = (medicationName: string) => {
    const name = medicationName.toLowerCase();
    if (name.includes('гормон') || name.includes('эстроген') || name.includes('прогестерон')) return 'hormones';
    if (name.includes('витамин') || name.includes('д3') || name.includes('омега')) return 'vitamins';
    if (name.includes('кардио') || name.includes('давление')) return 'cardiac';
    if (name.includes('боль') || name.includes('анальгин')) return 'pain';
    return 'default';
  };

  const calculatePlanProgress = (plan: any) => {
    if (!plan.start_date || !plan.end_date) return 0;
    const startDate = parseISO(plan.start_date);
    const endDate = parseISO(plan.end_date);
    const today = new Date();
    
    const totalDays = differenceInDays(endDate, startDate);
    const passedDays = differenceInDays(today, startDate);
    
    return Math.min(Math.max((passedDays / totalDays) * 100, 0), 100);
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return hour < 12 ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-blue-500" />;
  };

  const handleSubmitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTreatmentPlan({
        plan_name: formData.plan_name,
        doctor_name: formData.doctor_name || undefined,
        start_date: formData.start_date,
        end_date: formData.end_date || undefined,
        notes: formData.notes || undefined,
        is_active: true
      });
      setIsAdding(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка при добавлении плана лечения:', error);
    }
  };

  const handleSubmitMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMedication({
        treatment_plan_id: formData.treatment_plan_id,
        medication_name: formData.medication_name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        times_per_day: parseInt(formData.times_per_day),
        instructions: formData.instructions || undefined,
        side_effects: formData.side_effects || undefined,
        is_active: true
      });
      setIsAdding(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка при добавлении лекарства:', error);
    }
  };

  const handleSubmitReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReminder({
        medication_id: formData.medication_id,
        reminder_time: formData.reminder_time,
        days_of_week: formData.days_of_week,
        is_active: true
      });
      setIsAdding(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка при добавлении напоминания:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      plan_name: '',
      doctor_name: '',
      start_date: '',
      end_date: '',
      notes: '',
      medication_name: '',
      dosage: '',
      frequency: '',
      times_per_day: '1',
      instructions: '',
      side_effects: '',
      treatment_plan_id: '',
      reminder_time: '',
      days_of_week: [1, 2, 3, 4, 5, 6, 7],
      medication_id: ''
    });
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day].sort()
    }));
  };

  const handleMedicationTaken = async (medicationId: string) => {
    try {
      await logMedicationTaken(medicationId);
    } catch (error) {
      console.error('Ошибка при регистрации приема лекарства:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление лекарствами</h1>
        <p className="text-gray-600">Отслеживайте приём препаратов и не пропускайте важные моменты</p>
      </div>

      <div className="flex space-x-1 bg-gradient-to-r from-purple-50 to-blue-50 p-1 rounded-xl border">
        {[
          { key: 'plans', label: 'Планы лечения', icon: <Calendar className="w-4 h-4" /> },
          { key: 'medications', label: 'Лекарства', icon: <Pill className="w-4 h-4" /> },
          { key: 'reminders', label: 'Напоминания', icon: <Clock className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === tab.key
                ? 'bg-white text-purple-700 shadow-md border border-purple-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Treatment Plans */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Новый план лечения
            </Button>
          </div>

          {isAdding && (
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="text-purple-800">Новый план лечения</CardTitle>
                <CardDescription>Создайте план для систематического приёма препаратов</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitPlan} className="space-y-4">
                  <div>
                    <Label htmlFor="plan-name">Название плана</Label>
                    <Input
                      id="plan-name"
                      value={formData.plan_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, plan_name: e.target.value }))}
                      placeholder="например, Гормональная терапия"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctor-name">Назначивший врач</Label>
                    <Input
                      id="doctor-name"
                      value={formData.doctor_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                      placeholder="или оставьте пустым для личного плана"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Дата начала</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">Дата окончания</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Заметки</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Цель терапии, особенности..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      Сохранить план
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

          {treatmentPlans.length === 0 ? (
            <Card className="border-dashed border-2 border-purple-200">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">У вас пока нет планов лечения</h3>
                <p className="text-gray-600 mb-4">Создайте первый план, чтобы систематизировать приём препаратов</p>
                <Button 
                  onClick={() => setIsAdding(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Создать первый план
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {treatmentPlans.map(plan => {
                const progress = calculatePlanProgress(plan);
                const planMedications = medications.filter(med => med.treatment_plan_id === plan.id);
                
                return (
                  <Card key={plan.id} className={`border-l-4 ${plan.is_active ? 'border-l-purple-500 bg-gradient-to-r from-purple-50/50 to-transparent' : 'border-l-gray-300 bg-gray-50'}`}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{plan.plan_name}</h3>
                            <Badge variant={plan.is_active ? "default" : "secondary"} className={plan.is_active ? 'bg-purple-100 text-purple-800' : ''}>
                              {plan.is_active ? 'Активный' : 'Завершён'}
                            </Badge>
                          </div>
                          
                          {plan.doctor_name && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <User className="w-4 h-4" />
                              <span>Назначен: {plan.doctor_name}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(plan.start_date), 'dd.MM.yyyy', { locale: ru })}
                              {plan.end_date && (
                                <> – {format(new Date(plan.end_date), 'dd.MM.yyyy', { locale: ru })}</>
                              )}
                            </span>
                          </div>

                          {plan.end_date && plan.is_active && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Прогресс</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          )}

                          {planMedications.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500 mb-2">Препараты в плане:</p>
                              <div className="flex flex-wrap gap-1">
                                {planMedications.map(med => (
                                  <Badge key={med.id} variant="outline" className="text-xs">
                                    {med.medication_name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {plan.notes && (
                            <p className="text-sm text-gray-600">{plan.notes}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Medications */}
      {activeTab === 'medications' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              disabled={treatmentPlans.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить лекарство
            </Button>
          </div>

          {treatmentPlans.length === 0 ? (
            <Card className="border-dashed border-2 border-blue-200">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Сначала создайте план лечения</h3>
                <p className="text-gray-600 mb-4">Препараты добавляются в рамках планов лечения</p>
                <Button 
                  onClick={() => setActiveTab('plans')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Перейти к планам
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {isAdding && (
                <Card className="border-blue-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="text-blue-800">Новое лекарство</CardTitle>
                    <CardDescription>Добавьте препарат в план лечения</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmitMedication} className="space-y-4">
                      <div>
                        <Label htmlFor="treatment-plan">План лечения</Label>
                        <select
                          id="treatment-plan"
                          value={formData.treatment_plan_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, treatment_plan_id: e.target.value }))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Выберите план лечения</option>
                          {treatmentPlans.filter(plan => plan.is_active).map(plan => (
                            <option key={plan.id} value={plan.id}>{plan.plan_name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="medication-name">Название лекарства</Label>
                          <Input
                            id="medication-name"
                            value={formData.medication_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, medication_name: e.target.value }))}
                            placeholder="например, Фемостон 1/10"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="dosage">Дозировка</Label>
                          <Input
                            id="dosage"
                            value={formData.dosage}
                            onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                            placeholder="1 табл."
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="frequency">Частота приёма</Label>
                          <Input
                            id="frequency"
                            value={formData.frequency}
                            onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                            placeholder="1 раз в день"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="times-per-day">Раз в день</Label>
                          <Input
                            id="times-per-day"
                            type="number"
                            min="1"
                            value={formData.times_per_day}
                            onChange={(e) => setFormData(prev => ({ ...prev, times_per_day: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="instructions">Инструкции по приёму</Label>
                        <Textarea
                          id="instructions"
                          value={formData.instructions}
                          onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                          placeholder="Принимать во время еды, запивать водой..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="side-effects">Возможные побочные эффекты</Label>
                        <Textarea
                          id="side-effects"
                          value={formData.side_effects}
                          onChange={(e) => setFormData(prev => ({ ...prev, side_effects: e.target.value }))}
                          placeholder="На что обратить внимание..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Сохранить лекарство
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

              {medications.length === 0 ? (
                <Card className="border-dashed border-2 border-blue-200">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="text-6xl mb-4">💊</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">У вас пока нет добавленных препаратов</h3>
                    <p className="text-gray-600 mb-4">Добавьте первое лекарство в план лечения</p>
                    <Button 
                      onClick={() => setIsAdding(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={treatmentPlans.length === 0}
                    >
                      Добавить первый препарат
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {medications.map(medication => {
                    const type = getMedicationType(medication.medication_name);
                    const typeStyle = medicationTypes[type];
                    const plan = treatmentPlans.find(p => p.id === medication.treatment_plan_id);
                    
                    return (
                      <Card key={medication.id} className={`border-l-4 border-l-blue-500 ${typeStyle.color} border`}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{typeStyle.icon}</span>
                                <div>
                                  <h3 className="font-semibold text-lg">{medication.medication_name}</h3>
                                  <p className="text-sm opacity-75">
                                    {medication.dosage} • {medication.frequency}
                                  </p>
                                </div>
                              </div>
                              
                              {plan && (
                                <div className="text-sm opacity-75">
                                  📋 План: {plan.plan_name}
                                </div>
                              )}
                              
                              {medication.instructions && (
                                <div className="text-sm bg-white/50 p-3 rounded-lg">
                                  <strong>Инструкции:</strong> {medication.instructions}
                                </div>
                              )}
                              
                              {medication.side_effects && (
                                <div className="text-sm bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <strong className="text-yellow-800">Внимание:</strong>
                                    <p className="text-yellow-700">{medication.side_effects}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleMedicationTaken(medication.id)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Принято
                              </Button>
                              <Badge variant={medication.is_active ? "default" : "secondary"}>
                                {medication.is_active ? 'Активно' : 'Неактивно'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Reminders */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              disabled={medications.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Новое напоминание
            </Button>
          </div>

          {medications.length === 0 ? (
            <Card className="border-dashed border-2 border-green-200">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="text-6xl mb-4">⏰</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Сначала добавьте лекарства</h3>
                <p className="text-gray-600 mb-4">Напоминания создаются для конкретных препаратов</p>
                <Button 
                  onClick={() => setActiveTab('medications')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Перейти к лекарствам
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {isAdding && (
                <Card className="border-green-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
                    <CardTitle className="text-green-800">Новое напоминание</CardTitle>
                    <CardDescription>Настройте время приёма препарата</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmitReminder} className="space-y-4">
                      <div>
                        <Label htmlFor="medication">Лекарство</Label>
                        <select
                          id="medication"
                          value={formData.medication_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, medication_id: e.target.value }))}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        >
                          <option value="">Выберите лекарство</option>
                          {medications.filter(med => med.is_active).map(medication => (
                            <option key={medication.id} value={medication.id}>
                              {medication.medication_name} - {medication.dosage}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="reminder-time">Время напоминания</Label>
                        <Input
                          id="reminder-time"
                          type="time"
                          value={formData.reminder_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, reminder_time: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label>Дни недели</Label>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                          {weekDays.map(day => (
                            <div key={day.value} className="flex flex-col items-center">
                              <Checkbox
                                id={`day-${day.value}`}
                                checked={formData.days_of_week.includes(day.value)}
                                onCheckedChange={() => handleDayToggle(day.value)}
                              />
                              <Label htmlFor={`day-${day.value}`} className="text-xs mt-1">
                                {day.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                          Сохранить напоминание
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

              {reminders.length === 0 ? (
                <Card className="border-dashed border-2 border-green-200">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="text-6xl mb-4">⏰</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">У вас пока нет напоминаний</h3>
                    <p className="text-gray-600 mb-4">Создайте первое напоминание, чтобы не пропустить приём</p>
                    <Button 
                      onClick={() => setIsAdding(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Создать напоминание
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {reminders.map(reminder => {
                    const medication = medications.find(med => med.id === reminder.medication_id);
                    if (!medication) return null;
                    
                    return (
                      <Card key={reminder.id} className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                {getTimeIcon(reminder.reminder_time)}
                                <div>
                                  <h3 className="font-semibold">
                                    {medication.medication_name} в {reminder.reminder_time}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {medication.dosage}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Дни: {reminder.days_of_week.map(day => weekDays.find(wd => wd.value === day)?.label).join(', ')}
                                </span>
                              </div>
                              
                              {reminder.last_taken_at && (
                                <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                                  ✅ Последний приём: {format(new Date(reminder.last_taken_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 ml-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={reminder.is_active}
                                  onCheckedChange={() => {/* Handle toggle */}}
                                />
                                <span className="text-sm text-gray-600">
                                  {reminder.is_active ? 'Вкл' : 'Выкл'}
                                </span>
                              </div>
                              <Badge variant={reminder.is_active ? "default" : "secondary"}>
                                {reminder.is_active ? 'Активно' : 'Неактивно'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicationReminders;
