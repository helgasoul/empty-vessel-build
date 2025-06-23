import React, { useState } from 'react';
import { Heart, Shield, Users, Calendar, FlaskConical, Building2, UserCog, ArrowRight, CheckCircle, Star, Lock, Zap } from 'lucide-react';
import { RegisterModal } from './RegisterModal';

interface UserRole {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  accent: string;
}

const userRoles: UserRole[] = [
  {
    id: 'patient',
    title: 'Пациент',
    description: 'Персональная забота о вашем здоровье',
    icon: <Heart className="w-8 h-8" />,
    features: [
      'Персональная оценка рисков здоровья',
      'ИИ-рекомендации по профилактике',
      'Трекинг женского здоровья и цикла',
      'Интеграция с носимыми устройствами',
      'Календарь обследований',
      'Семейная история здоровья'
    ],
    color: 'from-rose-400 to-pink-500',
    accent: 'rose'
  },
  {
    id: 'doctor',
    title: 'Врач',
    description: 'Инструменты для качественной медицинской помощи',
    icon: <Shield className="w-8 h-8" />,
    features: [
      'Доступ к комплексным данным пациентов',
      'ИИ-ассистент для диагностики',
      'Персонализированные рекомендации',
      'Система записи и календарь приемов',
      'Телемедицинские консультации',
      'Аналитика эффективности лечения'
    ],
    color: 'from-blue-400 to-indigo-500',
    accent: 'blue'
  },
  {
    id: 'clinic',
    title: 'Клиника',
    description: 'Управление медицинской организацией',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Управление расписанием врачей',
      'Система электронных записей',
      'Аналитика работы клиники',
      'Интеграция с лабораториями',
      'Финансовая отчетность',
      'Программы скрининга для женщин'
    ],
    color: 'from-emerald-400 to-teal-500',
    accent: 'emerald'
  },
  {
    id: 'laboratory',
    title: 'Лаборатория',
    description: 'Цифровая трансформация лабораторных услуг',
    icon: <FlaskConical className="w-8 h-8" />,
    features: [
      'Интеграция результатов анализов',
      'Автоматическая интерпретация данных',
      'Персонализированные панели тестов',
      'Система контроля качества',
      'API для медицинских организаций',
      'Генетическое тестирование'
    ],
    color: 'from-purple-400 to-violet-500',
    accent: 'purple'
  },
  {
    id: 'admin',
    title: 'Администратор',
    description: 'Управление платформой и безопасностью',
    icon: <UserCog className="w-8 h-8" />,
    features: [
      'Управление пользователями и ролями',
      'Мониторинг безопасности данных',
      'Аналитика использования платформы',
      'Настройка интеграций',
      'Управление контентом',
      'Техническая поддержка'
    ],
    color: 'from-gray-400 to-slate-500',
    accent: 'gray'
  }
];

export const LandingPage: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Prevent
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-rose-600 transition-colors">
              Возможности
            </a>
            <a href="#roles" className="text-gray-600 hover:text-rose-600 transition-colors">
              Для кого
            </a>
            <a href="#about" className="text-gray-600 hover:text-rose-600 transition-colors">
              О платформе
            </a>
            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Войти
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Ваше здоровье —{' '}
            <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              наша забота
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Персональная платформа женского здоровья с ИИ-анализом, 
            генетическим тестированием и индивидуальными рекомендациями 
            для каждого этапа вашей жизни
          </p>
          
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Начать заботу о здоровье
            <ArrowRight className="w-5 h-5 ml-2 inline-block" />
          </button>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Prevent для каждого{' '}
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                участника
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Выберите свою роль и получите доступ к персонализированному функционалу
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userRoles.map((role) => (
              <div 
                key={role.id} 
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-rose-200 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 cursor-pointer"
                onClick={() => handleRoleSelect(role.id)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {role.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {role.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {role.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {role.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-rose-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                  {role.features.length > 4 && (
                    <li className="text-gray-500 text-sm italic">
                      +{role.features.length - 4} дополнительных возможностей
                    </li>
                  )}
                </ul>
                
                <button className={`w-full bg-gradient-to-r ${role.color} text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  Зарегистрироваться как {role.title}
                  <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <RegisterModal 
          isOpen={isRegisterModalOpen}
          onClose={() => {
            setIsRegisterModalOpen(false);
            setSelectedRole(null);
          }}
          preselectedRole={selectedRole}
        />
      )}
    </div>
  );
};