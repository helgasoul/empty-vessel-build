
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { CalculatorTab } from '../config/calculatorTabs';
import ThyroidCalculators from '../ThyroidCalculators';
import HormonalMetabolicCalculators from '../HormonalMetabolicCalculators';
import EndocrinologyCalculators from '../EndocrinologyCalculators';
import MetabolicCalculators from '../MetabolicCalculators';
import GynecologyCalculators from '../GynecologyCalculators';
import CardiovascularCalculators from '../CardiovascularCalculators';
import PsychologicalScales from '../PsychologicalScales';

interface TabContentProps {
  tabs: CalculatorTab[];
}

export const TabContent = ({ tabs }: TabContentProps) => {
  const renderCalculatorComponent = (componentName: string) => {
    switch (componentName) {
      case 'ThyroidCalculators':
        return <ThyroidCalculators />;
      case 'HormonalMetabolicCalculators':
        return <HormonalMetabolicCalculators />;
      case 'EndocrinologyCalculators':
        return <EndocrinologyCalculators />;
      case 'MetabolicCalculators':
        return <MetabolicCalculators />;
      case 'GynecologyCalculators':
        return <GynecologyCalculators />;
      case 'CardiovascularCalculators':
        return <CardiovascularCalculators />;
      case 'PsychologicalScales':
        return <PsychologicalScales />;
      default:
        return <div>Калькулятор в разработке</div>;
    }
  };

  return (
    <>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-6">
          {renderCalculatorComponent(tab.component)}
        </TabsContent>
      ))}
    </>
  );
};
