
import { Calculator, Activity, Heart, TestTube, Brain, Baby } from "lucide-react";
import { ComponentType } from "react";

export interface CalculatorTab {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType;
}

// Lazy load components for better performance
export const getCalculatorTabs = async (): Promise<CalculatorTab[]> => {
  const [
    EndocrinologyCalculators,
    MetabolicCalculators, 
    GynecologyCalculators,
    CardiovascularCalculators,
    PsychologicalScales
  ] = await Promise.all([
    import('../EndocrinologyCalculators').then(m => m.default),
    import('../MetabolicCalculators').then(m => m.default),
    import('../GynecologyCalculators').then(m => m.default),
    import('../CardiovascularCalculators').then(m => m.default),
    import('../PsychologicalScales').then(m => m.default),
  ]);

  return [
    {
      id: 'endocrinology',
      label: 'Эндокринология',
      icon: TestTube,
      component: EndocrinologyCalculators
    },
    {
      id: 'metabolic',
      label: 'Метаболизм', 
      icon: Activity,
      component: MetabolicCalculators
    },
    {
      id: 'gynecology',
      label: 'Гинекология',
      icon: Baby,
      component: GynecologyCalculators
    },
    {
      id: 'cardiovascular',
      label: 'Кардиориски',
      icon: Heart,
      component: CardiovascularCalculators
    },
    {
      id: 'psychological',
      label: 'Психошкалы',
      icon: Brain,
      component: PsychologicalScales
    }
  ];
};
