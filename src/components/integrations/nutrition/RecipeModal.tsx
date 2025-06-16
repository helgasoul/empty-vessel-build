
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ChefHat } from "lucide-react";
import RecipeInfo from './RecipeInfo';
import RecipeNutrition from './RecipeNutrition';
import RecipeIngredients from './RecipeIngredients';
import RecipeInstructions from './RecipeInstructions';
import RecipeActions from './RecipeActions';

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

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <ChefHat className="w-6 h-6" />
            <span>{recipe.name}</span>
          </DialogTitle>
          <DialogDescription>
            {recipe.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recipe Info and Nutrition */}
          <div className="grid md:grid-cols-2 gap-6">
            <RecipeInfo recipe={recipe} />
            <RecipeNutrition />
          </div>

          <Separator />

          {/* Ingredients */}
          <RecipeIngredients ingredientsCount={recipe.ingredients_count} />

          <Separator />

          {/* Instructions */}
          <RecipeInstructions />

          {/* Action Buttons */}
          <RecipeActions recipeName={recipe.name} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
