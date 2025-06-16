
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
      progress: 35
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
      enrolled: false
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
      enrolled: false
    }
  ]);

  const handleProgramAction = (program: FitnessProgram) => {
    if (program.enrolled) {
      toast.info(`Продолжаем программу "${program.name}"`, {
        description: `Прогресс: ${program.progress}% • ${program.duration_weeks} недель • ${program.workouts_per_week}x в неделю`
      });
    } else {
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? { ...p, enrolled: true, progress: 0 }
          : p
      ));
      
      toast.success(`Успешно записались на программу "${program.name}"!`, {
        description: `${program.duration_weeks} недель тренировок с ${program.instructor}. Начинаем завтра!`
      });
    }
  };

  return {
    programs,
    handleProgramAction
  };
};
