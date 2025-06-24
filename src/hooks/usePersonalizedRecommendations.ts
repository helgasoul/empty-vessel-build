
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Recommendation {
  id: string;
  type: 'lifestyle' | 'medical' | 'nutrition' | 'exercise' | 'monitoring';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  timeline: string;
  actionable_steps: string[];
  related_findings: string[];
  confidence_level: number;
  is_completed: boolean;
  created_at: string;
}

interface RecommendationFilters {
  type?: string;
  priority?: string;
  completed?: boolean;
}

interface UsePersonalizedRecommendationsReturn {
  recommendations: Recommendation[];
  filteredRecommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  
  refreshRecommendations: () => Promise<void>;
  markAsCompleted: (recommendationId: string) => Promise<boolean>;
  dismissRecommendation: (recommendationId: string) => Promise<boolean>;
  applyFilters: (filters: RecommendationFilters) => void;
  
  // Analytics
  stats: {
    total: number;
    completed: number;
    high_priority: number;
    completion_rate: number;
  };
  
  // Utilities
  hasRecommendations: boolean;
  hasHighPriorityRecommendations: boolean;
  
  utils: {
    groupByType: () => Record<string, Recommendation[]>;
    groupByPriority: () => Record<string, Recommendation[]>;
    getTypeIcon: (type: string) => string;
    getPriorityColor: (priority: string) => string;
    formatTimeline: (timeline: string) => string;
  };
}

export const usePersonalizedRecommendations = (): UsePersonalizedRecommendationsReturn => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RecommendationFilters>({});

  // Load recommendations on mount
  useEffect(() => {
    if (user) {
      refreshRecommendations();
    }
  }, [user]);

  // Apply filters when recommendations or filters change
  useEffect(() => {
    applyFiltersInternal();
  }, [recommendations, filters]);

  const refreshRecommendations = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, this would call your AI recommendation service
      // For now, we'll generate mock recommendations based on user data
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'medical',
          priority: 'high',
          title: 'Запланируйте маммографию',
          description: 'На основе вашего возраста и семейной истории рекомендуется пройти маммографию.',
          rationale: 'Семейная история рака молочной железы увеличивает риск заболевания.',
          timeline: 'В течение 2 недель',
          actionable_steps: [
            'Запишитесь к маммологу',
            'Выберите клинику с цифровой маммографией',
            'Подготовьтесь к процедуре (не используйте дезодорант в день исследования)',
          ],
          related_findings: ['Семейная история', 'Возрастная группа риска'],
          confidence_level: 0.92,
          is_completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'lifestyle',
          priority: 'medium',
          title: 'Увеличьте физическую активность',
          description: 'Регулярные упражнения помогут снизить риск сердечно-сосудистых заболеваний.',
          rationale: 'Ваши данные показывают недостаточную физическую активность.',
          timeline: 'Начать на этой неделе',
          actionable_steps: [
            'Добавьте 30 минут ходьбы ежедневно',
            'Выберите активность, которая вам нравится',
            'Постепенно увеличивайте интенсивность',
          ],
          related_findings: ['Низкая физическая активность', 'Данные с Apple Watch'],
          confidence_level: 0.85,
          is_completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          type: 'nutrition',
          priority: 'medium',
          title: 'Добавьте больше клетчатки в рацион',
          description: 'Увеличение потребления клетчатки поможет улучшить пищеварение и снизить риск диабета.',
          rationale: 'Анализ питания показывает недостаток клетчатки в рационе.',
          timeline: 'Постепенно в течение месяца',
          actionable_steps: [
            'Добавьте овощи к каждому приему пищи',
            'Выбирайте цельнозерновые продукты',
            'Включите в рацион бобовые',
          ],
          related_findings: ['Анализ питания', 'Риск диабета'],
          confidence_level: 0.78,
          is_completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          type: 'monitoring',
          priority: 'low',
          title: 'Отслеживайте артериальное давление',
          description: 'Регулярный мониторинг поможет выявить изменения на ранней стадии.',
          rationale: 'Ваш возраст и семейная история требуют регулярного контроля.',
          timeline: 'Еженедельно',
          actionable_steps: [
            'Приобретите тонометр для домашнего использования',
            'Измеряйте давление в одно и то же время',
            'Ведите дневник измерений',
          ],
          related_findings: ['Возрастные факторы', 'Семейная история гипертонии'],
          confidence_level: 0.70,
          is_completed: false,
          created_at: new Date().toISOString(),
        },
      ];

      setRecommendations(mockRecommendations);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки рекомендаций';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsCompleted = useCallback(async (recommendationId: string): Promise<boolean> => {
    try {
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, is_completed: true }
            : rec
        )
      );

      // In a real implementation, save to database
      return true;
    } catch (err) {
      console.error('Error marking recommendation as completed:', err);
      return false;
    }
  }, []);

  const dismissRecommendation = useCallback(async (recommendationId: string): Promise<boolean> => {
    try {
      setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
      return true;
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
      return false;
    }
  }, []);

  const applyFilters = useCallback((newFilters: RecommendationFilters) => {
    setFilters(newFilters);
  }, []);

  const applyFiltersInternal = useCallback(() => {
    let filtered = [...recommendations];

    if (filters.type) {
      filtered = filtered.filter(rec => rec.type === filters.type);
    }

    if (filters.priority) {
      filtered = filtered.filter(rec => rec.priority === filters.priority);
    }

    if (filters.completed !== undefined) {
      filtered = filtered.filter(rec => rec.is_completed === filters.completed);
    }

    setFilteredRecommendations(filtered);
  }, [recommendations, filters]);

  // Calculate stats
  const stats = {
    total: recommendations.length,
    completed: recommendations.filter(rec => rec.is_completed).length,
    high_priority: recommendations.filter(rec => rec.priority === 'high').length,
    completion_rate: recommendations.length > 0 
      ? recommendations.filter(rec => rec.is_completed).length / recommendations.length * 100
      : 0,
  };

  const hasRecommendations = recommendations.length > 0;
  const hasHighPriorityRecommendations = recommendations.some(rec => rec.priority === 'high' && !rec.is_completed);

  const utils = {
    groupByType: (): Record<string, Recommendation[]> => {
      return recommendations.reduce((acc, rec) => {
        if (!acc[rec.type]) acc[rec.type] = [];
        acc[rec.type].push(rec);
        return acc;
      }, {} as Record<string, Recommendation[]>);
    },

    groupByPriority: (): Record<string, Recommendation[]> => {
      return recommendations.reduce((acc, rec) => {
        if (!acc[rec.priority]) acc[rec.priority] = [];
        acc[rec.priority].push(rec);
        return acc;
      }, {} as Record<string, Recommendation[]>);
    },

    getTypeIcon: (type: string): string => {
      const icons = {
        lifestyle: '🏃‍♀️',
        medical: '🏥',
        nutrition: '🥗',
        exercise: '💪',
        monitoring: '📊',
      };
      return icons[type as keyof typeof icons] || '📝';
    },

    getPriorityColor: (priority: string): string => {
      const colors = {
        high: '#E74C3C',
        medium: '#FFB347',
        low: '#27AE60',
      };
      return colors[priority as keyof typeof colors] || '#6B7280';
    },

    formatTimeline: (timeline: string): string => {
      return timeline;
    },
  };

  return {
    recommendations,
    filteredRecommendations,
    isLoading,
    error,
    refreshRecommendations,
    markAsCompleted,
    dismissRecommendation,
    applyFilters,
    stats,
    hasRecommendations,
    hasHighPriorityRecommendations,
    utils,
  };
};
