
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pill, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useMedications } from '@/hooks/useMedications';
import { format } from 'date-fns';
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-#4A90E2">Управление лекарствами</h2>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'plans', label: 'Планы лечения' },
          { key: 'medications', label: 'Лекарства' },
          { key: 'reminders', label: 'Напоминания' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-#4A90E2 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Treatment Plans */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-#4A90E2 hover:bg-#4A90E2/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Новый план лечения
            </Button>
          </div>

          {isAdding && (
            <Card>
              <CardHeader>
                <CardTitle>Новый план лечения</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPlan} className="space-y-4">
                  <div>
                    <Label htmlFor="plan-name">Название плана</Label>
                    <Input
                      id="plan-name"
                      value={formData.plan_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, plan_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctor-name">Врач</Label>
                    <Input
                      id="doctor-name"
                      value={formData.doctor_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
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
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-#4A90E2 hover:bg-#4A90E2/90">
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
            {treatmentPlans.map(plan => (
              <Card key={plan.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{plan.plan_name}</h3>
                      {plan.doctor_name && (
                        <p className="text-sm text-gray-600">Врач: {plan.doctor_name}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {format(new Date(plan.start_date), 'dd.MM.yyyy', { locale: ru })}
                        {plan.end_date && (
                          <> - {format(new Date(plan.end_date), 'dd.MM.yyyy', { locale: ru })}</>
                        )}
                      </p>
                      {plan.notes && (
                        <p className="text-sm text-gray-600 mt-2">{plan.notes}</p>
                      )}
                    </div>
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? 'Активный' : 'Завершен'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Medications */}
      {activeTab === 'medications' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-#4A90E2 hover:bg-#4A90E2/90"
              disabled={treatmentPlans.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить лекарство
            </Button>
          </div>

          {treatmentPlans.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">
                  Сначала создайте план лечения, чтобы добавить лекарства
                </p>
              </CardContent>
            </Card>
          )}

          {isAdding && (
            <Card>
              <CardHeader>
                <CardTitle>Новое лекарство</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitMedication} className="space-y-4">
                  <div>
                    <Label htmlFor="treatment-plan">План лечения</Label>
                    <select
                      id="treatment-plan"
                      value={formData.treatment_plan_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, treatment_plan_id: e.target.value }))}
                      className="w-full p-2 border rounded-md"
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dosage">Дозировка</Label>
                      <Input
                        id="dosage"
                        value={formData.dosage}
                        onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                        placeholder="например, 250 мг"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frequency">Частота приема</Label>
                      <Input
                        id="frequency"
                        value={formData.frequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                        placeholder="например, 2 раза в день"
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
                    <Label htmlFor="instructions">Инструкции</Label>
                    <Textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="Особые указания по приему..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="side-effects">Побочные эффекты</Label>
                    <Textarea
                      id="side-effects"
                      value={formData.side_effects}
                      onChange={(e) => setFormData(prev => ({ ...prev, side_effects: e.target.value }))}
                      placeholder="Возможные побочные эффекты..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-#4A90E2 hover:bg-#4A90E2/90">
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
            {medications.map(medication => (
              <Card key={medication.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-#4A90E2" />
                        <h3 className="font-medium">{medication.medication_name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Дозировка: {medication.dosage} | {medication.frequency}
                      </p>
                      {medication.instructions && (
                        <p className="text-sm text-gray-600">{medication.instructions}</p>
                      )}
                      {medication.side_effects && (
                        <p className="text-sm text-yellow-600">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          {medication.side_effects}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleMedicationTaken(medication.id)}
                        className="bg-green-500 hover:bg-green-600"
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
            ))}
          </div>
        </div>
      )}

      {/* Reminders */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-#4A90E2 hover:bg-#4A90E2/90"
              disabled={medications.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Новое напоминание
            </Button>
          </div>

          {medications.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">
                  Сначала добавьте лекарства, чтобы создать напоминания
                </p>
              </CardContent>
            </Card>
          )}

          {isAdding && (
            <Card>
              <CardHeader>
                <CardTitle>Новое напоминание</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReminder} className="space-y-4">
                  <div>
                    <Label htmlFor="medication">Лекарство</Label>
                    <select
                      id="medication"
                      value={formData.medication_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, medication_id: e.target.value }))}
                      className="w-full p-2 border rounded-md"
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
                    <div className="flex gap-2 mt-2">
                      {weekDays.map(day => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day.value}`}
                            checked={formData.days_of_week.includes(day.value)}
                            onCheckedChange={() => handleDayToggle(day.value)}
                          />
                          <Label htmlFor={`day-${day.value}`} className="text-sm">
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-#4A90E2 hover:bg-#4A90E2/90">
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
            {reminders.map(reminder => {
              const medication = medications.find(med => med.id === reminder.medication_id);
              return (
                <Card key={reminder.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-#4A90E2" />
                          <h3 className="font-medium">
                            {medication?.medication_name} в {reminder.reminder_time}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Дни: {reminder.days_of_week.map(day => weekDays.find(wd => wd.value === day)?.label).join(', ')}
                        </p>
                        {reminder.last_taken_at && (
                          <p className="text-sm text-green-600">
                            Последний прием: {format(new Date(reminder.last_taken_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                          </p>
                        )}
                      </div>
                      <Badge variant={reminder.is_active ? "default" : "secondary"}>
                        {reminder.is_active ? 'Активно' : 'Неактивно'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationReminders;
