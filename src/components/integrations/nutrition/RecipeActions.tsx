
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, ChefHat } from "lucide-react";
import { toast } from "sonner";

interface RecipeActionsProps {
  recipeName: string;
}

const RecipeActions = ({ recipeName }: RecipeActionsProps) => {
  const handleAddToFavorites = () => {
    toast.success(`Рецепт "${recipeName}" добавлен в избранное!`, {
      description: "Вы можете найти его в разделе 'Мои избранные рецепты'"
    });
  };

  const handleAddToMealPlan = () => {
    toast.success(`Рецепт "${recipeName}" добавлен в план питания!`, {
      description: "Рецепт будет включен в ваш персонализированный план питания"
    });
  };

  return (
    <div className="flex space-x-3 pt-4">
      <Button 
        className="flex-1"
        onClick={handleAddToFavorites}
      >
        <Heart className="w-4 h-4 mr-2" />
        Добавить в избранное
      </Button>
      <Button 
        variant="outline" 
        className="flex-1"
        onClick={handleAddToMealPlan}
      >
        <ChefHat className="w-4 h-4 mr-2" />
        Добавить в план питания
      </Button>
    </div>
  );
};

export default RecipeActions;
