
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { useRaisRisk } from './rais/useRaisRisk';
import RaisPersonalInfo from './rais/RaisPersonalInfo';
import RaisExposureParameters from './rais/RaisExposureParameters';
import RaisExposureRoutes from './rais/RaisExposureRoutes';
import RaisEnvironmentalFactors from './rais/RaisEnvironmentalFactors';

interface RaisRiskFormProps {
  onComplete?: () => void;
}

const RaisRiskForm: React.FC<RaisRiskFormProps> = ({ onComplete }) => {
  const { form, isLoading, onSubmit } = useRaisRisk(onComplete);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FlaskConical className="w-5 h-5 text-purple-600" />
          <span>RAIS Chemical Risk Calculator</span>
        </CardTitle>
        <CardDescription>
          Оценка риска воздействия химических веществ на основе методологии EPA RAIS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800 mb-2">О RAIS Chemical Risk Calculator</h4>
          <p className="text-sm text-purple-700">
            RAIS (Risk Assessment Information System) - это система оценки риска воздействия 
            химических веществ, разработанная Агентством по охране окружающей среды США (EPA). 
            Калькулятор оценивает как канцерогенные, так и неканцерогенные риски через различные 
            пути воздействия: ингаляционный, контактный и пероральный.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <RaisPersonalInfo form={form} />
            <RaisExposureParameters form={form} />
            <RaisExposureRoutes form={form} />
            <RaisEnvironmentalFactors form={form} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Расчет химических рисков...' : 'Рассчитать химический риск'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RaisRiskForm;
