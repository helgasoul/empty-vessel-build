
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Dumbbell,
  Video,
  ExternalLink,
  Building2,
  Globe,
  Heart
} from "lucide-react";
import { FitnessProgram } from './types';

interface ProgramCardProps {
  program: FitnessProgram;
  onAction: (program: FitnessProgram) => void;
}

const getPartnerIcon = (type?: string) => {
  switch (type) {
    case 'fitness_club':
      return <Building2 className="w-3 h-3" />;
    case 'yoga_studio':
      return <Heart className="w-3 h-3" />;
    case 'online_platform':
      return <Globe className="w-3 h-3" />;
    default:
      return <Building2 className="w-3 h-3" />;
  }
};

const getPartnerTypeText = (type?: string) => {
  switch (type) {
    case 'fitness_club':
      return 'Фитнес-клуб';
    case 'yoga_studio':
      return 'Йога-студия';
    case 'online_platform':
      return 'Онлайн-платформа';
    default:
      return 'Партнер';
  }
};

const ProgramCard = ({ program, onAction }: ProgramCardProps) => (
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
        {program.partner_type && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-white/90 text-xs">
            {getPartnerIcon(program.partner_type)}
            <span className="ml-1">{getPartnerTypeText(program.partner_type)}</span>
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
          onClick={() => onAction(program)}
        >
          {program.enrolled ? (
            <>
              <Video className="w-4 h-4 mr-2" />
              Продолжить
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Записаться
            </>
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ProgramCard;
