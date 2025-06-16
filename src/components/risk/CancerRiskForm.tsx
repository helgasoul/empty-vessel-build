
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useCancerRisk } from './cancer/useCancerRisk';
import CancerPersonalInfo from './cancer/CancerPersonalInfo';
import CancerLifestyleFactors from './cancer/CancerLifestyleFactors';
import CancerFamilyHistory from './cancer/CancerFamilyHistory';

interface CancerRiskFormProps {
  onComplete?: () => void;
}

const CancerRiskForm: React.FC<CancerRiskFormProps> = ({ onComplete }) => {
  const { form, isLoading, onSubmit } = useCancerRisk(onComplete);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-red-600" />
          <span>Оценка риска развития рака</span>
        </CardTitle>
        <CardDescription>
          Комплексная оценка риска развития различных типов рака на основе Cancer Risk Calculator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">О Cancer Risk Calculator</h4>
          <p className="text-sm text-red-700">
            Этот калькулятор основан на научных данных Cancer Council Queensland и оценивает 
            риск развития основных типов рака с учетом личных факторов риска, семейной истории, 
            образа жизни и других клинических параметров. Результаты носят информационный характер 
            и не заменяют консультацию врача.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CancerPersonalInfo form={form} />
            <CancerLifestyleFactors form={form} />
            <CancerFamilyHistory form={form} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Расчет рисков...' : 'Рассчитать риск развития рака'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CancerRiskForm;
