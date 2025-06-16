
import { ComprehensiveHealthContext } from '../types/aiTypes';

export const generateAdvancedMockResponse = async (message: string, context: ComprehensiveHealthContext) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('анализ') || lowerMessage.includes('состояние')) {
    return {
      content: `На основе анализа ваших данных за последние 30 дней:

🔍 **Общее состояние**: ${context.cycleTrends?.regularityScore && context.cycleTrends.regularityScore > 70 ? 'Хорошее' : 'Требует внимания'}

📊 **Ключевые показатели**:
• Регулярность цикла: ${context.cycleTrends?.regularityScore?.toFixed(0) || 'н/д'}%
• Текущая фаза: ${context.cyclePhase} (день ${context.currentCycleDay})
• Средняя активность: ${context.healthMetrics?.steps || 'н/д'} шагов/день
• Качество сна: ${context.healthMetrics?.sleep || 'н/д'} часов

🎯 **Главные рекомендации**:
${context.recommendations?.immediate?.map(rec => `• ${rec}`).join('\n') || '• Продолжайте ведение дневника здоровья'}

📈 **Прогноз**: Следующий цикл ожидается ${context.predictions?.nextCycleStart || 'через 28 дней'}`,
      context: 'analysis',
      attachments: [{
        type: 'chart' as const,
        data: { type: 'health_overview', metrics: context.healthMetrics }
      }]
    };
  }

  if (lowerMessage.includes('тренировк') || lowerMessage.includes('спорт')) {
    const optimalDays = context.predictions?.optimalWorkoutDays || [];
    return {
      content: `🏃‍♀️ **Персональные рекомендации по тренировкам**:

⚡ **Сейчас (${context.cyclePhase} фаза)**:
${context.cyclePhase === 'follicular' ? '• Отличное время для интенсивных тренировок\n• Высокая энергия и мотивация\n• Силовые и HIIT тренировки' :
  context.cyclePhase === 'ovulatory' ? '• Пиковые возможности организма\n• Максимальная интенсивность\n• Групповые тренировки и соревнования' :
  context.cyclePhase === 'luteal' ? '• Умеренные нагрузки\n• Больше внимания восстановлению\n• Йога, пилатес, растяжка' :
  '• Легкие тренировки\n• Фокус на расслаблении\n• Прогулки, мягкая йога'}

📅 **Оптимальные дни для интенсивных тренировок**: ${optimalDays.length ? optimalDays.join(', ') : 'Определяем...'}

📊 **Ваши показатели**: 
• Средняя активность: ${context.healthMetrics?.steps || 'н/д'} шагов
• Уровень энергии: ${context.moodAnalysis?.energyLevel || 'н/д'}/10
• Тренд активности: ${context.healthMetrics?.stepstrend === 'increasing' ? '📈 Растет' : context.healthMetrics?.stepstrend === 'decreasing' ? '📉 Снижается' : '➡️ Стабильно'}`,
      context: 'health',
      attachments: [{
        type: 'recommendation' as const,
        data: { type: 'workout_plan', phase: context.cyclePhase }
      }]
    };
  }

  if (lowerMessage.includes('питание') || lowerMessage.includes('еда')) {
    const nutritionFocus = context.predictions?.nutritionFocus || [];
    return {
      content: `🍎 **Персональные рекомендации по питанию**:

🎯 **Фокус сейчас** (${context.cyclePhase} фаза):
${context.cyclePhase === 'menstrual' ? '• Железо: красное мясо, шпинат, гранат\n• Магний: темный шоколад, орехи\n• Теплые жидкости и успокаивающие травяные чаи' :
  context.cyclePhase === 'follicular' ? '• Белок для роста тканей\n• Комплексные углеводы для энергии\n• Антиоксиданты: ягоды, зеленый чай' :
  context.cyclePhase === 'ovulatory' ? '• Клетчатка для детоксикации\n• Противовоспалительные продукты\n• Здоровые жиры: авокадо, орехи' :
  '• Кальций и магний для ПМС\n• Сложные углеводы для стабилизации настроения\n• Омега-3: рыба, льняное семя'}

🧪 **Дополнительно на основе ваших данных**:
${nutritionFocus.length ? nutritionFocus.map(focus => `• ${focus}`).join('\n') : '• Базовая сбалансированная диета'}

${context.moodAnalysis?.stressLevel && context.moodAnalysis.stressLevel > 6 ? '\n⚠️ **Антистресс**: Добавьте адаптогены (ашваганда), зеленый чай, избегайте кофеина после 14:00' : ''}`,
      context: 'health'
    };
  }

  if (lowerMessage.includes('симптом') || lowerMessage.includes('самочувств')) {
    const correlations = context.moodAnalysis?.correlations || [];
    return {
      content: `🩺 **Анализ ваших симптомов**:

📋 **Частые симптомы**: ${context.cycleTrends?.symptomPatterns?.join(', ') || 'Данных недостаточно'}

🔗 **Влияние на настроение**:
${correlations.map(corr => `• ${corr.symptom}: влияние ${corr.impact.toFixed(1)}/10`).join('\n') || '• Анализируем закономерности...'}

📊 **Текущее состояние**:
• Настроение: ${context.moodAnalysis?.currentRating || 'н/д'}/10
• Стресс: ${context.moodAnalysis?.stressLevel || 'н/д'}/10  
• Энергия: ${context.moodAnalysis?.energyLevel || 'н/д'}/10

💡 **Рекомендации**:
${context.moodAnalysis?.stressLevel && context.moodAnalysis.stressLevel > 6 ? 
  '• Высокий стресс: практикуйте дыхательные упражнения\n• Рассмотрите медитацию или йогу\n• Обратитесь к специалисту при необходимости' :
  '• Ведите подробный дневник симптомов\n• Обратите внимание на триггеры\n• Поддерживайте здоровый режим сна'}

${correlations.length > 0 ? `\n🎯 **Приоритет**: Работайте над снижением "${correlations[0].symptom}" - это наиболее влияет на ваше самочувствие.` : ''}`,
      context: 'symptoms'
    };
  }

  if (lowerMessage.includes('прогноз') || lowerMessage.includes('предсказ')) {
    return {
      content: `🔮 **Прогнозы на основе ваших данных**:

📅 **Следующий цикл**:
• Ожидается: ${context.predictions?.nextCycleStart || 'через ~28 дней'}
• Длина цикла: ${context.cycleTrends?.averageLength?.toFixed(0) || '28'} дней

⚠️ **Возможные симптомы**: 
${context.predictions?.expectedSymptoms?.map(symptom => `• ${symptom}`).join('\n') || '• На основе данных определяем паттерны...'}

🏃‍♀️ **Оптимальные дни для активности**: 
${context.predictions?.optimalWorkoutDays?.map(day => `• День ${day} цикла`).join('\n') || '• Планируем под вашу фазу цикла'}

🎯 **Подготовка**:
• Запаситесь продуктами с ${context.predictions?.nutritionFocus?.join(', ') || 'железом и магнием'}
• Планируйте расслабляющие активности в первые дни цикла
• Используйте фолликулярную фазу для важных проектов

📊 **Точность прогноза**: ${context.cycleTrends?.regularityScore ? (context.cycleTrends.regularityScore * 0.8).toFixed(0) : '70'}% на основе регулярности ваших циклов`,
      context: 'analysis'
    };
  }

  return {
    content: `Привет! Я анализирую ваши данные и готов дать персонализированные рекомендации по тренировкам, питанию, симптомам и прогнозам. Что вас интересует?`,
    context: 'general'
  };
};
