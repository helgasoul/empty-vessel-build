
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface SymptomCardProps {
  name: string;
  icon: LucideIcon;
  intensity: number;
  frequency: number;
  color: string;
  description: string;
}

const SymptomCard = ({ name, icon: IconComponent, intensity, frequency, color, description }: SymptomCardProps) => {
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return '#7BC4A4';
    if (intensity <= 3) return '#E8B87A';
    return '#E8A07A';
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: `${color}40` }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div 
            className="p-3 rounded-full"
            style={{ backgroundColor: `${color}20` }}
          >
            <IconComponent className="w-6 h-6" style={{ color }} />
          </div>
          <Badge 
            variant="secondary" 
            style={{ backgroundColor: getIntensityColor(intensity), color: 'white' }}
          >
            {intensity}/5
          </Badge>
        </div>
        <CardTitle className="text-lg" style={{ color }}>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Интенсивность</span>
              <span className="font-medium">{intensity}/5</span>
            </div>
            <Progress 
              value={intensity * 20} 
              className="h-2"
              style={{ backgroundColor: `${color}20` }}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Частота</span>
              <span className="font-medium">{frequency} раз</span>
            </div>
            <Progress 
              value={frequency * 20} 
              className="h-2"
              style={{ backgroundColor: `${color}20` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomCard;
