
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Video,
  Clock, 
  Play,
  CheckCircle,
  Calendar,
  BookOpen
} from "lucide-react";
import { FitnessProgram, ProgramLesson } from './types';

interface ProgramLessonsModalProps {
  program: FitnessProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayLesson: (lesson: ProgramLesson) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Легкий': return 'bg-green-100 text-green-800';
    case 'Средний': return 'bg-yellow-100 text-yellow-800';
    case 'Сложный': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ProgramLessonsModal = ({ program, isOpen, onClose, onPlayLesson }: ProgramLessonsModalProps) => {
  const [selectedWeek, setSelectedWeek] = useState(1);

  if (!program || !program.lessons) return null;

  const weeks = [...Array(program.duration_weeks)].map((_, i) => i + 1);
  const weekLessons = program.lessons.filter(lesson => lesson.week === selectedWeek);
  const completedLessons = program.lessons.filter(lesson => lesson.completed).length;
  const totalLessons = program.lessons.length;
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Уроки программы: {program.name}</span>
          </DialogTitle>
          <DialogDescription>
            {program.duration_weeks} недель • {program.workouts_per_week}x в неделю • {program.instructor}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Общий прогресс</span>
              <span className="text-sm text-gray-600">{completedLessons} из {totalLessons} уроков</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-sm text-gray-600 mt-1">{overallProgress}% завершено</p>
          </div>

          {/* Week Selection */}
          <div>
            <h3 className="font-semibold mb-3">Выберите неделю:</h3>
            <div className="flex flex-wrap gap-2">
              {weeks.map(week => {
                const weekLessonsCount = program.lessons?.filter(l => l.week === week).length || 0;
                const weekCompletedCount = program.lessons?.filter(l => l.week === week && l.completed).length || 0;
                const isCompleted = weekCompletedCount === weekLessonsCount;
                
                return (
                  <Button
                    key={week}
                    variant={selectedWeek === week ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWeek(week)}
                    className="relative"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Неделя {week}
                    {isCompleted && (
                      <CheckCircle className="w-3 h-3 ml-1 text-green-500" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Lessons for Selected Week */}
          <div>
            <h3 className="font-semibold mb-3">
              Уроки недели {selectedWeek} ({weekLessons.length} уроков)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weekLessons.map(lesson => (
                <div key={lesson.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={lesson.thumbnail} 
                      alt={lesson.title}
                      className="w-full h-32 object-cover"
                    />
                    {lesson.completed && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold mb-1 line-clamp-2">
                      Урок {lesson.lesson_number}: {lesson.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {lesson.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {lesson.duration} мин
                      </span>
                      <span>{lesson.type}</span>
                    </div>
                    
                    <Button 
                      onClick={() => onPlayLesson(lesson)}
                      className="w-full"
                      variant={lesson.completed ? "outline" : "default"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {lesson.completed ? 'Повторить урок' : 'Начать урок'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramLessonsModal;
