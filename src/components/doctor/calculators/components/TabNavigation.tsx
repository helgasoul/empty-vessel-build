
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorTab } from '../config/calculatorTabs';

interface TabNavigationProps {
  tabs: CalculatorTab[];
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs }) => {
  return (
    <TabsList className="grid w-full grid-cols-5">
      {tabs.map((tab) => (
        <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
          <tab.icon className="w-4 h-4" />
          <span>{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
