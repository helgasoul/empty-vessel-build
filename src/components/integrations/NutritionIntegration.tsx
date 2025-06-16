
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Apple, 
  Utensils, 
  Target, 
  TrendingUp,
  Clock,
  Droplets,
  Camera,
  Plus,
  ChefHat,
  BookOpen,
  Zap
} from "lucide-react";

interface NutritionGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  calories_per_day: number;
  duration_days: number;
  meals_per_day: number;
  dietary_restrictions: string[];
  benefits: string[];
  difficulty: string;
  thumbnail: string;
  price?: number;
  aiPersonalized?: boolean;
  matchScore?: number;
}

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

const NutritionIntegration = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'plans' | 'recipes'>('today');

  const dailyGoals: NutritionGoal[] = [
    { name: 'Калории', current: 1680, target: 2000, unit: 'ккал', color: 'bg-blue-500' },
    { name: 'Белки', current: 85, target: 120, unit: 'г', color: 'bg-green-500' },
    { name: 'Жиры', current: 65, target: 80, unit: 'г', color: 'bg-yellow-500' },
    { name: 'Углеводы', current: 180, target: 250, unit: 'г', color: 'bg-purple-500' },
    { name: 'Вода', current: 6, target: 8, unit: 'стаканов', color: 'bg-cyan-500' },
    { name: 'Клетчатка', current: 18, target: 25, unit: 'г', color: 'bg-emerald-500' }
  ];

  const mealPlans: MealPlan[] = [
    {
      id: '1',
      name: 'ИИ: Гормональный баланс+',
      description: 'Персонализированный план на основе анализа вашего цикла и симптомов',
      calories_per_day: 1850,
      duration_days: 14,
      meals_per_day: 5,
      dietary_restrictions: ['Без глютена', 'Низкий ГИ', 'Омега-3'],
      benefits: ['Стабилизация цикла', 'Энергия', 'Красота кожи', 'Снижение ПМС'],
      difficulty: 'Средний',
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: 2500,
      aiPersonalized: true,
      matchScore: 94
    },
    {
      id: '2',
      name: 'Адаптивное питание по фазам',
      description: 'ИИ-план, меняющийся в зависимости от текущей фазы вашего цикла',
      calories_per_day: 1800,
      duration_days: 28,
      meals_per_day: 6,
      dietary_restrictions: ['Циклическое', 'Без сахара', 'Органик'],
      benefits: ['Синхронизация с циклом', 'Легкость', 'Иммунитет', 'Настроение'],
      difficulty: 'Средний',
      thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      aiPersonalized: true,
      matchScore: 89
    },
    {
      id: '3',
      name: 'Активный образ жизни',
      description: 'Питание для поддержания высокого уровня активности',
      calories_per_day: 2200,
      duration_days: 21,
      meals_per_day: 4,
      dietary_restrictions: ['Высокобелковый'],
      benefits: ['Энергия', 'Восстановление', 'Выносливость'],
      difficulty: 'Легкий',
      thumbnail: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: 3200,
      matchScore: 72
    }
  ];

  const featuredRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Боул с киноа для фолликулярной фазы',
      description: 'Питательный завтрак с повышенным содержанием белка для роста энергии',
      prep_time: 15,
      cook_time: 0,
      calories: 420,
      servings: 1,
      difficulty: 'Легкий',
      dietary_tags: ['Веган', 'Без глютена', 'Суперфуды'],
      ingredients_count: 8,
      thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      health_score: 95,
      cyclePhase: 'follicular'
    },
    {
      id: '2',
      name: 'Лосось с магнием (лютеиновая фаза)',
      description: 'Противовоспалительное блюдо с магнием для снижения ПМС',
      prep_time: 10,
      cook_time: 20,
      calories: 380,
      servings: 2,
      difficulty: 'Средний',
      dietary_tags: ['Кето', 'Палео', 'Омега-3', 'Магний'],
      ingredients_count: 6,
      thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      health_score: 88,
      cyclePhase: 'luteal'
    },
    {
      id: '3',
      name: 'Восстанавливающий смузи с железом',
      description: 'Напиток для менструальной фазы с высоким содержанием железа',
      prep_time: 5,
      cook_time: 0,
      calories: 280,
      servings: 1,
      difficulty: 'Легкий',
      dietary_tags: ['Железо', 'Антиоксиданты', 'Восстановление'],
      ingredients_count: 5,
      thumbnail: 'https://images.unsplash.com/photo-1553530979-909c6cedcc77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      health_score: 82,
      cyclePhase: 'menstrual'
    }
  ];

  const GoalCard = ({ goal }: { goal: NutritionGoal }) => {
    const percentage = Math.min((goal.current / goal.target) * 100, 100);
    
    return (
      <Card className="prevent-card">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm">{goal.name}</h4>
              <Badge variant="outline" className="text-xs">
                {goal.current}/{goal.target} {goal.unit}
              </Badge>
            </div>
            <Progress 
              value={percentage} 
              className="h-2" 
            />
            <div className="text-xs text-gray-500">
              {percentage.toFixed(0)}% от цели
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const MealPlanCard = ({ plan }: { plan: MealPlan }) => (
    <Card className="prevent-card relative">
      {plan.aiPersonalized && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Zap className="w-3 h-3 mr-1" />
            ИИ {plan.matchScore}%
          </Badge>
        </div>
      )}
      
      <CardHeader className="p-4">
        <div className="relative">
          <img 
            src={plan.thumbnail} 
            alt={plan.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <Badge className="absolute bottom-2 left-2 bg-white/90 text-gray-800">
            {plan.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg font-montserrat">{plan.name}</CardTitle>
        <CardDescription className="font-roboto">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{plan.calories_per_day} ккал/день</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{plan.duration_days} дней</span>
            </div>
            <div className="flex items-center space-x-1">
              <Utensils className="w-4 h-4" />
              <span>{plan.meals_per_day} приема пищи</span>
            </div>
            {plan.price && (
              <div className="flex items-center space-x-1 font-medium text-primary">
                <span>{plan.price}₽</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Особенности:</p>
            <div className="flex flex-wrap gap-1">
              {plan.dietary_restrictions.map((restriction, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {restriction}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Преимущества:</p>
            <div className="flex flex-wrap gap-1">
              {plan.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>

          {plan.aiPersonalized && (
            <div className="p-2 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-700">
                <Zap className="w-3 h-3 inline mr-1" />
                Персонализировано ИИ на основе вашего цикла и симптомов
              </p>
            </div>
          )}

          <Button className="w-full">
            <ChefHat className="w-4 h-4 mr-2" />
            Выбрать план
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Card className="prevent-card relative">
      <CardHeader className="p-4">
        <div className="relative">
          <img 
            src={recipe.thumbnail} 
            alt={recipe.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <Badge className="absolute top-2 right-2 bg-green-500">
            {recipe.health_score}/100
          </Badge>
          {recipe.cyclePhase && (
            <Badge className="absolute bottom-2 right-2 bg-pink-500 text-white">
              {recipe.cyclePhase === 'menstrual' ? 'Месячные' :
               recipe.cyclePhase === 'follicular' ? 'Фолликулярная' :
               recipe.cyclePhase === 'ovulatory' ? 'Овуляторная' : 'Лютеиновая'}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg font-montserrat line-clamp-2">
          {recipe.name}
        </CardTitle>
        <CardDescription className="font-roboto">
          {recipe.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.prep_time + recipe.cook_time} мин</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{recipe.calories} ккал</span>
            </div>
            <div className="flex items-center space-x-1">
              <Utensils className="w-4 h-4" />
              <span>{recipe.servings} порции</span>
            </div>
            <div className="flex items-center space-x-1">
              <Apple className="w-4 h-4" />
              <span>{recipe.ingredients_count} ингр.</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-1">
              {recipe.dietary_tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {recipe.cyclePhase && (
            <div className="p-2 bg-pink-50 rounded-lg">
              <p className="text-xs text-pink-700">
                ✨ Идеально для вашей текущей фазы цикла
              </p>
            </div>
          )}

          <Button className="w-full">
            <BookOpen className="w-4 h-4 mr-2" />
            Открыть рецепт
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="prevent-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-montserrat">
            <Apple className="w-5 h-5 text-primary" />
            <span>Умное питание с ИИ</span>
          </CardTitle>
          <CardDescription className="font-roboto">
            Персонализированное питание с адаптацией под ваш цикл и потребности
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <Button
              variant={activeTab === 'today' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('today')}
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              Сегодня
            </Button>
            <Button
              variant={activeTab === 'plans' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('plans')}
              className="flex-1"
            >
              <ChefHat className="w-4 h-4 mr-2" />
              ИИ-Планы
            </Button>
            <Button
              variant={activeTab === 'recipes' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('recipes')}
              className="flex-1"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Рецепты
            </Button>
          </div>

          {activeTab === 'today' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-montserrat font-semibold mb-4">
                  Ваши цели на сегодня
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {dailyGoals.map((goal, index) => (
                    <GoalCard key={index} goal={goal} />
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="prevent-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="w-5 h-5" />
                      <span>Быстрый ввод</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Сфотографировать еду
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить продукт
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Droplets className="w-4 h-4 mr-2" />
                      Записать воду
                    </Button>
                  </CardContent>
                </Card>

                <Card className="prevent-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Прогресс недели</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Соблюдение целей</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <div className="text-xs text-gray-500">
                        5 из 7 дней цели достигнуты
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-montserrat font-semibold">
                  Персонализированные планы питания
                </h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Zap className="w-3 h-3 mr-1" />
                  Улучшено ИИ
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mealPlans.map(plan => (
                  <MealPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recipes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-montserrat font-semibold">
                  Рецепты под ваш цикл
                </h3>
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                  Адаптировано под фазу цикла
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionIntegration;
