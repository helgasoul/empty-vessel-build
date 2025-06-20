
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useMenstrualCycle } from '@/hooks/useMenstrualCycle';
import { useSymptomMoodLog } from '@/hooks/useSymptomMoodLog';

const CycleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { cycles } = useMenstrualCycle();
  const { logs } = useSymptomMoodLog();

  const getDayInfo = (date: Date) => {
    const currentCycle = cycles.find(cycle => {
      const startDate = new Date(cycle.cycle_start_date);
      const endDate = cycle.cycle_end_date ? new Date(cycle.cycle_end_date) : addDays(startDate, cycle.cycle_length || 28);
      return date >= startDate && date <= endDate;
    });

    const symptomsForDay = logs.find(log => isSameDay(new Date(log.log_date), date));

    let type = '';
    let color = '';

    if (currentCycle) {
      const startDate = new Date(currentCycle.cycle_start_date);
      const dayOfCycle = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const periodLength = currentCycle.period_length || 5;
      const cycleLength = currentCycle.cycle_length || 28;

      if (dayOfCycle <= periodLength) {
        type = 'Менструация';
        color = 'bg-red-500';
      } else if (dayOfCycle >= Math.floor(cycleLength / 2) - 2 && dayOfCycle <= Math.floor(cycleLength / 2) + 2) {
        type = 'Овуляция';
        color = 'bg-green-500';
      } else if (dayOfCycle <= 13) {
        type = 'Фолликулярная';
        color = 'bg-blue-500';
      } else {
        type = 'Лютеиновая';
        color = 'bg-yellow-500';
      }
    }

    return { type, color, symptoms: symptomsForDay, dayOfCycle: currentCycle ? Math.floor((date.getTime() - new Date(currentCycle.cycle_start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1 : null };
  };

  const customDayContent = (day: Date) => {
    const dayInfo = getDayInfo(day);
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className="text-sm">{format(day, 'd')}</span>
        {dayInfo.color && (
          <div className={`w-2 h-2 rounded-full ${dayInfo.color} mt-1`} />
        )}
        {dayInfo.symptoms && (
          <div className="w-1 h-1 bg-purple-400 rounded-full absolute top-1 right-1" />
        )}
      </div>
    );
  };

  const selectedDayInfo = selectedDate ? getDayInfo(selectedDate) : null;

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Календарь цикла</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                components={{
                  DayContent: ({ date }) => customDayContent(date)
                }}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Легенда</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Менструация</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Фолликулярная фаза</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Овуляция</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Лютеиновая фаза</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <span className="text-sm">Есть записи о симптомах</span>
                  </div>
                </div>
              </div>

              {selectedDate && selectedDayInfo && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                  </h4>
                  
                  {selectedDayInfo.type && (
                    <div className="mb-2">
                      <Badge className={`${selectedDayInfo.color} text-white`}>
                        {selectedDayInfo.type}
                      </Badge>
                      {selectedDayInfo.dayOfCycle && (
                        <span className="ml-2 text-sm text-gray-600">
                          День цикла: {selectedDayInfo.dayOfCycle}
                        </span>
                      )}
                    </div>
                  )}

                  {selectedDayInfo.symptoms && (
                    <div className="mt-3">
                      <h5 className="font-medium text-sm mb-2">Симптомы:</h5>
                      {selectedDayInfo.symptoms.symptoms && selectedDayInfo.symptoms.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {selectedDayInfo.symptoms.symptoms.map(symptom => (
                            <Badge key={symptom} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {selectedDayInfo.symptoms.mood_rating && (
                        <div className="text-sm text-gray-600">
                          Настроение: {selectedDayInfo.symptoms.mood_rating}/10
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CycleCalendar;
