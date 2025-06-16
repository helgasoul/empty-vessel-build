
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video,
  Clock, 
  CheckCircle,
  BookOpen
} from "lucide-react";
import { ProgramLesson } from './types';
import { toast } from "sonner";

interface LessonVideoModalProps {
  lesson: ProgramLesson | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkCompleted: (lesson: ProgramLesson) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Легкий': return 'bg-green-100 text-green-800';
    case 'Средний': return 'bg-yellow-100 text-yellow-800';
    case 'Сложный': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const LessonVideoModal = ({ lesson, isOpen, onClose, onMarkCompleted }: LessonVideoModalProps) => {
  if (!lesson) return null;

  const handleMarkCompleted = () => {
    onMarkCompleted(lesson);
    toast.success(`Урок "${lesson.title}" отмечен как завершенный!`, {
      description: 'Отличная работа! Продолжайте заниматься.'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Урок {lesson.lesson_number}: {lesson.title}</span>
          </DialogTitle>
          <DialogDescription>
            Неделя {lesson.week} • {lesson.type} • {lesson.duration} минут
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative w-full bg-black rounded-lg overflow-hidden">
            <video
              className="w-full h-auto max-h-[400px]"
              controls
              preload="metadata"
              poster={lesson.thumbnail}
            >
              <source src={lesson.video_url} type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>

          {/* Lesson Info */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getDifficultyColor(lesson.difficulty)}>
                  {lesson.difficulty}
                </Badge>
                <Badge variant="secondary">{lesson.type}</Badge>
                {lesson.completed && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Завершен
                  </Badge>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-1">
                {lesson.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {lesson.description}
              </p>

              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration} мин</span>
                </span>
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Неделя {lesson.week}</span>
                </span>
              </div>
            </div>

            {/* Lesson Controls */}
            <div className="md:w-64 space-y-4">
              {!lesson.completed && (
                <Button 
                  onClick={handleMarkCompleted}
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Отметить как завершенный
                </Button>
              )}
              
              {lesson.completed && (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Урок завершен!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonVideoModal;
