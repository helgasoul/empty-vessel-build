
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Phone, Star, User, Stethoscope, ExternalLink } from 'lucide-react';
import { useMedicalAppointments } from '@/hooks/useMedicalAppointments';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const AppointmentBooking = () => {
  const { 
    providers, 
    doctors, 
    appointments, 
    loading, 
    fetchDoctors, 
    createAppointment 
  } = useMedicalAppointments();

  // Обновленные клиники-партнеры
  const staticProviders = [
    {
      id: 'chaika-clinic',
      name: 'Клиника Чайка',
      provider_type: 'clinic',
      address: 'Литовский бульвар, 1А, Москва',
      phone: '+7 (495) 104-80-03',
      website: 'https://chaika.com',
      rating: 4.8,
      specializations: ['Многопрофильная клиника', 'Женское здоровье', 'Диагностика'],
      is_active: true
    },
    {
      id: 'ilinskaya-hospital',
      name: 'Ильинская больница',
      provider_type: 'hospital',
      address: 'пос. Отрадное, ул. Красногорская, д. 15, стр. 1',
      phone: '+7 (495) 620-84-30',
      website: 'https://ilinskaya-hospital.ru',
      rating: 4.9,
      specializations: ['Многопрофильная больница', 'Хирургия', 'Кардиология'],
      is_active: true
    },
    {
      id: 'dnkom-lab',
      name: 'Лаборатория ДНКом',
      provider_type: 'laboratory',
      address: 'ул. Новый Арбат, 36/9, Москва',
      phone: '+7 (495) 108-62-62',
      website: 'https://dnkom.ru',
      rating: 4.7,
      specializations: ['Лабораторная диагностика', 'Генетические тесты', 'Анализы крови'],
      is_active: true
    }
  ];

  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProviderChange = async (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedDoctor('');
    
    // Если выбрана статическая клиника, не пытаемся загружать врачей из API
    const isStaticProvider = staticProviders.some(p => p.id === providerId);
    if (!isStaticProvider) {
      await fetchDoctors(providerId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !appointmentType || !appointmentDate || !appointmentTime) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createAppointment({
        provider_id: selectedProvider,
        doctor_id: selectedDoctor || undefined,
        appointment_type: appointmentType as any,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason,
        notes,
        status: 'scheduled'
      });

      // Сброс формы
      setSelectedProvider('');
      setSelectedDoctor('');
      setAppointmentType('');
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectBooking = (provider: any) => {
    if (provider.website) {
      window.open(provider.website, '_blank', 'noopener,noreferrer');
    }
  };

  const getProviderTypeLabel = (type: string) => {
    const labels = {
      'clinic': 'Клиника',
      'laboratory': 'Лаборатория',
      'hospital': 'Больница',
      'diagnostic_center': 'Диагностический центр'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getAppointmentTypeLabel = (type: string) => {
    const labels = {
      'consultation': 'Консультация',
      'lab_test': 'Лабораторный анализ',
      'diagnostic': 'Диагностика',
      'procedure': 'Процедура',
      'telemedicine': 'Телемедицина'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'scheduled': 'Запланировано',
      'confirmed': 'Подтверждено',
      'in_progress': 'В процессе',
      'completed': 'Завершено',
      'cancelled': 'Отменено',
      'no_show': 'Не явился'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  // Фильтруем провайдеров из базы данных, исключая нежелательных
  const excludedProviderNames = [
    'Клиника Здоровье',
    'Клиника "Здоровье+"',
    'Диагностический центр "Точность"',
    'Диагностический центр точность',
    'Лаборатория "МедТест"',
    'Лаборатория МедТест'
  ];

  const filteredProviders = providers.filter(provider => 
    !excludedProviderNames.some(excludedName => 
      provider.name.toLowerCase().includes(excludedName.toLowerCase()) ||
      excludedName.toLowerCase().includes(provider.name.toLowerCase())
    )
  );

  // Объединяем статических провайдеров с отфильтрованными из базы данных
  const allProviders = [...staticProviders, ...filteredProviders];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Запись на прием</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Форма записи */}
        <Card>
          <CardHeader>
            <CardTitle>Новая запись</CardTitle>
            <CardDescription>
              Выберите клинику, врача и удобное время для приема
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="provider">Клиника / Лаборатория</Label>
                <Select value={selectedProvider} onValueChange={handleProviderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите клинику" />
                  </SelectTrigger>
                  <SelectContent>
                    {allProviders.map(provider => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getProviderTypeLabel(provider.provider_type)}
                          </Badge>
                          {provider.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProvider && doctors.length > 0 && (
                <div>
                  <Label htmlFor="doctor">Врач (опционально)</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите врача" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div>
                            <div className="font-medium">{doctor.full_name}</div>
                            <div className="text-sm text-gray-600">{doctor.specialization}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="appointmentType">Тип приема</Label>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип приема" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Консультация</SelectItem>
                    <SelectItem value="lab_test">Лабораторный анализ</SelectItem>
                    <SelectItem value="diagnostic">Диагностика</SelectItem>
                    <SelectItem value="procedure">Процедура</SelectItem>
                    <SelectItem value="telemedicine">Телемедицина</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Дата</Label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Время</Label>
                  <Input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Причина обращения</Label>
                <Input
                  placeholder="Опишите причину визита"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="notes">Дополнительные примечания</Label>
                <Textarea
                  placeholder="Любая дополнительная информация"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedProvider || !appointmentType || !appointmentDate || !appointmentTime}
                className="w-full"
              >
                {isSubmitting ? 'Создание записи...' : 'Записаться'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Список доступных провайдеров */}
        <Card>
          <CardHeader>
            <CardTitle>Партнерские клиники</CardTitle>
            <CardDescription>
              Наши партнеры готовы предоставить вам качественные медицинские услуги
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allProviders.map(provider => (
                <div key={provider.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      <Badge variant="outline" className="mt-1">
                        {getProviderTypeLabel(provider.provider_type)}
                      </Badge>
                    </div>
                    {provider.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{provider.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  {provider.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      {provider.address}
                    </div>
                  )}
                  
                  {provider.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="w-4 h-4" />
                      {provider.phone}
                    </div>
                  )}
                  
                  {provider.specializations && provider.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {provider.website && (
                    <Button 
                      onClick={() => handleDirectBooking(provider)}
                      className="w-full mt-2"
                      variant="outline"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Записаться на сайте клиники
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Текущие записи */}
      {appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ваши записи</CardTitle>
            <CardDescription>
              Все ваши назначенные приемы и их статус
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.slice(0, 5).map(appointment => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                        <Badge variant="outline">
                          {getAppointmentTypeLabel(appointment.appointment_type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(appointment.appointment_date), 'dd MMMM yyyy', { locale: ru })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.appointment_time}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.reason && (
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Причина:</strong> {appointment.reason}
                    </p>
                  )}
                  
                  {appointment.notes && (
                    <p className="text-xs text-gray-600">
                      <strong>Примечания:</strong> {appointment.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentBooking;
