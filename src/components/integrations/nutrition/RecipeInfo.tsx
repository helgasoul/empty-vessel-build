
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Utensils,
  Users,
  Apple,
  Star,
  Heart
} from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  calories: number;
  servings: number;
  difficulty: string;
  dietary_tags: string[];
  ingredients_count: number;
  thumbnail: string;
  health_score: number;
  cyclePhase?: string;
}

interface RecipeInfoProps {
  recipe: Recipe;
}

const getCyclePhaseText = (phase?: string) => {
  switch (phase) {
    case 'menstrual': return 'Менструальная фаза';
    case 'follicular': return 'Фолликулярная фаза';
    case 'ovulatory': return 'Овуляторная фаза';
    case 'luteal': return 'Лютеиновая фаза';
    default: return '';
  }
};

const RecipeInfo = ({ recipe }: RecipeInfoProps) => {
  return (
    <div className="space-y-4">
      {/* Recipe Image */}
      <div className="relative">
        <img 
          src={recipe.thumbnail} 
          alt={recipe.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <Badge className="bg-green-500">
            <Star className="w-3 h-3 mr-1" />
            {recipe.health_score}/100
          </Badge>
          {recipe.cyclePhase && (
            <Badge className="bg-pink-500 text-white">
              {getCyclePhaseText(recipe.cyclePhase)}
            </Badge>
          )}
        </div>
      </div>

      {/* Recipe Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Информация о рецепте</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Время приготовления</p>
              <p className="font-medium">{recipe.prep_time + recipe.cook_time} мин</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Порций</p>
              <p className="font-medium">{recipe.servings}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Utensils className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Сложность</p>
              <p className="font-medium">{recipe.difficulty}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Apple className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Калории</p>
              <p className="font-medium">{recipe.calories} ккал</p>
            </div>
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
              Этот рецепт особенно полезен для {getCyclePhaseText(recipe.cyclePhase).toLowerCase()}, 
              так как содержит необходимые питательные вещества для поддержания здоровья в этот период.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeInfo;
