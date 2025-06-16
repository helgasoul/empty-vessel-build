
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Utensils,
  Users,
  Apple,
  ChefHat,
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

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  if (!recipe) return null;

  const ingredients = [
    "150г киноа",
    "200г свежих ягод (черника, малина)",
    "30г миндаля",
    "1 авокадо",
    "2 ст.л. семян чиа",
    "1 ст.л. кокосового масла",
    "200мл миндального молока",
    "1 ч.л. меда"
  ];

  const instructions = [
    "Промойте киноа под холодной водой до тех пор, пока вода не станет прозрачной.",
    "Отварите киноа в подсоленной воде согласно инструкции на упаковке (обычно 12-15 минут).",
    "Пока киноа варится, нарежьте авокадо небольшими кубиками.",
    "Обжарьте миндаль на сухой сковороде до золотистого цвета.",
    "Смешайте готовую киноа с авокадо, ягодами и семенами чиа.",
    "Добавьте миндальное молоко и мед, аккуратно перемешайте.",
    "Выложите в тарелку, украсьте обжаренным миндалем и подавайте."
  ];

  const nutritionFacts = [
    { name: "Белки", value: "12г", percentage: 24 },
    { name: "Жиры", value: "18г", percentage: 32 },
    { name: "Углеводы", value: "45г", percentage: 44 },
    { name: "Клетчатка", value: "8г", percentage: 32 },
    { name: "Железо", value: "3.2мг", percentage: 18 },
    { name: "Магний", value: "89мг", percentage: 22 }
  ];

  const getCyclePhaseText = (phase?: string) => {
    switch (phase) {
      case 'menstrual': return 'Менструальная фаза';
      case 'follicular': return 'Фолликулярная фаза';
      case 'ovulatory': return 'Овуляторная фаза';
      case 'luteal': return 'Лютеиновая фаза';
      default: return '';
    }
  };

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

          {/* Recipe Info */}
          <div className="grid md:grid-cols-2 gap-6">
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

            {/* Nutrition Facts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Пищевая ценность (на порцию)</h3>
              <div className="space-y-3">
                {nutritionFacts.map((fact, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{fact.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{fact.value}</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${fact.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{fact.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Ингредиенты ({recipe.ingredients_count})
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-sm">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Инструкции по приготовлению</h3>
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              Добавить в избранное
            </Button>
            <Button variant="outline" className="flex-1">
              <ChefHat className="w-4 h-4 mr-2" />
              Добавить в план питания
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
