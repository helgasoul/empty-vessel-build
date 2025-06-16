
export interface Workout {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  difficulty: 'Легкий' | 'Средний' | 'Сложный';
  type: string;
  calories: number;
  equipment: string[];
  description: string;
  thumbnail: string;
  completed?: boolean;
  progress?: number;
  video_url?: string;
}

export interface FitnessProgram {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  workouts_per_week: number;
  focus_areas: string[];
  instructor: string;
  level: string;
  thumbnail: string;
  enrolled?: boolean;
  progress?: number;
  website_url?: string;
  partner_type?: 'fitness_club' | 'online_platform' | 'yoga_studio';
}
