
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface SupportProgramCardProps {
  category: string;
  title: string;
  description: string;
  progress: number;
  color: string;
  isFavorite: boolean;
  onSupportClick?: () => void;
}

const SupportProgramCard = ({ 
  category, 
  title, 
  description, 
  progress, 
  color, 
  isFavorite, 
  onSupportClick 
}: SupportProgramCardProps) => {
  return (
    <Card className="border-l-4 hover:shadow-lg transition-shadow w-full" style={{ borderLeftColor: color }}>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {category}
                </Badge>
                {isFavorite && <Star className="w-4 h-4 text-amber-500 fill-current flex-shrink-0" />}
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed break-words">{description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Прогресс выполнения</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs sm:text-sm"
            >
              {isFavorite ? 'В избранном' : 'В избранное'}
            </Button>
            <Button 
              size="sm" 
              className="flex-1 text-xs sm:text-sm" 
              style={{ backgroundColor: color }}
              onClick={onSupportClick}
            >
              Выполнено
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportProgramCard;
