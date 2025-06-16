
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Play, 
  Calendar
} from "lucide-react";
import WorkoutCard from './fitness/WorkoutCard';
import ProgramCard from './fitness/ProgramCard';
import VideoModal from './fitness/VideoModal';
import { useWorkouts } from './fitness/useWorkouts';
import { useFitnessPrograms } from './fitness/useFitnessPrograms';
import { Workout } from './fitness/types';

const FitnessIntegration = () => {
  const [activeTab, setActiveTab] = useState<'workouts' | 'programs'>('workouts');
  const [currentVideo, setCurrentVideo] = useState<Workout | null>(null);

  const { todayWorkouts, handleWorkoutAction } = useWorkouts();
  const { programs, handleProgramAction } = useFitnessPrograms();

  const onWorkoutAction = (workout: Workout) => {
    handleWorkoutAction(workout, setCurrentVideo);
  };

  const closeVideo = () => {
    console.log('Закрываем видео');
    setCurrentVideo(null);
  };

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
                  <WorkoutCard 
                    key={workout.id} 
                    workout={workout} 
                    onAction={onWorkoutAction}
                  />
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
                {programs.map(program => (
                  <ProgramCard 
                    key={program.id} 
                    program={program} 
                    onAction={handleProgramAction}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <VideoModal 
        workout={currentVideo}
        isOpen={!!currentVideo}
        onClose={closeVideo}
      />
    </div>
  );
};

export default FitnessIntegration;
