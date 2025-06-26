
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calculator, Brain, Database, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedDashboard } from '../platform/UnifiedDashboard';

export const LandingPage: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <UnifiedDashboard />;
  }

  const features = [
    {
      icon: Calculator,
      title: 'Калькуляторы рисков',
      description: '5 специализированных калькуляторов для оценки медицинских рисков',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Heart,
      title: 'Женское здоровье',
      description: 'Комплексный мониторинг репродуктивного и гормонального здоровья',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Database,
      title: 'Медицинские данные',
      description: 'Безопасное хранение и анализ ваших медицинских записей',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'ИИ-ассистент',
      description: 'Персональные рекомендации на основе анализа ваших данных',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  YTime
                </span>
                <span className="text-gray-800 ml-2">PREVENT</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Персональная платформа для управления женским здоровьем с инновационными 
              инструментами оценки рисков и ИИ-анализом
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => setShowDashboard(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg"
              >
                Начать оценку здоровья
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Узнать больше
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-200 rounded-full opacity-60 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Комплексный подход к женскому здоровью
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Объединяем медицинскую науку, технологии ИИ и персонализированный подход 
              для создания индивидуального плана заботы о вашем здоровье
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
              <p className="text-gray-600">Валидированных калькуляторов риска</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-pink-600 mb-2">50+</div>
              <p className="text-gray-600">Параметров здоровья для анализа</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">ИИ-поддержка и рекомендации</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Начните заботиться о своем здоровье уже сегодня
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Получите персональную оценку рисков и рекомендации от ведущих медицинских экспертов
            </p>
            
            <Button 
              size="lg"
              onClick={() => setShowDashboard(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-xl"
            >
              Попробовать платформу
              <Heart className="ml-3 w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
