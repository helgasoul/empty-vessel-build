
export interface AgeGroup {
  name: string;
  minAge: number;
  maxAge: number;
  key: string;
}

export const AGE_GROUPS: AgeGroup[] = [
  { name: '18-25 лет', minAge: 18, maxAge: 25, key: 'young_adult' },
  { name: '26-35 лет', minAge: 26, maxAge: 35, key: 'adult' },
  { name: '36-45 лет', minAge: 36, maxAge: 45, key: 'middle_adult' },
  { name: '46-55 лет', minAge: 46, maxAge: 55, key: 'mature_adult' },
  { name: '56+ лет', minAge: 56, maxAge: 100, key: 'senior' }
];

export const getAgeGroup = (age: number): AgeGroup => {
  return AGE_GROUPS.find(group => age >= group.minAge && age <= group.maxAge) || AGE_GROUPS[1];
};

export interface HealthRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'prevention' | 'screening' | 'lifestyle' | 'supplements';
}

export interface NutritionRecommendation {
  title: string;
  description: string;
  nutrients: string[];
  foods: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface FitnessRecommendation {
  title: string;
  description: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'balance';
  frequency: string;
  duration: string;
  intensity: 'low' | 'moderate' | 'high';
}

export const HEALTH_RECOMMENDATIONS: Record<string, HealthRecommendation[]> = {
  young_adult: [
    {
      title: 'Профилактика и здоровые привычки',
      description: 'Формируйте здоровые привычки на всю жизнь: регулярный сон, сбалансированное питание, физическая активность',
      priority: 'high',
      category: 'lifestyle'
    },
    {
      title: 'Репродуктивное здоровье',
      description: 'Регулярные гинекологические осмотры, планирование беременности, контрацепция',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Витамин D и фолиевая кислота',
      description: 'Поддержание оптимального уровня витамина D, прием фолиевой кислоты при планировании беременности',
      priority: 'medium',
      category: 'supplements'
    },
    {
      title: 'Профилактика ИППП',
      description: 'Безопасные интимные отношения, регулярные анализы на ИППП',
      priority: 'high',
      category: 'prevention'
    }
  ],
  adult: [
    {
      title: 'Скрининг шейки матки',
      description: 'Цитология каждые 3 года или ВПЧ-тест каждые 5 лет',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Контроль веса и метаболизма',
      description: 'Мониторинг ИМТ, уровня глюкозы и холестерина',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Фертильность и планирование семьи',
      description: 'Оценка овариального резерва, планирование беременности',
      priority: 'medium',
      category: 'screening'
    },
    {
      title: 'Профилактика сердечно-сосудистых заболеваний',
      description: 'Контроль артериального давления, здоровый образ жизни',
      priority: 'high',
      category: 'prevention'
    }
  ],
  middle_adult: [
    {
      title: 'Маммография',
      description: 'Ежегодная маммография начиная с 40 лет',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Гормональные изменения',
      description: 'Мониторинг изменений менструального цикла, подготовка к пременопаузе',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Плотность костной ткани',
      description: 'Денситометрия для оценки риска остеопороза',
      priority: 'medium',
      category: 'screening'
    },
    {
      title: 'Кальций и витамин D',
      description: 'Увеличенная потребность в кальции и витамине D для здоровья костей',
      priority: 'high',
      category: 'supplements'
    }
  ],
  mature_adult: [
    {
      title: 'Менопаузальная терапия',
      description: 'Консультация гинеколога-эндокринолога о ЗГТ и альтернативах',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Колоноскопия',
      description: 'Скрининг колоректального рака каждые 10 лет или по рекомендации врача',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Кардиологическое здоровье',
      description: 'Регулярный контроль давления, липидного профиля, ЭКГ',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Омега-3 и антиоксиданты',
      description: 'Поддержка сердечно-сосудистой системы и когнитивных функций',
      priority: 'medium',
      category: 'supplements'
    }
  ],
  senior: [
    {
      title: 'Комплексная гериатрическая оценка',
      description: 'Ежегодная оценка когнитивных функций, физической активности, независимости',
      priority: 'high',
      category: 'screening'
    },
    {
      title: 'Профилактика остеопороза',
      description: 'Регулярная денситометрия, профилактика падений',
      priority: 'high',
      category: 'prevention'
    },
    {
      title: 'Вакцинация',
      description: 'Прививки от гриппа, пневмококка, опоясывающего лишая',
      priority: 'high',
      category: 'prevention'
    },
    {
      title: 'Витамины группы B и D',
      description: 'Поддержка нервной системы и костного здоровья',
      priority: 'high',
      category: 'supplements'
    }
  ]
};

export const NUTRITION_RECOMMENDATIONS: Record<string, NutritionRecommendation[]> = {
  young_adult: [
    {
      title: 'Фолиевая кислота',
      description: 'Особенно важна для женщин репродуктивного возраста',
      nutrients: ['Фолиевая кислота', 'Железо', 'Кальций'],
      foods: ['Листовые зеленые овощи', 'Бобовые', 'Обогащенные злаки'],
      priority: 'high'
    },
    {
      title: 'Железо для профилактики анемии',
      description: 'Повышенная потребность из-за менструаций',
      nutrients: ['Железо', 'Витамин C'],
      foods: ['Красное мясо', 'Рыба', 'Шпинат', 'Цитрусовые'],
      priority: 'high'
    },
    {
      title: 'Здоровые жиры',
      description: 'Омега-3 для мозга и репродуктивного здоровья',
      nutrients: ['Омега-3', 'Витамин E'],
      foods: ['Рыба', 'Орехи', 'Семена льна', 'Авокадо'],
      priority: 'medium'
    }
  ],
  adult: [
    {
      title: 'Антиоксиданты для защиты клеток',
      description: 'Профилактика преждевременного старения',
      nutrients: ['Витамин C', 'Витамин E', 'Бета-каротин'],
      foods: ['Ягоды', 'Цитрусовые', 'Морковь', 'Красный перец'],
      priority: 'high'
    },
    {
      title: 'Клетчатка для пищеварения',
      description: 'Поддержание здорового веса и пищеварения',
      nutrients: ['Клетчатка', 'Пребиотики'],
      foods: ['Цельнозерновые', 'Овощи', 'Фрукты', 'Бобовые'],
      priority: 'high'
    },
    {
      title: 'Белок для поддержания мышечной массы',
      description: 'Профилактика возрастной потери мышц',
      nutrients: ['Белок', 'Лейцин'],
      foods: ['Курица', 'Рыба', 'Яйца', 'Молочные продукты'],
      priority: 'medium'
    }
  ],
  middle_adult: [
    {
      title: 'Кальций для костей',
      description: 'Подготовка к менопаузе и снижению эстрогена',
      nutrients: ['Кальций', 'Витамин D', 'Магний'],
      foods: ['Молочные продукты', 'Сардины', 'Брокколи', 'Миндаль'],
      priority: 'high'
    },
    {
      title: 'Фитоэстрогены',
      description: 'Природные соединения для гормонального баланса',
      nutrients: ['Изофлавоны', 'Лигнаны'],
      foods: ['Соя', 'Семена льна', 'Красный клевер', 'Нут'],
      priority: 'medium'
    },
    {
      title: 'Омега-3 для сердца',
      description: 'Профилактика сердечно-сосудистых заболеваний',
      nutrients: ['EPA', 'DHA'],
      foods: ['Жирная рыба', 'Грецкие орехи', 'Семена чиа'],
      priority: 'high'
    }
  ],
  mature_adult: [
    {
      title: 'Менопаузальная поддержка',
      description: 'Питательные вещества для облегчения симптомов менопаузы',
      nutrients: ['Изофлавоны сои', 'Витамин E', 'Магний'],
      foods: ['Тофу', 'Темпе', 'Семена подсолнечника', 'Темная зелень'],
      priority: 'high'
    },
    {
      title: 'Кардиопротективное питание',
      description: 'Средиземноморская диета для сердца',
      nutrients: ['Мононенасыщенные жиры', 'Полифенолы'],
      foods: ['Оливковое масло', 'Красное вино (умеренно)', 'Орехи'],
      priority: 'high'
    },
    {
      title: 'Витамины группы B',
      description: 'Поддержка нервной системы и энергетического обмена',
      nutrients: ['B12', 'B6', 'Фолиевая кислота'],
      foods: ['Печень', 'Рыба', 'Яйца', 'Обогащенные злаки'],
      priority: 'medium'
    }
  ],
  senior: [
    {
      title: 'Легкоусвояемые белки',
      description: 'Поддержание мышечной массы в пожилом возрасте',
      nutrients: ['Полноценные белки', 'Лейцин'],
      foods: ['Рыба', 'Яйца', 'Творог', 'Курица'],
      priority: 'high'
    },
    {
      title: 'Гидратация и электролиты',
      description: 'Поддержание водного баланса',
      nutrients: ['Калий', 'Натрий', 'Магний'],
      foods: ['Бананы', 'Авокадо', 'Овощные бульоны'],
      priority: 'high'
    },
    {
      title: 'Когнитивная поддержка',
      description: 'Питательные вещества для мозга',
      nutrients: ['Омега-3', 'Витамин E', 'Флавоноиды'],
      foods: ['Черника', 'Грецкие орехи', 'Темный шоколад'],
      priority: 'medium'
    }
  ]
};

export const FITNESS_RECOMMENDATIONS: Record<string, FitnessRecommendation[]> = {
  young_adult: [
    {
      title: 'Высокоинтенсивные интервальные тренировки (HIIT)',
      description: 'Максимизация метаболизма и выносливости',
      type: 'cardio',
      frequency: '3-4 раза в неделю',
      duration: '20-30 минут',
      intensity: 'high'
    },
    {
      title: 'Силовые тренировки',
      description: 'Наращивание мышечной массы и плотности костей',
      type: 'strength',
      frequency: '3-4 раза в неделю',
      duration: '45-60 минут',
      intensity: 'moderate'
    },
    {
      title: 'Функциональные движения',
      description: 'Кроссфит, функциональный тренинг для общей физической подготовки',
      type: 'strength',
      frequency: '2-3 раза в неделю',
      duration: '45 минут',
      intensity: 'high'
    },
    {
      title: 'Йога или пилатес',
      description: 'Гибкость, баланс и ментальное здоровье',
      type: 'flexibility',
      frequency: '2-3 раза в неделю',
      duration: '60 минут',
      intensity: 'low'
    }
  ],
  adult: [
    {
      title: 'Кардио средней интенсивности',
      description: 'Бег, велосипед, плавание для сердечно-сосудистого здоровья',
      type: 'cardio',
      frequency: '4-5 раз в неделю',
      duration: '30-45 минут',
      intensity: 'moderate'
    },
    {
      title: 'Силовые тренировки с весами',
      description: 'Поддержание мышечной массы и метаболизма',
      type: 'strength',
      frequency: '3 раза в неделю',
      duration: '45 минут',
      intensity: 'moderate'
    },
    {
      title: 'Групповые занятия',
      description: 'Зумба, аэробика, степ для мотивации',
      type: 'cardio',
      frequency: '2-3 раза в неделю',
      duration: '45-60 минут',
      intensity: 'moderate'
    },
    {
      title: 'Растяжка и мобильность',
      description: 'Ежедневная растяжка для гибкости',
      type: 'flexibility',
      frequency: 'ежедневно',
      duration: '15-20 минут',
      intensity: 'low'
    }
  ],
  middle_adult: [
    {
      title: 'Силовые тренировки для плотности костей',
      description: 'Подготовка к менопаузе и профилактика остеопороза',
      type: 'strength',
      frequency: '3 раза в неделю',
      duration: '40-45 минут',
      intensity: 'moderate'
    },
    {
      title: 'Низкоударное кардио',
      description: 'Ходьба, эллипсоид, плавание для суставов',
      type: 'cardio',
      frequency: '4-5 раз в неделю',
      duration: '30-40 минут',
      intensity: 'moderate'
    },
    {
      title: 'Йога для гормонального баланса',
      description: 'Восстановительная йога для снижения стресса',
      type: 'flexibility',
      frequency: '3-4 раза в неделю',
      duration: '45-60 минут',
      intensity: 'low'
    },
    {
      title: 'Тренировки на равновесие',
      description: 'Профилактика падений и улучшение координации',
      type: 'balance',
      frequency: '2-3 раза в неделю',
      duration: '20-30 минут',
      intensity: 'low'
    }
  ],
  mature_adult: [
    {
      title: 'Водная аэробика',
      description: 'Щадящие тренировки для суставов',
      type: 'cardio',
      frequency: '3-4 раза в неделю',
      duration: '45 минут',
      intensity: 'moderate'
    },
    {
      title: 'Тренировки с сопротивлением',
      description: 'Эластичные ленты и легкие веса для мышц',
      type: 'strength',
      frequency: '2-3 раза в неделю',
      duration: '30-40 минут',
      intensity: 'low'
    },
    {
      title: 'Тай-чи или цигун',
      description: 'Медленные движения для баланса и гибкости',
      type: 'balance',
      frequency: '3-4 раза в неделю',
      duration: '30-45 минут',
      intensity: 'low'
    },
    {
      title: 'Ежедневная ходьба',
      description: 'Базовая кардионагрузка и поддержание активности',
      type: 'cardio',
      frequency: 'ежедневно',
      duration: '30-60 минут',
      intensity: 'low'
    }
  ],
  senior: [
    {
      title: 'Легкие упражнения на стуле',
      description: 'Безопасные движения для поддержания подвижности',
      type: 'flexibility',
      frequency: 'ежедневно',
      duration: '15-20 минут',
      intensity: 'low'
    },
    {
      title: 'Тренировки равновесия',
      description: 'Профилактика падений и сохранение независимости',
      type: 'balance',
      frequency: '3-4 раза в неделю',
      duration: '20-30 минут',
      intensity: 'low'
    },
    {
      title: 'Медленная ходьба',
      description: 'Поддержание кардиоваскулярного здоровья',
      type: 'cardio',
      frequency: 'ежедневно',
      duration: '20-30 минут',
      intensity: 'low'
    },
    {
      title: 'Легкая растяжка',
      description: 'Поддержание гибкости и подвижности суставов',
      type: 'flexibility',
      frequency: 'ежедневно',
      duration: '10-15 минут',
      intensity: 'low'
    }
  ]
};

export const getRecommendationsForAge = (age: number) => {
  const ageGroup = getAgeGroup(age);
  return {
    ageGroup,
    health: HEALTH_RECOMMENDATIONS[ageGroup.key] || [],
    nutrition: NUTRITION_RECOMMENDATIONS[ageGroup.key] || [],
    fitness: FITNESS_RECOMMENDATIONS[ageGroup.key] || []
  };
};
