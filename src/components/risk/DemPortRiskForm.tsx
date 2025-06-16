
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Brain, ChevronRight, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDemPortRisk } from "./demport/useDemPortRisk";
import DemPortPersonalInfo from "./demport/DemPortPersonalInfo";
import DemPortCardiovascularFactors from "./demport/DemPortCardiovascularFactors";
import DemPortLifestyleFactors from "./demport/DemPortLifestyleFactors";
import DemPortFamilyHistory from "./demport/DemPortFamilyHistory";

interface DemPortRiskFormProps {
  onComplete?: () => void;
}

const DemPortRiskForm = ({ onComplete }: DemPortRiskFormProps) => {
  const { form, isLoading, onSubmit } = useDemPortRisk(onComplete);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Личная информация",
      component: <DemPortPersonalInfo form={form} />
    },
    {
      title: "Сердечно-сосудистые факторы",
      component: <DemPortCardiovascularFactors form={form} />
    },
    {
      title: "Образ жизни",
      component: <DemPortLifestyleFactors form={form} />
    },
    {
      title: "Семейная история",
      component: <DemPortFamilyHistory form={form} />
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span>DemPoRT - Оценка риска деменции</span>
          </CardTitle>
          <CardDescription>
            Инструмент оценки риска деменции на основе популяционных данных
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Шаг {currentStep + 1} из {steps.length}</span>
              <span>{steps[currentStep].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {steps[currentStep].component}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                <span>Далее</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>{isLoading ? 'Вычисление...' : 'Рассчитать риск'}</span>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DemPortRiskForm;
