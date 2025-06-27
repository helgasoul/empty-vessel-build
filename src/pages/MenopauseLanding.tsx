
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Shield, 
  Calendar, 
  Thermometer, 
  Moon, 
  Brain,
  Stethoscope,
  Users,
  BookOpen,
  Coffee,
  Star,
  CheckCircle
} from 'lucide-react';

const MenopauseLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/menopause-dashboard');
    } else {
      navigate('/auth', { state: { redirectTo: '/menopause-dashboard' } });
    }
  };

  const handleLearnMore = () => {
    navigate('/menopause-education');
  };

  const features = [
    {
      icon: Thermometer,
      title: 'Отслеживание симптомов',
      description: 'Ведите дневник приливов, изменений настроения и других симптомов менопаузы',
      color: 'text-orange-600'
    },
    {
      icon: Moon,
      title: 'Мониторинг сна',
      description: 'Анализируйте качество сна и получайте рекомендации для улучшения отдыха',
      color: 'text-purple-600'
    },
    {
      icon: Brain,
      title: 'Поддержка когнитивных функций',
      description: 'Упражнения и советы для поддержания памяти и концентрации',
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      title: 'Здоровье сердца',
      description: 'Специализированные рекомендации для кардиоваскулярного здоровья после 45',
      color: 'text-red-600'
    },
    {
      icon: Stethoscope,
      title: 'Консультации экспертов',
      description: 'Доступ к специалистам по менопаузе и гормональной терапии',
      color: 'text-green-600'
    },
    {
      icon: Users,
      title: 'Сообщество поддержки',
      description: 'Общайтесь с женщинами, проходящими через похожий опыт',
      color: 'text-pink-600'
    }
  ];

  const testimonials = [
    {
      name: 'Марина, 52 года',
      text: 'Наконец нашла платформу, которая понимает все нюансы этого периода. Больше не чувствую себя одинокой.',
      rating: 5
    },
    {
      name: 'Елена, 48 лет',
      text: 'Отслеживание симптомов помогло мне лучше понять свое тело и найти эффективные способы справляться с приливами.',
      rating: 5
    },
    {
      name: 'Ирина, 55 лет',
      text: 'Благодарна за деликатный подход и научно обоснованные рекомендации. Качество жизни значительно улучшилось.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-orange-500 text-white">
              Специализированная поддержка
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Менопауза —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                новый этап жизни
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Персонализированная поддержка и экспертные рекомендации для женщин в период менопаузы. 
              Без стыда, без страха — только забота и понимание.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3"
              >
                Начать сейчас
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLearnMore}
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Комплексная поддержка на каждом этапе
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Мы понимаем уникальность каждой женщины и предлагаем персонализированный подход
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-orange-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-orange-50`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Истории наших пользователей
            </h2>
            <p className="text-lg text-gray-600">
              Опыт женщин, которые уже получают поддержку
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <p className="font-medium text-gray-900">
                    {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Почему выбирают нашу платформу?
              </h2>
              <div className="space-y-4">
                {[
                  'Научно обоснованные рекомендации от ведущих экспертов',
                  'Персонализированный подход к каждой женщине',
                  'Деликатная поддержка без осуждения',
                  'Конфиденциальность и безопасность данных',
                  'Сообщество поддержки единомышленниц',
                  'Доступ к специалистам в любое время'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200">
              <CardContent className="p-8 text-center">
                <Coffee className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Начните с бесплатной консультации
                </h3>
                <p className="text-gray-700 mb-6">
                  Персональная оценка ваших потребностей и составление индивидуального плана поддержки
                </p>
                <Button 
                  onClick={handleGetStarted}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Записаться на консультацию
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы начать свой путь к комфортной менопаузе?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Присоединяйтесь к тысячам женщин, которые уже получают поддержку
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3"
          >
            Начать бесплатно
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenopauseLanding;
