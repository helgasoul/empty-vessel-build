
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users,
  TrendingUp,
  Star,
  Zap,
  DollarSign
} from "lucide-react";
import { MealPlan } from './types';
import { toast } from "sonner";

interface MealPlanCardProps {
  plan: MealPlan;
  onSelectPlan?: (plan: MealPlan) => void;
}

const MealPlanCard = ({ plan, onSelectPlan }: MealPlanCardProps) => {
  const handleSelectMealPlan = () => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      // Fallback toast for backwards compatibility
      toast.success(`План "${plan.name}" выбран!`, {
        description: `Персонализированный план питания на ${plan.duration_days} дней начинается завтра. Вы получите уведомление с первым меню.`
      });
    }
  };

  return (
    <Card className="prevent-card hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={plan.thumbnail} 
          alt={plan.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {plan.aiPersonalized && (
          <Badge className="absolute top-2 right-2 bg-purple-500">
            <Zap className="w-3 h-3 mr-1" />
            ИИ
          </Badge>
        )}
        {plan.matchScore && (
          <Badge className="absolute top-2 left-2 bg-green-500">
            <Star className="w-3 h-3 mr-1" />
            {plan.matchScore}%
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <CardDescription className="text-sm">
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{plan.duration_days} дней</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{plan.meals_per_day} приемов</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span>{plan.calories_per_day} ккал</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Сложность:</span>
            <span>{plan.difficulty}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Особенности:</p>
          <div className="flex flex-wrap gap-1">
            {plan.dietary_restrictions.map((restriction, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {restriction}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Преимущества:</p>
          <div className="flex flex-wrap gap-1">
            {plan.benefits.map((benefit, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {plan.price ? (
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">{plan.price} ₽</span>
            </div>
          ) : (
            <span className="text-sm text-green-600 font-medium">Бесплатно</span>
          )}
        </div>
        
        <Button 
          onClick={handleSelectMealPlan}
          className="w-full"
        >
          Выбрать план
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealPlanCard;
