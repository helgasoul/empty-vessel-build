
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Medal, Star } from "lucide-react";
import { Achievement, UserAchievement } from "@/hooks/useAchievements";

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
}

const AchievementCard = ({ achievement, userAchievement }: AchievementCardProps) => {
  const isCompleted = userAchievement?.is_completed || false;
  const progress = userAchievement?.progress || 0;
  
  const getIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      case 'award':
        return <Award className="w-6 h-6" />;
      case 'badge':
        return <Medal className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'assessment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'womens_health':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'fitness':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tracking':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'devices':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'community':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'assessment':
        return 'Оценка рисков';
      case 'womens_health':
        return 'Женское здоровье';
      case 'fitness':
        return 'Фитнес';
      case 'tracking':
        return 'Отслеживание';
      case 'devices':
        return 'Устройства';
      case 'community':
        return 'Сообщество';
      default:
        return category;
    }
  };

  return (
    <Card className={`relative transition-all duration-200 ${isCompleted ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'hover:shadow-md'}`}>
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-yellow-500 text-white">
            ✓ Получено
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-full text-white"
              style={{ backgroundColor: achievement.badge_color || '#4A90E2' }}
            >
              {getIcon(achievement.badge_icon)}
            </div>
            <div>
              <CardTitle className="text-base font-montserrat">{achievement.name}</CardTitle>
              <Badge className={getCategoryColor(achievement.category)}>
                {getCategoryName(achievement.category)}
              </Badge>
            </div>
          </div>
          {achievement.points_reward && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
              +{achievement.points_reward} очков
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-3 font-roboto">
          {achievement.description}
        </p>
        
        {!isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Прогресс</span>
              <span>{progress}% / 100%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {isCompleted && userAchievement?.completed_at && (
          <div className="text-xs text-gray-500">
            Получено: {new Date(userAchievement.completed_at).toLocaleDateString('ru-RU')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
