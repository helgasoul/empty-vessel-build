
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { useCalculatorTabs } from './hooks/useCalculatorTabs';
import { TabNavigation } from './components/TabNavigation';
import { TabContent } from './components/TabContent';

const LoadingState = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Загрузка калькуляторов...</span>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center p-8 text-red-600">
    <span>Ошибка загрузки: {error}</span>
  </div>
);

const MedicalCalculatorsModule = () => {
  const { tabs, loading, error } = useCalculatorTabs();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>Медицинские калькуляторы и интерпретации</span>
          </CardTitle>
          <CardDescription>
            Автоматизированные расчеты и клинические интерпретации для превентивной медицины
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>Медицинские калькуляторы и интерпретации</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState error={error} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <span>Медицинские калькуляторы и интерпретации</span>
        </CardTitle>
        <CardDescription>
          Автоматизированные расчеты и клинические интерпретации для превентивной медицины
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="thyroid" className="space-y-6">
          <TabNavigation tabs={tabs} />
          <TabContent tabs={tabs} />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalCalculatorsModule;
