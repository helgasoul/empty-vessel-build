
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorTab } from '../config/calculatorTabs';
import * as Icons from 'lucide-react';

interface TabNavigationProps {
  tabs: CalculatorTab[];
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  return (
    <TabsList className="grid w-full grid-cols-5">
      {tabs.map((tab) => (
        <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
          {getIcon(tab.icon)}
          <span>{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
