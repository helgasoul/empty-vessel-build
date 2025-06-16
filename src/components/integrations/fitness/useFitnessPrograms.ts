
import { useState } from 'react';
import { FitnessProgram, ProgramLesson } from './types';
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
      partner_type: 'fitness_club',
      lessons: [
        {
          id: '1-1',
          title: 'Основы женского фитнеса',
          duration: 45,
          difficulty: 'Легкий',
          type: 'Теория',
          description: 'Введение в особенности женской физиологии и тренировок',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          completed: true,
          week: 1,
          lesson_number: 1
        },
        {
          id: '1-2',
          title: 'Разминка и подготовка тела',
          duration: 30,
          difficulty: 'Легкий',
          type: 'Разминка',
          description: 'Комплекс упражнений для подготовки к основной тренировке',
          thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          completed: true,
          week: 1,
          lesson_number: 2
        },
        {
          id: '1-3',
          title: 'Кардио для женщин',
          duration: 40,
          difficulty: 'Средний',
          type: 'Кардио',
          description: 'Кардиотренировка с учетом женского цикла',
          thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          completed: false,
          week: 1,
          lesson_number: 3
        },
        {
          id: '1-4',
          title: 'Упражнения для кора',
          duration: 35,
          difficulty: 'Средний',
          type: 'Силовая',
          description: 'Укрепление мышц кора с учетом женской анатомии',
          thumbnail: 'https://images.unsplash.com/photo-1571388208497-71bedc76b3de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
          completed: false,
          week: 2,
          lesson_number: 1
        }
      ]
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
      partner_type: 'yoga_studio',
      lessons: [
        {
          id: '2-1',
          title: 'Йога для фолликулярной фазы',
          duration: 50,
          difficulty: 'Легкий',
          type: 'Йога',
          description: 'Энергичная практика для начала цикла',
          thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          completed: false,
          week: 1,
          lesson_number: 1
        }
      ]
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
      partner_type: 'online_platform',
      lessons: [
        {
          id: '3-1',
          title: 'Базовые движения силового тренинга',
          duration: 60,
          difficulty: 'Средний',
          type: 'Силовая',
          description: 'Изучение правильной техники базовых упражнений',
          thumbnail: 'https://images.unsplash.com/photo-1571388208497-71bedc76b3de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          completed: true,
          week: 1,
          lesson_number: 1
        },
        {
          id: '3-2',
          title: 'Приседания и выпады',
          duration: 45,
          difficulty: 'Сложный',
          type: 'Силовая',
          description: 'Правильная техника приседаний и вариации выпадов',
          thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          completed: false,
          week: 1,
          lesson_number: 2
        }
      ]
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
      
      return 'show_lessons'; // Возвращаем флаг для показа уроков
      
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

  const markLessonCompleted = (lessonId: string) => {
    setPrograms(prev => prev.map(program => ({
      ...program,
      lessons: program.lessons?.map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      )
    })));
  };

  return {
    programs,
    handleProgramAction,
    markLessonCompleted
  };
};
