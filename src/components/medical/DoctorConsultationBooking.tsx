
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, User, Star, DollarSign } from "lucide-react";
import { useDoctorProfiles } from '@/hooks/useDoctorProfiles';
import { useAvailableSlots } from '@/hooks/useDoctorSchedules';
import { useCreateBooking } from '@/hooks/useConsultationBookings';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

const DoctorConsultationBooking = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: doctors, isLoading: doctorsLoading } = useDoctorProfiles();
  const { data: availableSlots } = useAvailableSlots(selectedDoctor || undefined, selectedDate);
  const createBooking = useCreateBooking();

  // Генерируем даты на неделю вперед
  const getWeekDates = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        display: format(date, 'EEE, d MMM', { locale: ru })
      };
    });
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedSlot || !user) {
      toast({
        title: "Ошибка",
        description: "Выберите врача и время консультации",
        variant: "destructive",
      });
      return;
    }

    const slot = availableSlots?.find(s => s.id === selectedSlot);
    if (!slot) return;

    try {
      await createBooking.mutateAsync({
        patient_id: user.id,
        doctor_id: selectedDoctor,
        schedule_id: selectedSlot,
        booking_date: selectedDate,
        booking_time: slot.start_time,
        consultation_type: 'consultation',
        status: 'scheduled',
        payment_amount: doctors?.find(d => d.id === selectedDoctor)?.consultation_fee || 0,
        payment_status: 'pending'
      });

      toast({
        title: "Консультация забронирована",
        description: "Ваша консультация успешно забронирована",
      });

      setSelectedSlot(null);
      setSelectedDate('');
      setSelectedDoctor(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось забронировать консультацию",
        variant: "destructive",
      });
    }
  };

  if (doctorsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Загрузка врачей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Запись на консультацию
        </h2>
        <p className="text-gray-600">
          Выберите врача и удобное время для консультации
        </p>
      </div>

      {/* Список врачей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.map((doctor) => (
          <Card 
            key={doctor.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedDoctor === doctor.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedDoctor(doctor.id)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={doctor.photo_url} alt={doctor.full_name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100">
                    {doctor.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{doctor.full_name}</CardTitle>
                  <CardDescription>{doctor.specialization}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {doctor.experience_years && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {doctor.experience_years} лет опыта
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {doctor.consultation_fee}₽ за консультацию
                </div>
                {doctor.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Выбор даты и времени */}
      {selectedDoctor && (
        <Card>
          <CardHeader>
            <CardTitle>Выберите дату и время</CardTitle>
            <CardDescription>
              Доступные слоты для консультации
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Выбор даты */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Выберите дату:</h3>
              <div className="grid grid-cols-7 gap-2">
                {getWeekDates().map(({ date, display }) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className="text-xs"
                  >
                    {display}
                  </Button>
                ))}
              </div>
            </div>

            {/* Выбор времени */}
            {selectedDate && (
              <div>
                <h3 className="text-sm font-medium mb-3">Доступное время:</h3>
                {availableSlots && availableSlots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedSlot === slot.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSlot(slot.id)}
                      >
                        {format(new Date(`2000-01-01T${slot.start_time}`), 'HH:mm')}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Нет доступных слотов на выбранную дату</p>
                )}
              </div>
            )}

            {/* Кнопка бронирования */}
            {selectedSlot && (
              <div className="mt-6 pt-6 border-t">
                <Button 
                  onClick={handleBooking}
                  disabled={createBooking.isPending}
                  className="w-full"
                  size="lg"
                >
                  Забронировать консультацию
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorConsultationBooking;
