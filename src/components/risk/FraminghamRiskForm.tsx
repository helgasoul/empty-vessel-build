
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useFraminghamRisk } from './framingham/useFraminghamRisk';
import FraminghamPersonalInfo from './framingham/FraminghamPersonalInfo';
import FraminghamGeneticFactors from './framingham/FraminghamGeneticFactors';
import FraminghamHealthFactors from './framingham/FraminghamHealthFactors';
import FraminghamLifestyleFactors from './framingham/FraminghamLifestyleFactors';

interface FraminghamRiskFormProps {
  onComplete?: () => void;
}

const FraminghamRiskForm: React.FC<FraminghamRiskFormProps> = ({ onComplete }) => {
  const { form, isLoading, onSubmit } = useFraminghamRisk(onComplete);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>Оценка риска болезни Альцгеймера</span>
        </CardTitle>
        <CardDescription>
          Оценка 10-летнего и пожизненного риска развития болезни Альцгеймера на основе Фрамингемских данных
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800 mb-2">О модели Framingham</h4>
          <p className="text-sm text-purple-700">
            Фрамингемское исследование - одно из самых продолжительных исследований здоровья, 
            которое помогло выявить ключевые факторы риска развития болезни Альцгеймера и деменции. 
            Эта модель учитывает генетические, медицинские и социальные факторы.
          </p>
        </div>

        <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Важное уведомление</h4>
          <p className="text-sm text-amber-700">
            Результаты носят информационный характер и не заменяют консультацию врача. 
            При наличии жалоб на память или когнитивные функции обратитесь к неврологу.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FraminghamPersonalInfo control={form.control} />
            <FraminghamGeneticFactors control={form.control} />
            <FraminghamHealthFactors control={form.control} />
            <FraminghamLifestyleFactors control={form.control} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Расчет...' : 'Рассчитать риск болезни Альцгеймера'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FraminghamRiskForm;
