import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Dumbbell, 
  Play, 
  Clock, 
  Flame, 
  Heart,
  Calendar,
  Trophy,
  Users,
  Video,
  X,
  Pause,
  SkipForward,
  SkipBack,
  Volume2
} from "lucide-react";
import { toast } from "sonner";

interface Workout {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  difficulty: 'Легкий' | 'Средний' | 'Сложный';
  type: string;
  calories: number;
  equipment: string[];
  description: string;
  thumbnail: string;
  completed?: boolean;
  progress?: number;
  video_url?: string;
}

interface FitnessProgram {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  workouts_per_week: number;
  focus_areas: string[];
  instructor: string;
  level: string;
  thumbnail: string;
  enrolled?: boolean;
  progress?: number;
}

const FitnessIntegration = () => {
  const [activeTab, setActiveTab] = useState<'workouts' | 'programs'>('workouts');
  const [currentVideo, setCurrentVideo] = useState<Workout | null>(null);

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
      video_url: 'https://www.youtube.com/embed/v7AYKMP6rOE'
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
      video_url: 'https://www.youtube.com/embed/20Nw7obrGQs'
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
      video_url: 'https://www.youtube.com/embed/K56Z12V9NP8'
    }
  ];

  const fitnessPrograms: FitnessProgram[] = [
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
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Легкий': return 'bg-green-100 text-green-800';
      case 'Средний': return 'bg-yellow-100 text-yellow-800';
      case 'Сложный': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWorkoutAction = (workout: Workout) => {
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
    
    // Открываем видео если оно есть
    if (workout.video_url) {
      setCurrentVideo(workout);
      console.log('Видео должно открыться для:', workout.title);
    } else {
      toast.info('Видео для этой тренировки пока недоступно');
    }
  };

  const handleProgramAction = (program: FitnessProgram) => {
    if (program.enrolled) {
      toast.info(`Продолжаем программу "${program.name}"`, {
        description: `Прогресс: ${program.progress}% • ${program.duration_weeks} недель • ${program.workouts_per_week}x в неделю`
      });
    } else {
      toast.success(`Записываемся на программу "${program.name}"`, {
        description: `${program.duration_weeks} недель тренировок с ${program.instructor}. Начинаем завтра!`
      });
    }
  };

  const closeVideo = () => {
    console.log('Закрываем видео');
    setCurrentVideo(null);
  };

  const WorkoutCard = ({ workout }: { workout: Workout }) => (
    <Card className="prevent-card">
      <CardHeader className="p-4">
        <div className="relative">
          <img 
            src={workout.thumbnail} 
            alt={workout.title}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <Badge className={`absolute top-2 right-2 ${getDifficultyColor(workout.difficulty)}`}>
            {workout.difficulty}
          </Badge>
          {workout.completed && (
            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
              <Badge className="bg-green-500">
                <Trophy className="w-3 h-3 mr-1" />
                Завершено
              </Badge>
            </div>
          )}
          {/* Индикатор наличия видео */}
          {workout.video_url && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center">
              <Video className="w-3 h-3 mr-1" />
              Видео
            </div>
          )}
        </div>

        <div>
          <Badge variant="secondary" className="mb-2">
            {workout.type}
          </Badge>
          <CardTitle className="text-lg font-montserrat line-clamp-2">
            {workout.title}
          </CardTitle>
          <CardDescription className="font-roboto">
            с {workout.instructor}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {workout.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{workout.duration} мин</span>
              </span>
              <span className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-red-500" />
                <span>{workout.calories} ккал</span>
              </span>
            </div>
          </div>

          {workout.equipment.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">Оборудование:</p>
              <div className="flex flex-wrap gap-1">
                {workout.equipment.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {workout.progress !== undefined && workout.progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс</span>
                <span>{workout.progress}%</span>
              </div>
              <Progress value={workout.progress} className="h-2" />
            </div>
          )}

          <Button 
            className="w-full"
            variant={workout.completed ? "outline" : "default"}
            onClick={() => handleWorkoutAction(workout)}
          >
            <Play className="w-4 h-4 mr-2" />
            {workout.completed ? 'Повторить' : workout.progress ? 'Продолжить' : 'Начать'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProgramCard = ({ program }: { program: FitnessProgram }) => (
    <Card className="prevent-card">
      <CardHeader className="p-4">
        <div className="relative">
          <img 
            src={program.thumbnail} 
            alt={program.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          {program.enrolled && (
            <Badge className="absolute top-2 right-2 bg-primary">
              Записан
            </Badge>
          )}
        </div>

        <div>
          <Badge variant="secondary" className="mb-2">
            {program.level}
          </Badge>
          <CardTitle className="text-lg font-montserrat line-clamp-2">
            {program.name}
          </CardTitle>
          <CardDescription className="font-roboto">
            с {program.instructor}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {program.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{program.duration_weeks} недель</span>
            </div>
            <div className="flex items-center space-x-1">
              <Dumbbell className="w-4 h-4" />
              <span>{program.workouts_per_week}x в неделю</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Фокус:</p>
            <div className="flex flex-wrap gap-1">
              {program.focus_areas.map((area, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {program.enrolled && program.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс программы</span>
                <span>{program.progress}%</span>
              </div>
              <Progress value={program.progress} className="h-2" />
            </div>
          )}

          <Button 
            className="w-full"
            variant={program.enrolled ? "outline" : "default"}
            onClick={() => handleProgramAction(program)}
          >
            <Video className="w-4 h-4 mr-2" />
            {program.enrolled ? 'Продолжить' : 'Записаться'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="prevent-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-montserrat">
            <Dumbbell className="w-5 h-5 text-primary" />
            <span>Фитнес и wellness</span>
          </CardTitle>
          <CardDescription className="font-roboto">
            Персонализированные тренировки и программы для вашего здоровья
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <Button
              variant={activeTab === 'workouts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('workouts')}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Тренировки
            </Button>
            <Button
              variant={activeTab === 'programs' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('programs')}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Программы
            </Button>
          </div>

          {activeTab === 'workouts' && (
            <div>
              <h3 className="text-lg font-montserrat font-semibold mb-4">
                Рекомендованные тренировки на сегодня
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div>
              <h3 className="text-lg font-montserrat font-semibold mb-4">
                Программы тренировок
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fitnessPrograms.map(program => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Modal */}
      <Dialog open={!!currentVideo} onOpenChange={(open) => !open && closeVideo()}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>{currentVideo?.title}</span>
            </DialogTitle>
            <DialogDescription>
              Тренировка {currentVideo?.type} с {currentVideo?.instructor}
            </DialogDescription>
          </DialogHeader>
          
          {currentVideo && (
            <div className="space-y-4">
              {/* Video Player */}
              <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
                <iframe
                  src={currentVideo.video_url}
                  title={currentVideo.title}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getDifficultyColor(currentVideo.difficulty)}>
                      {currentVideo.difficulty}
                    </Badge>
                    <Badge variant="secondary">{currentVideo.type}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-montserrat font-semibold mb-1">
                    {currentVideo.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    с {currentVideo.instructor}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {currentVideo.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm mb-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentVideo.duration} мин</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Flame className="w-4 h-4 text-red-500" />
                      <span>{currentVideo.calories} ккал</span>
                    </span>
                  </div>

                  {currentVideo.equipment.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Оборудование:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentVideo.equipment.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Controls & Progress */}
                <div className="md:w-64 space-y-4">
                  {currentVideo.progress !== undefined && currentVideo.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span>{currentVideo.progress}%</span>
                      </div>
                      <Progress value={currentVideo.progress} className="h-2" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Воспроизвести
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      В избранное
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FitnessIntegration;
