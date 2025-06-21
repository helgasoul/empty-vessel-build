
import { Calendar, Baby, Heart, Flower } from "lucide-react";

export const healthAreas = [
  {
    title: "Менструальный цикл",
    description: "Отслеживание и анализ цикла",
    expandedDescription: "Персонализированное отслеживание менструального цикла с прогнозированием и выявлением паттернов для улучшения женского здоровья",
    icon: Calendar,
    color: "from-rose-500 to-pink-500",
    bgColor: "from-rose-50 to-pink-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    buttonAction: "Начать отслеживать",
    value: "Точные прогнозы и здоровые циклы",
    route: "/menstrual-cycle-tracker"
  },
  {
    title: "Планирование беременности",
    description: "Подготовка к материнству",
    expandedDescription: "Комплексная подготовка к беременности с оптимизацией фертильности, планированием витаминов и мониторингом готовности организма",
    icon: Baby,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    buttonAction: "Начать планирование",
    value: "Повышение шансов на здоровую беременность",
    route: "/pregnancy-planning"
  },
  {
    title: "Гормональное здоровье",
    description: "Мониторинг гормонального баланса",
    expandedDescription: "Отслеживание гормональных показателей, выявление дисбаланса и персонализированные рекомендации для гормональной гармонии",
    icon: Heart,
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-50 to-violet-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    buttonAction: "Проверить баланс",
    value: "Гормональная гармония и энергия",
    route: "/hormonal-health-demo"
  },
  {
    title: "Менопауза",
    description: "Поддержка в переходный период",
    expandedDescription: "Комфортное прохождение менопаузы с персонализированными рекомендациями, отслеживанием симптомов и поддержкой здоровья",
    icon: Flower,
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    buttonAction: "Получить поддержку",
    value: "Комфортный переход и активная жизнь",
    route: "/menopause-demo"
  }
];
