
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, Video } from "lucide-react";

interface SpecialistCardProps {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  topics: string[];
  available: string;
  onSpecialistClick?: () => void;
}

const SpecialistCard = ({ 
  name, 
  specialty, 
  experience, 
  rating, 
  topics, 
  available, 
  onSpecialistClick 
}: SpecialistCardProps) => {
  return (
    <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg text-amber-800 break-words">{name}</CardTitle>
            <CardDescription className="text-amber-700 text-sm break-words">
              {specialty} • {experience}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div>
          <h4 className="text-sm font-medium text-amber-800 mb-2">Специализация:</h4>
          <div className="flex flex-wrap gap-1">
            {topics.map((topic, topicIndex) => (
              <Badge 
                key={topicIndex} 
                variant="secondary" 
                className="bg-amber-100 text-amber-800 text-xs"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-800">
            <strong>Ближайший слот:</strong>
            <br />
            <span className="break-words">{available}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-amber-300 text-amber-700 text-xs"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Чат</span>
          </Button>
          <Button 
            size="sm" 
            className="bg-amber-600 hover:bg-amber-700 text-xs"
          >
            <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Видео</span>
          </Button>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-sm"
          onClick={onSpecialistClick}
        >
          Записаться на прием
        </Button>
      </CardContent>
    </Card>
  );
};

export default SpecialistCard;
