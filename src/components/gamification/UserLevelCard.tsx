
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown, TrendingUp, Star } from "lucide-react";
import { useUserLevel } from "@/hooks/useAchievements";

const UserLevelCard = () => {
  const { data: userLevel, isLoading } = useUserLevel();

  if (isLoading) {
    return (
      <Card className="prevent-card">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentLevel = userLevel?.current_level || 1;
  const totalPoints = userLevel?.total_points || 0;
  const pointsToNextLevel = userLevel?.points_to_next_level || 100;
  const progressToNextLevel = ((100 - pointsToNextLevel) / 100) * 100;

  return (
    <Card className="prevent-card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 font-montserrat text-white">
          <Crown className="w-5 h-5" />
          <span>Ваш уровень</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold font-montserrat">Уровень {currentLevel}</div>
              <div className="text-sm opacity-90 font-roboto">
                Всего очков: {totalPoints}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-yellow-300">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-lg font-semibold">{totalPoints}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm opacity-90">
              <span>До следующего уровня</span>
              <span>{pointsToNextLevel} очков</span>
            </div>
            <Progress 
              value={progressToNextLevel} 
              className="h-3 bg-white/20"
            />
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>Продолжайте в том же духе!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLevelCard;
