import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Heart, 
  Brain, 
  Database, 
  Users, 
  Settings,
  Bell,
  Search,
  Calendar,
  Activity
} from 'lucide-react';
import { RiskCalculatorHub } from '../risk-calculators/RiskCalculatorHub';
import MenstrualCycleDashboard from '../menstrual/MenstrualCycleDashboard';
import { UserRole } from '../../types/risk-calculator.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UnifiedDashboardProps {
  userRole?: UserRole;
}

type ActiveSection = 'overview' | 'risk-assessment' | 'womens-health' | 'data-vault' | 'ai-assistant' | 'settings';

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  userRole = 'patient'
}) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');

  const navigationItems = [
    {
      id: 'overview',
      label: 'Обзор',
      icon: Activity,
      description: 'Общая информация о здоровье'
    },
    {
      id: 'risk-assessment',
      label: 'Оценка рисков',
      icon: Calculator,
      description: 'Калькуляторы медицинских рисков'
    },
    {
      id: 'womens-health',
      label: 'Женское здоровье',
      icon: Heart,
      description: 'Специализированные инструменты'
    },
    {
      id: 'data-vault',
      label: 'Мои данные',
      icon: Database,
      description: 'Медицинские записи и документы'
    },
    {
      id: 'ai-assistant',
      label: 'ИИ-ассистент',
      icon: Brain,
      description: 'Персональные рекомендации'
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: Settings,
      description: 'Управление аккаунтом'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview userRole={userRole} />;
      case 'risk-assessment':
        return <RiskCalculatorHub />;
      case 'womens-health':
        return <MenstrualCycleDashboard />;
      case 'data-vault':
        return <DataVaultDemo />;
      case 'ai-assistant':
        return <AIAssistantDemo />;
      case 'settings':
        return <SettingsDemo />;
      default:
        return <DashboardOverview userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">YTime PREVENT</h1>
              <p className="text-sm text-gray-600">Платформа женского здоровья</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Calendar className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id as ActiveSection)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${activeSection === item.id 
                    ? 'bg-purple-100 text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Добро пожаловать в YTime PREVENT
        </h2>
        <p className="text-lg text-gray-600">
          Ваша персональная платформа для управления здоровьем
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-pink-600" />
              <span>Оценка рисков</span>
            </CardTitle>
            <CardDescription>
              5 специализированных калькуляторов для комплексной оценки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600 mb-2">85%</div>
            <p className="text-sm text-gray-600">Завершено калькуляторов</p>
          </CardContent>
        </Card>

        <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <span>Женское здоровье</span>
            </CardTitle>
            <CardDescription>
              Трекинг цикла, фертильности и гормонального здоровья
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">28</div>
            <p className="text-sm text-gray-600">Дней до следующего цикла</p>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>ИИ-анализ</span>
            </CardTitle>
            <CardDescription>
              Персональные рекомендации на основе ваших данных
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
            <p className="text-sm text-gray-600">Активных рекомендаций</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200">
        <CardHeader>
          <CardTitle>Последние обновления</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Новый калькулятор PREVENT добавлен</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Обновлены рекомендации по женскому здоровью</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Интеграция с новыми носимыми устройствами</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Demo components for other sections
const DataVaultDemo: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Хранилище медицинских данных</CardTitle>
      <CardDescription>Централизованное хранение и управление медицинской информацией</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">Этот раздел находится в разработке...</p>
    </CardContent>
  </Card>
);

const AIAssistantDemo: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>ИИ-ассистент</CardTitle>
      <CardDescription>Персональный помощник для управления здоровьем</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">Этот раздел находится в разработке...</p>
    </CardContent>
  </Card>
);

const SettingsDemo: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Настройки</CardTitle>
      <CardDescription>Управление аккаунтом и предпочтениями</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">Этот раздел находится в разработке...</p>
    </CardContent>
  </Card>
);

export default UnifiedDashboard;
