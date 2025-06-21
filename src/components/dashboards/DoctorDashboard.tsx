
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  Calculator, 
  Bell, 
  Heart,
  UserPlus,
  TrendingUp,
  MessageCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState(3);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    👩‍⚕️ Дашборд Врача
                  </h1>
                  <p className="text-rose-600 font-medium">
                    Добро пожаловать, {user?.name || 'Dr. helgasoul'}!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Уведомления */}
              <div className="relative">
                <button className="p-2 rounded-full bg-rose-100 hover:bg-rose-200 transition-colors">
                  <Bell className="w-5 h-5 text-rose-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
              
              <button
                onClick={signOut}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-600 text-sm font-medium">Всего пациентов</p>
                <p className="text-2xl font-bold text-gray-800">23</p>
              </div>
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Консультаций сегодня</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 text-sm font-medium">Новых анализов</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Сообщений</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Мои пациенты */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-rose-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                👥 Мои пациенты
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Список ваших пациентов с возможностью просмотра карт здоровья и анализов
              </p>
              <button
                onClick={() => handleNavigation('/doctor/patients')}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-2xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Управление пациентами
              </button>
            </div>
          </div>

          {/* Расписание */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                📅 Расписание
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Управляйте вашим расписанием консультаций и встреч с пациентами
              </p>
              <button
                onClick={() => handleNavigation('/doctor/schedule')}
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-2xl hover:from-orange-600 hover:to-rose-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Настроить расписание
              </button>
            </div>
          </div>

          {/* Калькуляторы */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                🧮 Калькуляторы
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Медицинские калькуляторы для анализа лабораторных исследований
              </p>
              <button
                onClick={() => handleNavigation('/doctor/calculators')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Открыть калькуляторы
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Последняя активность</h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-lg overflow-hidden">
            <div className="divide-y divide-rose-50">
              {[
                { time: '10:30', patient: 'Анна П.', action: 'Загрузила новые анализы крови', priority: 'high' },
                { time: '09:15', patient: 'Мария И.', action: 'Запросила консультацию по результатам УЗИ', priority: 'medium' },
                { time: '08:45', patient: 'Елена С.', action: 'Обновила данные в профиле здоровья', priority: 'low' }
              ].map((item, index) => (
                <div key={index} className="p-6 hover:bg-rose-25 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.priority === 'high' ? 'bg-red-400' :
                        item.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-800">{item.patient}</p>
                        <p className="text-gray-600">{item.action}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
