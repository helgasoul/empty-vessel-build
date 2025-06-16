
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useBCSCRisk } from './bcsc/useBCSCRisk';
import BCSCPersonalInfo from './bcsc/BCSCPersonalInfo';
import BCSCBreastDensity from './bcsc/BCSCBreastDensity';
import BCSCMedicalHistory from './bcsc/BCSCMedicalHistory';
import BCSCReproductiveHistory from './bcsc/BCSCReproductiveHistory';

interface BCSCRiskFormProps {
  onComplete?: () => void;
}

const BCSCRiskForm: React.FC<BCSCRiskFormProps> = ({ onComplete }) => {
  const { form, isLoading, onSubmit } = useBCSCRisk(onComplete);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-600" />
          <span>Оценка риска BCSC v3</span>
        </CardTitle>
        <CardDescription>
          Оценка 5-летнего и пожизненного риска рака молочной железы с учетом плотности
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">О модели BCSC v3</h4>
          <p className="text-sm text-blue-700">
            Breast Cancer Surveillance Consortium (BCSC) v3 - наиболее валидированная модель 
            для оценки риска рака молочной железы, которая учитывает плотность молочной железы 
            по результатам маммографии и другие клинические факторы риска.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BCSCPersonalInfo control={form.control} />
            <BCSCBreastDensity control={form.control} />
            <BCSCMedicalHistory control={form.control} />
            <BCSCReproductiveHistory control={form.control} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Расчет...' : 'Рассчитать риск BCSC v3'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BCSCRiskForm;
