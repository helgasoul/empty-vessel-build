
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Activity, Heart, TestTube, Brain, Baby } from "lucide-react";
import EndocrinologyCalculators from './EndocrinologyCalculators';
import MetabolicCalculators from './MetabolicCalculators';
import GynecologyCalculators from './GynecologyCalculators';
import CardiovascularCalculators from './CardiovascularCalculators';
import PsychologicalScales from './PsychologicalScales';

const MedicalCalculatorsModule = () => {
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
        <Tabs defaultValue="endocrinology" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="endocrinology" className="flex items-center space-x-2">
              <TestTube className="w-4 h-4" />
              <span>Эндокринология</span>
            </TabsTrigger>
            <TabsTrigger value="metabolic" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Метаболизм</span>
            </TabsTrigger>
            <TabsTrigger value="gynecology" className="flex items-center space-x-2">
              <Baby className="w-4 h-4" />
              <span>Гинекология</span>
            </TabsTrigger>
            <TabsTrigger value="cardiovascular" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Кардиориски</span>
            </TabsTrigger>
            <TabsTrigger value="psychological" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Психошкалы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endocrinology">
            <EndocrinologyCalculators />
          </TabsContent>

          <TabsContent value="metabolic">
            <MetabolicCalculators />
          </TabsContent>

          <TabsContent value="gynecology">
            <GynecologyCalculators />
          </TabsContent>

          <TabsContent value="cardiovascular">
            <CardiovascularCalculators />
          </TabsContent>

          <TabsContent value="psychological">
            <PsychologicalScales />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalCalculatorsModule;
