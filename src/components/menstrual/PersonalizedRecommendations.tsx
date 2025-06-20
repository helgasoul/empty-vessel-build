
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Apple, Dumbbell, Heart, Moon, Droplets } from 'lucide-react';
import { useMenstrualCycle } from '@/hooks/useMenstrualCycle';
import { differenceInDays } from 'date-fns';

const PersonalizedRecommendations = () => {
  const { cycles } = useMenstrualCycle();
  
  const getCurrentPhase = () => {
    const currentCycle = cycles.find(cycle => !cycle.cycle_end_date) || cycles[0];
    if (!currentCycle) return 'unknown';
    
    const startDate = new Date(currentCycle.cycle_start_date);
    const today = new Date();
    const dayOfCycle = differenceInDays(today, startDate) + 1;
    const periodLength = currentCycle.period_length || 5;
    
    if (dayOfCycle <= periodLength) {
      return 'menstruation';
    } else if (dayOfCycle <= 13) {
      return 'follicular';
    } else if (dayOfCycle <= 15) {
      return 'ovulation';
    } else {
      return 'luteal';
    }
  };

  const currentPhase = getCurrentPhase();

  const getRecommendations = (phase: string) => {
    switch (phase) {
      case 'menstruation':
        return {
          nutrition: [
            'Увеличьте потребление железа (красное мясо, шпинат, бобовые)',
            'Пейте больше воды для борьбы с обезвоживанием',
            'Добавьте магний для уменьшения спазмов (орехи, авокадо)',
            'Ограничьте кофеин и сахар'
          ],
          exercise: [
            'Легкая йога и растяжка',
            'Короткие прогулки на свежем воздухе',
            'Дыхательные упражнения',
            'Избегайте интенсивных тренировок'
          ],
          wellbeing: [
            'Больше отдыхайте и спите',
            'Используйте тепло для облегчения боли',
            'Практикуйте медитацию',
            'Будьте терпеливы к себе'
          ]
        };
      case 'follicular':
        return {
          nutrition: [
            'Увеличьте потребление белка',
            'Добавьте цельные зерна и овощи',
            'Включите продукты с витамином E (орехи, семена)',
            'Ешьте продукты, богатые фолиевой кислотой'
          ],
          exercise: [
            'Кардио тренировки',
            'Силовые упражнения',
            'Танцы или аэробика',
            'Попробуйте новые виды активности'
          ],
          wellbeing: [
            'Планируйте важные проекты',
            'Социализируйтесь с друзьями',
            'Изучайте что-то новое',
            'Используйте повышенную энергию'
          ]
        };
      case 'ovulation':
        return {
          nutrition: [
            'Ешьте антиоксиданты (ягоды, темная зелень)',
            'Увеличьте потребление полезных жиров',
            'Добавьте витамин D',
            'Пейте зеленый чай'
          ],
          exercise: [
            'Высокоинтенсивные тренировки',
            'Бег или велосипед',
            'Командные виды спорта',
            'Используйте пиковую энергию'
          ],
          wellbeing: [
            'Планируйте важные встречи',
            'Проявляйте креативность',
            'Общайтесь и знакомьтесь',
            'Принимайте важные решения'
          ]
        };
      case 'luteal':
        return {
          nutrition: [
            'Сложные углеводы для стабилизации настроения',
            'Витамин B6 (бананы, картофель)',
            'Кальций и магний',
            'Ограничьте соль и кофеин'
          ],
          exercise: [
            'Умеренные кардио нагрузки',
            'Пилатес или йога',
            'Плавание',
            'Избегайте переутомления'
          ],
          wellbeing: [
            'Практикуйте самоуход',
            'Ведите дневник эмоций',
            'Больше спите',
            'Планируйте спокойные активности'
          ]
        };
      default:
        return {
          nutrition: ['Поддерживайте сбалансированное питание'],
          exercise: ['Регулярная физическая активность'],
          wellbeing: ['Следите за своим самочувствием']
        };
    }
  };

  const recommendations = getRecommendations(currentPhase);

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'menstruation':
        return { name: 'Менструация', color: 'bg-red-500', icon: Droplets };
      case 'follicular':
        return { name: 'Фолликулярная фаза', color: 'bg-blue-500', icon: Moon };
      case 'ovulation':
        return { name: 'Овуляция', color: 'bg-green-500', icon: Heart };
      case 'luteal':
        return { name: 'Лютеиновая фаза', color: 'bg-yellow-500', icon: Moon };
      default:
        return { name: 'Неопределенная фаза', color: 'bg-gray-500', icon: Moon };
    }
  };

  const phaseInfo = getPhaseInfo(currentPhase);
  const PhaseIcon = phaseInfo.icon;

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${phaseInfo.color}`}>
              <PhaseIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800">
                Рекомендации для текущей фазы
              </CardTitle>
              <CardDescription>
                <Badge className={`${phaseInfo.color} text-white mt-2`}>
                  {phaseInfo.name}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Питание */}
        <Card className="bg-white/80 backdrop-blur-sm border border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Apple className="w-5 h-5" />
              Питание
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {recommendations.nutrition.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Физическая активность */}
        <Card className="bg-white/80 backdrop-blur-sm border border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Dumbbell className="w-5 h-5" />
              Активность
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {recommendations.exercise.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Эмоциональное благополучие */}
        <Card className="bg-white/80 backdrop-blur-sm border border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Heart className="w-5 h-5" />
              Благополучие
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {recommendations.wellbeing.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Общие советы */}
      <Card className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">💡 Помните</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            Каждая женщина уникальна, и ваш цикл может отличаться от стандартных рекомендаций. 
            Слушайте свое тело, ведите записи о самочувствии и при необходимости консультируйтесь 
            с врачом. Эти рекомендации носят общий характер и не заменяют медицинскую консультацию.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedRecommendations;
