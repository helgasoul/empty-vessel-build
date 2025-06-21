
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
    <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-amber-800">{name}</CardTitle>
            <CardDescription className="text-amber-700">
              {specialty} • {experience}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-amber-800 mb-2">Специализация:</h4>
          <div className="flex flex-wrap gap-1">
            {topics.map((topic, topicIndex) => (
              <Badge key={topicIndex} variant="secondary" className="bg-amber-100 text-amber-800">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-800">
            <strong>Ближайший слот:</strong>
            <br />
            {available}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700">
            <MessageCircle className="w-4 h-4 mr-1" />
            Чат
          </Button>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
            <Video className="w-4 h-4 mr-1" />
            Видео
          </Button>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          onClick={onSpecialistClick}
        >
          Записаться на прием
        </Button>
      </CardContent>
    </Card>
  );
};

export default SpecialistCard;
