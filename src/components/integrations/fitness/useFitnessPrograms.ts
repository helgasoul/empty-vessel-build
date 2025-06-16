
import { useState } from 'react';
import { FitnessProgram } from './types';
import { toast } from "sonner";

export const useFitnessPrograms = () => {
  const [programs, setPrograms] = useState<FitnessProgram[]>([
    {
      id: '1',
      name: 'Здоровье женщины 360°',
      description: 'Комплексная программа для женского здоровья с учетом гормональных циклов',
      duration_weeks: 12,
      workouts_per_week: 4,
      focus_areas: ['Гормональный баланс', 'Кор', 'Гибкость', 'Кардио'],
      instructor: 'Дарья Лисичкина',
      level: 'Средний',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      enrolled: true,
      progress: 35,
      website_url: 'https://www.worldclass.ru/programs/womens-health-360',
      partner_type: 'fitness_club'
    },
    {
      id: '2',
      name: 'Йога в разные фазы цикла',
      description: 'Адаптивная йога-практика, меняющаяся в зависимости от фазы менструального цикла',
      duration_weeks: 8,
      workouts_per_week: 5,
      focus_areas: ['Гормоны', 'Стресс', 'Гибкость', 'Медитация'],
      instructor: 'Ольга Бурдина',
      level: 'Легкий',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      enrolled: false,
      website_url: 'https://yogajournal.ru/practice/cycle-yoga-program',
      partner_type: 'yoga_studio'
    },
    {
      id: '3',
      name: 'Сила и грация',
      description: 'Силовые тренировки, адаптированные для женской физиологии',
      duration_weeks: 16,
      workouts_per_week: 3,
      focus_areas: ['Сила', 'Мышечная масса', 'Метаболизм'],
      instructor: 'Анна Стародубцева',
      level: 'Сложный',
      thumbnail: 'https://images.unsplash.com/photo-1571388208497-71bedc76b3de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      enrolled: true,
      progress: 60,
      website_url: 'https://fitness-live.ru/programs/strength-grace',
      partner_type: 'online_platform'
    }
  ]);

  const handleProgramAction = (program: FitnessProgram) => {
    if (program.enrolled) {
      // Для уже записанных программ НЕ перенаправляем на сайт, а показываем интерфейс продолжения
      toast.info(`Продолжаем программу "${program.name}"`, {
        description: `Прогресс: ${program.progress}% • ${program.duration_weeks} недель • ${program.workouts_per_week}x в неделю`
      });
      
      // Здесь может быть логика открытия интерфейса тренировки
      console.log('Продолжаем программу:', {
        programName: program.name,
        progress: program.progress,
        instructor: program.instructor
      });
      
    } else {
      // Для новых программ перенаправляем на сайт партнера для записи
      if (program.website_url) {
        console.log('Переход к программе:', {
          programName: program.name,
          partnerType: program.partner_type,
          websiteUrl: program.website_url
        });

        toast.success(`Переходим к записи на программу "${program.name}"`, {
          description: `${program.duration_weeks} недель тренировок с ${program.instructor}. Откроется сайт партнера для записи.`
        });
        
        // Открываем сайт партнера в новой вкладке только для незаписанных программ
        window.open(program.website_url, '_blank');
        
        // Локально отмечаем как записанного (имитация успешной записи)
        setTimeout(() => {
          setPrograms(prev => prev.map(p => 
            p.id === program.id 
              ? { ...p, enrolled: true, progress: 0 }
              : p
          ));
          
          toast.success('Запись прошла успешно!', {
            description: 'Вы записаны на программу. Проверьте email для подтверждения.'
          });
        }, 2000);
      } else {
        toast.error('Ссылка на программу временно недоступна', {
          description: 'Попробуйте позже или обратитесь в поддержку'
        });
      }
    }
  };

  return {
    programs,
    handleProgramAction
  };
};
