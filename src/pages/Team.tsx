
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, Heart, Brain, Code, Briefcase, Globe } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Team = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Анна Петрова',
      role: 'CEO & Основатель',
      department: 'Руководство',
      experience: '15+ лет в медицине',
      education: 'МГУ им. Ломоносова, медицинский факультет',
      specialization: 'Превентивная медицина, женское здоровье',
      description: 'Опытный врач-гинеколог с многолетним опытом в области превентивной медицины.',
      icon: Heart,
      color: 'bg-pink-500'
    },
    {
      name: 'Дмитрий Смирнов',
      role: 'CTO',
      department: 'Технологии',
      experience: '12+ лет в IT',
      education: 'МФТИ, прикладная математика и физика',
      specialization: 'Машинное обучение, медицинские технологии',
      description: 'Эксперт в области искусственного интеллекта и больших данных в медицине.',
      icon: Brain,
      color: 'bg-blue-500'
    },
    {
      name: 'Елена Кузнецова',
      role: 'Head of Product',
      department: 'Продукт',
      experience: '10+ лет в продукте',
      education: 'НИУ ВШЭ, экономика и управление',
      specialization: 'UX/UI дизайн, продуктовая стратегия',
      description: 'Специалист по созданию пользовательского опыта в медицинских приложениях.',
      icon: Code,
      color: 'bg-purple-500'
    },
    {
      name: 'Михаил Волков',
      role: 'Head of Business Development',
      department: 'Развитие бизнеса',
      experience: '8+ лет в healthcare',
      education: 'ИБДА РАНХиГС, управление бизнесом',
      specialization: 'Стратегические партнерства, развитие рынка',
      description: 'Эксперт по развитию бизнеса в сфере цифрового здравоохранения.',
      icon: Briefcase,
      color: 'bg-green-500'
    }
  ];

  const departments = [
    {
      name: 'Медицинская команда',
      count: 12,
      description: 'Врачи-консультанты различных специальностей',
      icon: Heart
    },
    {
      name: 'Разработка',
      count: 8,
      description: 'Frontend, Backend, Mobile, DevOps инженеры',
      icon: Code
    },
    {
      name: 'Продукт и дизайн',
      count: 5,
      description: 'Product managers, UX/UI дизайнеры, аналитики',
      icon: Brain
    },
    {
      name: 'Бизнес',
      count: 6,
      description: 'Маркетинг, продажи, партнерства, операции',
      icon: Briefcase
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Команда PREVENT
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Мы — команда экспертов в области медицины, технологий и бизнеса, объединенных общей миссией улучшения женского здоровья через инновации.
          </p>
        </div>

        {/* Миссия и ценности */}
        <Card className="prevent-card mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Globe className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Сделать превентивную медицину доступной каждой женщине через персонализированные решения, 
                основанные на последних достижениях науки и технологий.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Статистика команды */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {departments.map((dept, index) => (
            <Card key={index} className="prevent-card-hover">
              <CardHeader className="pb-4">
                <div className="prevent-icon-container bg-purple-500 mb-4">
                  <dept.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{dept.name}</CardTitle>
                <div className="text-2xl font-bold text-purple-600">{dept.count}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  {dept.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Команда руководителей */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">Команда руководителей</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="prevent-card-hover">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`prevent-icon-container ${member.color}`}>
                      <member.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{member.name}</CardTitle>
                      <Badge variant="secondary" className="prevent-badge-soft mb-2">
                        {member.role}
                      </Badge>
                      <p className="text-sm text-purple-600 font-medium">{member.department}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Опыт:</span> {member.experience}
                    </div>
                    <div>
                      <span className="font-medium">Образование:</span> {member.education}
                    </div>
                    <div>
                      <span className="font-medium">Специализация:</span> {member.specialization}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ценности */}
        <Card className="prevent-card mb-8">
          <CardHeader>
            <CardTitle className="text-center">Наши ценности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Забота о пациентах</h3>
                <p className="text-gray-600 text-sm">
                  Каждое решение принимается с учетом интересов и потребностей наших пользователей
                </p>
              </div>
              <div className="text-center">
                <Brain className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Научный подход</h3>
                <p className="text-gray-600 text-sm">
                  Все рекомендации основаны на доказательной медицине и последних исследованиях
                </p>
              </div>
              <div className="text-center">
                <Code className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Технологические инновации</h3>
                <p className="text-gray-600 text-sm">
                  Используем передовые технологии для создания лучших решений в медицине
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Присоединиться к команде */}
        <Card className="prevent-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center">Присоединяйтесь к нашей команде</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Мы всегда в поиске талантливых людей, которые разделяют нашу миссию и готовы внести вклад 
                в революцию превентивной медицины.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Для врачей</h4>
                  <p className="text-sm text-gray-600">Возможность влиять на здоровье тысяч женщин через технологии</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Для разработчиков</h4>
                  <p className="text-sm text-gray-600">Работа над продуктом, который реально меняет жизни людей</p>
                </div>
              </div>
              <Button className="prevent-button-primary">
                Вакансии
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="prevent-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Страница находится в разработке</h3>
              <p className="text-gray-600 mb-4">
                Мы готовим более подробную информацию о нашей команде и открытых позициях.
              </p>
              <Button 
                onClick={() => navigate('/about')}
                className="prevent-button-primary"
              >
                Узнать больше о компании
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Team;
