
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMenstrualCycle } from './useMenstrualCycle';
import { useSymptomMoodLog } from './useSymptomMoodLog';
import { useHealthData } from './useHealthData';
import { toast } from 'sonner';

export interface SmartNotification {
  id: string;
  type: 'cycle' | 'health' | 'medication' | 'appointment' | 'prediction';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'menstrual' | 'fertility' | 'symptoms' | 'wellness' | 'medical';
  scheduledFor: Date;
  isPersonalized: boolean;
  actionRequired?: boolean;
  actionLabel?: string;
  actionUrl?: string;
  data?: any;
}

export const useSmartNotifications = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { cycles } = useMenstrualCycle();
  const { logs } = useSymptomMoodLog();
  const { dailySummary } = useHealthData();

  const generateCycleBasedNotifications = (): SmartNotification[] => {
    const cycleNotifications: SmartNotification[] = [];
    
    if (cycles.length === 0) return cycleNotifications;

    const latestCycle = cycles[0];
    const today = new Date();
    const cycleStart = new Date(latestCycle.cycle_start_date);
    const daysSinceCycleStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));

    // Уведомления о фазах цикла
    if (daysSinceCycleStart >= 0 && daysSinceCycleStart <= 7) {
      cycleNotifications.push({
        id: `cycle-menstrual-${Date.now()}`,
        type: 'cycle',
        title: 'Менструальная фаза',
        message: 'Сейчас важно отдыхать больше и следить за уровнем железа',
        priority: 'medium',
        category: 'menstrual',
        scheduledFor: new Date(),
        isPersonalized: true,
        actionRequired: true,
        actionLabel: 'Посмотреть рекомендации',
        actionUrl: '/womens-health'
      });
    } else if (daysSinceCycleStart >= 8 && daysSinceCycleStart <= 14) {
      cycleNotifications.push({
        id: `cycle-follicular-${Date.now()}`,
        type: 'cycle',
        title: 'Фолликулярная фаза',
        message: 'Отличное время для интенсивных тренировок и новых проектов!',
        priority: 'low',
        category: 'wellness',
        scheduledFor: new Date(),
        isPersonalized: true,
        actionLabel: 'Запланировать тренировку'
      });
    } else if (daysSinceCycleStart >= 12 && daysSinceCycleStart <= 16) {
      cycleNotifications.push({
        id: `cycle-ovulation-${Date.now()}`,
        type: 'cycle',
        title: 'Период овуляции',
        message: 'Пик фертильности! Отслеживайте базальную температуру',
        priority: 'high',
        category: 'fertility',
        scheduledFor: new Date(),
        isPersonalized: true,
        actionRequired: true,
        actionLabel: 'Записать данные',
        actionUrl: '/womens-health'
      });
    } else if (daysSinceCycleStart >= 17 && daysSinceCycleStart <= 28) {
      cycleNotifications.push({
        id: `cycle-luteal-${Date.now()}`,
        type: 'cycle',
        title: 'Лютеиновая фаза',
        message: 'Время для релаксации и поддержки настроения',
        priority: 'medium',
        category: 'wellness',
        scheduledFor: new Date(),
        isPersonalized: true,
        actionLabel: 'Практики релаксации'
      });
    }

    return cycleNotifications;
  };

  const generateHealthBasedNotifications = (): SmartNotification[] => {
    const healthNotifications: SmartNotification[] = [];

    // Анализ последних записей симптомов
    if (logs.length > 0) {
      const recentLogs = logs.slice(0, 7); // последние 7 дней
      const avgMood = recentLogs.reduce((sum, log) => sum + (log.mood_rating || 0), 0) / recentLogs.length;
      const avgStress = recentLogs.reduce((sum, log) => sum + (log.stress_level || 0), 0) / recentLogs.length;

      if (avgMood < 3) {
        healthNotifications.push({
          id: `health-mood-${Date.now()}`,
          type: 'health',
          title: 'Снижение настроения',
          message: 'Ваше настроение было ниже обычного. Рекомендуем обратиться к специалисту',
          priority: 'high',
          category: 'wellness',
          scheduledFor: new Date(),
          isPersonalized: true,
          actionRequired: true,
          actionLabel: 'Записаться к психологу',
          actionUrl: '/medical-integrations'
        });
      }

      if (avgStress > 7) {
        healthNotifications.push({
          id: `health-stress-${Date.now()}`,
          type: 'health',
          title: 'Высокий уровень стресса',
          message: 'Стресс может влиять на ваш цикл. Попробуйте техники релаксации',
          priority: 'medium',
          category: 'wellness',
          scheduledFor: new Date(),
          isPersonalized: true,
          actionLabel: 'Медитация и дыхание'
        });
      }
    }

    // Анализ данных здоровья
    if (dailySummary) {
      if (dailySummary.total_steps < 5000) {
        healthNotifications.push({
          id: `health-activity-${Date.now()}`,
          type: 'health',
          title: 'Низкая активность',
          message: 'Сегодня вы прошли мало шагов. Даже короткая прогулка поможет!',
          priority: 'low',
          category: 'wellness',
          scheduledFor: new Date(),
          isPersonalized: true,
          actionLabel: 'Запланировать прогулку'
        });
      }

      if (dailySummary.sleep_hours && dailySummary.sleep_hours < 6) {
        healthNotifications.push({
          id: `health-sleep-${Date.now()}`,
          type: 'health',
          title: 'Недостаток сна',
          message: 'Недостаток сна может влиять на гормональный баланс',
          priority: 'high',
          category: 'wellness',
          scheduledFor: new Date(),
          isPersonalized: true,
          actionRequired: true,
          actionLabel: 'Советы по сну'
        });
      }
    }

    return healthNotifications;
  };

  const generatePredictiveNotifications = (): SmartNotification[] => {
    const predictiveNotifications: SmartNotification[] = [];

    // Предсказание ПМС на основе истории
    if (cycles.length > 2 && logs.length > 0) {
      const avgCycleLength = cycles.slice(0, 3).reduce((sum, cycle) => 
        sum + (cycle.cycle_length || 28), 0) / 3;
      
      const latestCycle = cycles[0];
      const cycleStart = new Date(latestCycle.cycle_start_date);
      const daysSinceCycleStart = Math.floor((Date.now() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
      
      // Предупреждение о приближающемся ПМС
      if (daysSinceCycleStart >= (avgCycleLength - 7)) {
        predictiveNotifications.push({
          id: `predict-pms-${Date.now()}`,
          type: 'prediction',
          title: 'Возможное приближение ПМС',
          message: 'На основе ваших данных, ПМС может начаться через 2-3 дня',
          priority: 'medium',
          category: 'menstrual',
          scheduledFor: new Date(),
          isPersonalized: true,
          actionLabel: 'Подготовиться к ПМС'
        });
      }
    }

    return predictiveNotifications;
  };

  const generateAllNotifications = () => {
    setLoading(true);
    const cycleNotifications = generateCycleBasedNotifications();
    const healthNotifications = generateHealthBasedNotifications();
    const predictiveNotifications = generatePredictiveNotifications();

    const allNotifications = [
      ...cycleNotifications,
      ...healthNotifications,
      ...predictiveNotifications
    ].sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setNotifications(allNotifications);
    setLoading(false);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const snoozeNotification = (notificationId: string, hours: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, scheduledFor: new Date(Date.now() + hours * 60 * 60 * 1000) }
        : n
    ));
  };

  useEffect(() => {
    if (user && cycles.length > 0) {
      generateAllNotifications();
    }
  }, [user, cycles, logs, dailySummary]);

  return {
    notifications,
    loading,
    markAsRead,
    snoozeNotification,
    refreshNotifications: generateAllNotifications
  };
};
