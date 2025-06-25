
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Heart, Activity, Brain } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  breakdown: {
    physical: number;
    mental: number;
    preventive: number;
  };
}

const HealthScoreWidget: React.FC<HealthScoreProps> = ({ 
  score = 85, 
  breakdown = { physical: 88, mental: 75, preventive: 92 } 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Отлично';
    if (score >= 60) return 'Хорошо';
    return 'Требует внимания';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white border-0 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Индекс здоровья
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-4xl font-bold mb-1">{score}</div>
            <div className="text-purple-100 text-sm">из 100</div>
            <div className="bg-white/20 px-2 py-1 rounded text-xs mt-2">
              {getScoreLabel(score)}
            </div>
          </div>
          
          <div className="w-24 h-24 relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${score * 2.51} 251`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Физическое здоровье
              </span>
              <span className="text-sm">{breakdown.physical}%</span>
            </div>
            <Progress value={breakdown.physical} className="h-1 bg-white/20" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm flex items-center gap-1">
                <Brain className="w-3 h-3" />
                Ментальное здоровье
              </span>
              <span className="text-sm">{breakdown.mental}%</span>
            </div>
            <Progress value={breakdown.mental} className="h-1 bg-white/20" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Профилактика
              </span>
              <span className="text-sm">{breakdown.preventive}%</span>
            </div>
            <Progress value={breakdown.preventive} className="h-1 bg-white/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreWidget;
