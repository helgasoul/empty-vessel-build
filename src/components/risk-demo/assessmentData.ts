
import { Shield, Heart, Brain, Activity } from "lucide-react";
import { AssessmentType } from "./types";

export const assessmentTypes: AssessmentType[] = [
  {
    title: "QRISK3",
    displayName: "Сердечно-сосудистые риски",
    description: "Оценка 10-летнего риска инфаркта и инсульта",
    tooltip: "Британский алгоритм QRISK3 — золотой стандарт оценки сердечно-сосудистых рисков, используемый в NHS. Анализирует 22+ фактора риска.",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    bgColor: "from-red-50 to-pink-50",
    validation: "Рекомендован NHS и ESC",
    accuracy: "92% точность",
    tab: "assessment"
  },
  {
    title: "BCSC v3",
    displayName: "Рак молочной железы",
    description: "Персональная оценка риска рака груди",
    tooltip: "Breast Cancer Surveillance Consortium — ведущий американский алгоритм оценки риска рака молочной железы, учитывающий плотность тканей груди.",
    icon: Activity,
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-50 to-rose-50",
    validation: "Одобрен FDA",
    accuracy: "88% точность",
    tab: "assessment"
  },
  {
    title: "DemPoRT",
    displayName: "Риск деменции",
    description: "Прогноз когнитивных нарушений на 5 лет",
    tooltip: "Dementia Population Risk Tool — канадский алгоритм для оценки популяционного риска деменции, разработанный на основе данных 75,000+ пациентов.",
    icon: Brain,
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-50 to-indigo-50",
    validation: "Валидирован международно",
    accuracy: "85% точность",
    tab: "assessment"
  },
  {
    title: "Cancer Risk",
    displayName: "Общий онкориск",
    description: "Комплексная оценка онкологических рисков",
    tooltip: "Мультифакторный анализ риска различных видов рака на основе генетических, средовых и поведенческих факторов.",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    validation: "Научно подтверждено",
    accuracy: "89% точность",
    tab: "assessment"
  }
];
