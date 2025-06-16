
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Clock, 
  Flame, 
  Trophy,
  Video
} from "lucide-react";
import { Workout } from './types';

interface WorkoutCardProps {
  workout: Workout;
  onAction: (workout: Workout) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Легкий': return 'bg-green-100 text-green-800';
    case 'Средний': return 'bg-yellow-100 text-yellow-800';
    case 'Сложный': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const WorkoutCard = ({ workout, onAction }: WorkoutCardProps) => (
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
          onClick={() => onAction(workout)}
        >
          <Play className="w-4 h-4 mr-2" />
          {workout.completed ? 'Повторить' : workout.progress ? 'Продолжить' : 'Начать'}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default WorkoutCard;
