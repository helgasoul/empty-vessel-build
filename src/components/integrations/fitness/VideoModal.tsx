
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Video,
  Clock, 
  Flame, 
  Heart
} from "lucide-react";
import { Workout } from './types';

interface VideoModalProps {
  workout: Workout | null;
  isOpen: boolean;
  onClose: () => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Легкий': return 'bg-green-100 text-green-800';
    case 'Средний': return 'bg-yellow-100 text-yellow-800';
    case 'Сложный': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const VideoModal = ({ workout, isOpen, onClose }: VideoModalProps) => {
  if (!workout) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>{workout.title}</span>
          </DialogTitle>
          <DialogDescription>
            Тренировка {workout.type} с {workout.instructor}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative w-full bg-black rounded-lg overflow-hidden">
            <video
              className="w-full h-auto max-h-[400px]"
              controls
              preload="metadata"
              poster={workout.thumbnail}
            >
              <source src={workout.video_url} type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>

          {/* Video Info */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getDifficultyColor(workout.difficulty)}>
                  {workout.difficulty}
                </Badge>
                <Badge variant="secondary">{workout.type}</Badge>
              </div>
              
              <h3 className="text-xl font-montserrat font-semibold mb-1">
                {workout.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                с {workout.instructor}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {workout.description}
              </p>

              <div className="flex items-center space-x-4 text-sm mb-4">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{workout.duration} мин</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>{workout.calories} ккал</span>
                </span>
              </div>

              {workout.equipment.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Оборудование:</p>
                  <div className="flex flex-wrap gap-1">
                    {workout.equipment.map((item, index) => (
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
              {workout.progress !== undefined && workout.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс</span>
                    <span>{workout.progress}%</span>
                  </div>
                  <Progress value={workout.progress} className="h-2" />
                </div>
              )}

              <div className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  В избранное
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
