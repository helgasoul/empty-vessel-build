
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';

const SchedulePage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Моковые данные расписания
  const [appointments] = useState([
    {
      id: 1,
      time: '09:00',
      patient: 'Анна Петрова',
      type: 'Консультация',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: 2,
      time: '10:30',
      patient: 'Мария Иванова',
      type: 'Обсуждение анализов',
      duration: 30,
      status: 'pending'
    },
    {
      id: 3,
      time: '14:00',
      patient: 'Елена Сидорова',
      type: 'Повторная консультация',
      duration: 45,
      status: 'confirmed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                ← Назад к дашборду
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                📅 Расписание
              </h1>
            </div>
            
            <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Новая встреча</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-rose-600" />
                <span>Календарь</span>
              </h2>
              {/* Здесь будет компонент календаря */}
              <div className="text-center text-gray-500 py-12">
                Календарь будет здесь
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Clock className="w-6 h-6 text-rose-600" />
                <span>Сегодня, 21 июня 2025</span>
              </h2>

              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gradient-to-r from-rose-25 to-pink-25 rounded-xl p-4 border border-rose-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-rose-600">
                          {appointment.time}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{appointment.patient}</h3>
                          <p className="text-gray-600">{appointment.type}</p>
                          <p className="text-sm text-gray-500">{appointment.duration} мин</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status === 'confirmed' ? 'Подтверждено' : 
                           appointment.status === 'pending' ? 'Ожидает' : 'Отменено'}
                        </span>
                        
                        <div className="flex space-x-1">
                          <button className="p-2 hover:bg-rose-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-rose-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;
