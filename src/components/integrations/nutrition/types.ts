
export interface Recipe {
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

export interface NutritionGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export interface MealPlan {
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
