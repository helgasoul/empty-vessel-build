
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus, Eye, MessageCircle, Calendar } from 'lucide-react';

const PatientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Моковые данные пациентов
  const [patients] = useState([
    {
      id: 1,
      name: 'Анна Петрова',
      age: 38,
      lastVisit: '15.06.2025',
      status: 'active',
      riskLevel: 'low',
      newResults: 2,
      avatar: '👩‍💼'
    },
    {
      id: 2,
      name: 'Мария Иванова',
      age: 42,
      lastVisit: '10.06.2025',
      status: 'active',
      riskLevel: 'medium',
      newResults: 0,
      avatar: '👩‍🔬'
    },
    {
      id: 3,
      name: 'Елена Сидорова',
      age: 35,
      lastVisit: '20.06.2025',
      status: 'urgent',
      riskLevel: 'high',
      newResults: 5,
      avatar: '👩‍🎨'
    }
  ]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'urgent': return 'bg-red-100 text-red-800'
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
                👥 Мои пациенты
              </h1>
            </div>
            
            <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Добавить пациента</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск пациентов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors bg-white/80 backdrop-blur-sm">
            <Filter className="w-5 h-5 text-rose-600" />
            <span className="text-rose-600 font-medium">Фильтры</span>
          </button>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center text-white text-xl">
                    {patient.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{patient.name}</h3>
                    <p className="text-gray-600">{patient.age} лет</p>
                  </div>
                </div>
                {patient.newResults > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {patient.newResults} новых
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Последний визит:</span>
                  <span className="font-medium">{patient.lastVisit}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Статус:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status === 'active' ? 'Активный' : 'Требует внимания'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Уровень риска:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                    {patient.riskLevel === 'low' ? 'Низкий' : 
                     patient.riskLevel === 'medium' ? 'Средний' : 'Высокий'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Открыть</span>
                </button>
                <button className="px-3 py-2 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors">
                  <MessageCircle className="w-4 h-4 text-rose-600" />
                </button>
                <button className="px-3 py-2 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors">
                  <Calendar className="w-4 h-4 text-rose-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PatientsPage;
