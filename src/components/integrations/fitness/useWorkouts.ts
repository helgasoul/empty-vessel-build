
import { Workout } from './types';
import { toast } from "sonner";

export const useWorkouts = () => {
  const todayWorkouts: Workout[] = [
    {
      id: '1',
      title: 'Утренняя йога для женщин',
      instructor: 'Анна Лунегова',
      duration: 30,
      difficulty: 'Легкий',
      type: 'Йога',
      calories: 120,
      equipment: ['Коврик для йоги'],
      description: 'Мягкая практика для пробуждения тела и гармонизации энергии',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      completed: false,
      progress: 0,
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: '2',
      title: 'HIIT для жиросжигания',
      instructor: 'Михаил Прыгунов',
      duration: 25,
      difficulty: 'Сложный',
      type: 'HIIT',
      calories: 300,
      equipment: ['Гантели', 'Скакалка'],
      description: 'Интенсивная тренировка для быстрого сжигания калорий',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      completed: true,
      progress: 100,
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: '3',
      title: 'Пилатес для кора',
      instructor: 'Елена Малышева',
      duration: 45,
      difficulty: 'Средний',
      type: 'Пилатес',
      calories: 180,
      equipment: ['Коврик'],
      description: 'Укрепление мышц кора и улучшение осанки',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      completed: false,
      progress: 60,
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    }
  ];

  const handleWorkoutAction = (workout: Workout, setCurrentVideo: (workout: Workout | null) => void) => {
    console.log('Начинаем тренировку:', workout.title, 'Есть видео:', !!workout.video_url);
    
    if (workout.completed) {
      toast.success(`Повторяем тренировку "${workout.title}"`, {
        description: `Переходим к ${workout.type} с ${workout.instructor} • ${workout.duration} мин`
      });
    } else if (workout.progress && workout.progress > 0) {
      toast.info(`Продолжаем тренировку "${workout.title}"`, {
        description: `Прогресс: ${workout.progress}% • Осталось около ${Math.round((100 - workout.progress) / 100 * workout.duration)} мин`
      });
    } else {
      toast.success(`Начинаем тренировку "${workout.title}"`, {
        description: `${workout.type} с ${workout.instructor} • ${workout.duration} мин • ${workout.calories} ккал`
      });
    }
    
    if (workout.video_url) {
      setCurrentVideo(workout);
      console.log('Видео должно открыться для:', workout.title);
    } else {
      toast.info('Видео для этой тренировки пока недоступно');
    }
  };

  return {
    todayWorkouts,
    handleWorkoutAction
  };
};
