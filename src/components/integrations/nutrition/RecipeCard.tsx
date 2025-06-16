
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users,
  Apple,
  Star,
  Heart,
  ChefHat
} from "lucide-react";
import { Recipe } from './types';

interface RecipeCardProps {
  recipe: Recipe;
  onOpenRecipe: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onOpenRecipe }: RecipeCardProps) => {
  const getCyclePhaseText = (phase?: string) => {
    switch (phase) {
      case 'menstrual': return 'Менструальная фаза';
      case 'follicular': return 'Фолликулярная фаза';
      case 'ovulatory': return 'Овуляторная фаза';
      case 'luteal': return 'Лютеиновая фаза';
      default: return '';
    }
  };

  const getCyclePhaseColor = (phase?: string) => {
    switch (phase) {
      case 'menstrual': return 'bg-red-500';
      case 'follicular': return 'bg-green-500';
      case 'ovulatory': return 'bg-blue-500';
      case 'luteal': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="prevent-card hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={recipe.thumbnail} 
          alt={recipe.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <Badge className="bg-green-500">
            <Star className="w-3 h-3 mr-1" />
            {recipe.health_score}/100
          </Badge>
          {recipe.cyclePhase && (
            <Badge className={`${getCyclePhaseColor(recipe.cyclePhase)} text-white`}>
              {getCyclePhaseText(recipe.cyclePhase)}
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{recipe.name}</CardTitle>
        <CardDescription className="text-sm">
          {recipe.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{recipe.prep_time + recipe.cook_time} мин</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{recipe.servings} порций</span>
          </div>
          <div className="flex items-center space-x-2">
            <Apple className="w-4 h-4 text-gray-500" />
            <span>{recipe.calories} ккал</span>
          </div>
          <div className="flex items-center space-x-2">
            <ChefHat className="w-4 h-4 text-gray-500" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Особенности диеты:</p>
          <div className="flex flex-wrap gap-1">
            {recipe.dietary_tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {recipe.cyclePhase && (
          <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <p className="text-sm text-pink-700 dark:text-pink-300">
              <Heart className="w-4 h-4 inline mr-1" />
              Рекомендовано для {getCyclePhaseText(recipe.cyclePhase).toLowerCase()}
            </p>
          </div>
        )}

        <Button 
          onClick={() => onOpenRecipe(recipe)}
          className="w-full"
        >
          Открыть рецепт
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
