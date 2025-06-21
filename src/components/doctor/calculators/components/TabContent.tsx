
import React, { Suspense } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { CalculatorTab } from '../config/calculatorTabs';

interface TabContentProps {
  tabs: CalculatorTab[];
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export const TabContent: React.FC<TabContentProps> = ({ tabs }) => {
  return (
    <>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <Suspense fallback={<LoadingSpinner />}>
            <tab.component />
          </Suspense>
        </TabsContent>
      ))}
    </>
  );
};
