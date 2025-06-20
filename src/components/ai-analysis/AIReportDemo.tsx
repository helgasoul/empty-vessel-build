
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Brain, 
  Activity, 
  Target, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  BarChart3,
  Dna,
  Stethoscope,
  Apple,
  Moon,
  ChevronRight
} from "lucide-react";

const AIReportDemo = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const riskData = [
    { 
      disease: "Рак груди", 
      risk: 8, 
      status: "low", 
      color: "bg-green-500",
      icon: Shield,
      age35: 2,
      age45: 5,
      age55: 12
    },
    { 
      disease: "Диабет 2 типа", 
      risk: 12, 
      status: "low", 
      color: "bg-green-500",
      icon: Activity,
      age35: 3,
      age45: 8,
      age55: 15
    },
    { 
      disease: "Сердечно-сосудистые", 
      risk: 18, 
      status: "medium", 
      color: "bg-yellow-500",
      icon: Heart,
      age35: 15,
      age45: 25,
      age55: 40
    },
    { 
      disease: "Остеопороз", 
      risk: 35, 
      status: "attention", 
      color: "bg-red-500",
      icon: Target,
      age35: 35,
      age45: 50,
      age55: 70
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Персональная обложка */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">👋 Ваш персональный отчет о рисках здоровья</h2>
              <p className="text-gray-600">Анна, 35 лет | Дата анализа: 15 июня 2025</p>
              <p className="text-sm text-purple-600 font-medium">Основано на анализе 47 параметров здоровья</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>🎯 Ваш общий профиль риска: НИЗКИЙ-СРЕДНИЙ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{item.disease}</span>
                  </div>
                  <Badge variant={item.status === 'low' ? 'default' : item.status === 'medium' ? 'secondary' : 'destructive'}>
                    {item.risk}%
                  </Badge>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">⭐ Главный фокус: Укрепление костной ткани</span>
            </div>
            <p className="text-sm text-purple-700">Рекомендуем уделить особое внимание профилактике остеопороза</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDetailedAssessment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>❤️ СЕРДЕЧНО-СОСУДИСТЫЕ ЗАБОЛЕВАНИЯ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Оценка риска</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Риск в ближайшие 10 лет:</span>
                  <Badge variant="secondary">15% (средний)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Сравнение со сверстницами:</span>
                  <span className="text-green-600 flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    ниже на 5%
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">⚠️ Факторы риска</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  Семейная история (дедушка - инфаркт в 60)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                  Сидячий образ жизни
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Уровень стресса выше нормы
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">🛡️ Защитные факторы</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Нормальный ИМТ
              </div>
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Не курите
              </div>
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Регулярный сон
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📋 Рекомендации</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Кардио 3 раза в неделю по 30 мин
              </li>
              <li className="flex items-center">
                <Stethoscope className="w-4 h-4 mr-2" />
                Анализ на липидный профиль - через 6 мес
              </li>
              <li className="flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Техники управления стрессом
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRiskProjections = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span>📊 Динамика рисков по возрастам</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-8 text-lg font-semibold">
              <span>35 лет (сейчас)</span>
              <ChevronRight className="w-5 h-5" />
              <span>45 лет</span>
              <ChevronRight className="w-5 h-5" />
              <span>55 лет</span>
            </div>
          </div>
          
          {riskData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">{item.disease}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.age35}%</span>
                      <span>{item.age45}%</span>
                      <span>{item.age55}%</span>
                    </div>
                    <Progress value={(item.age55 / 100) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">💡 При выполнении рекомендаций риски снижаются на 30-50%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderActionPlan = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span>🎯 ВАШИ ПРИОРИТЕТЫ НА БЛИЖАЙШИЕ 6 МЕСЯЦЕВ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                НЕОТЛОЖНО (до 1 месяца)
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-red-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Денситометрия костей
                </li>
                <li className="flex items-center text-red-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Консультация эндокринолога
                </li>
                <li className="flex items-center text-red-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Анализ витамина D
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                ВАЖНО (1-3 месяца)
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-yellow-700">
                  <Clock className="w-4 h-4 mr-2" />
                  Липидограмма
                </li>
                <li className="flex items-center text-yellow-700">
                  <Clock className="w-4 h-4 mr-2" />
                  УЗИ щитовидной железы
                </li>
                <li className="flex items-center text-yellow-700">
                  <Clock className="w-4 h-4 mr-2" />
                  Тест на стрессоустойчивость
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                ПЛАНОВО (3-6 месяцев)
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Маммография (плановая)
                </li>
                <li className="flex items-center text-green-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Консультация кардиолога
                </li>
                <li className="flex items-center text-green-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Генетическое тестирование
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLifestyle = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <Apple className="w-5 h-5" />
              <span>🥗 ПИТАНИЕ</span>
            </CardTitle>
            <Badge variant="secondary">Хорошо, но нужны улучшения</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Сильные стороны:</h4>
              <p className="text-sm text-green-700">Достаточно белка, мало сахара</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Зоны роста:</h4>
              <p className="text-sm text-orange-700">Больше омега-3, кальция</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-semibold text-blue-800 mb-1">Конкретно:</h4>
              <p className="text-sm text-blue-700">Добавить рыбу 2 раза в неделю</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600">
              <Activity className="w-5 h-5" />
              <span>🏃‍♀️ АКТИВНОСТЬ</span>
            </CardTitle>
            <Badge variant="destructive">Требует внимания</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Текущее:</h4>
              <p className="text-sm text-gray-700">6000 шагов/день (норма 8000+)</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Рекомендация:</h4>
              <p className="text-sm text-orange-700">Силовые тренировки 2 раза в неделю</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-semibold text-blue-800 mb-1">Первый шаг:</h4>
              <p className="text-sm text-blue-700">10-минутная зарядка каждое утро</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-600">
              <Moon className="w-5 h-5" />
              <span>😴 СОН</span>
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">Отлично!</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Качество:</h4>
              <div className="flex items-center space-x-2">
                <Progress value={85} className="flex-1" />
                <span className="text-sm font-semibold">8,5/10</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-green-700 font-medium">Продолжайте в том же духе!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderGenetics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Dna className="w-5 h-5 text-purple-500" />
          <span>🧬 ГЕНЕТИЧЕСКИЙ ПРОФИЛЬ</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h4 className="font-semibold">Обнаружены варианты:</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span>BRCA1/2: не обнаружено патогенных мутаций</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span>APOE: тип E3/E4 (немного повышен риск Альцгеймера)</span>
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span>FTO: предрасположенность к набору веса</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
          <p className="text-purple-800 font-medium">💡 Это НЕ приговор, а информация для профилактики</p>
        </div>
      </CardContent>
    </Card>
  );

  const sections = [
    { id: 'overview', title: 'Обзор', icon: BarChart3 },
    { id: 'detailed', title: 'Детальная оценка', icon: Heart },
    { id: 'projections', title: 'Прогноз рисков', icon: TrendingUp },
    { id: 'action', title: 'План действий', icon: Target },
    { id: 'lifestyle', title: 'Образ жизни', icon: Activity },
    { id: 'genetics', title: 'Генетика', icon: Dna }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-4 z-10">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className="flex items-center space-x-2"
              >
                <IconComponent className="w-4 h-4" />
                <span>{section.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'detailed' && renderDetailedAssessment()}
        {activeSection === 'projections' && renderRiskProjections()}
        {activeSection === 'action' && renderActionPlan()}
        {activeSection === 'lifestyle' && renderLifestyle()}
        {activeSection === 'genetics' && renderGenetics()}
      </div>
    </div>
  );
};

export default AIReportDemo;
