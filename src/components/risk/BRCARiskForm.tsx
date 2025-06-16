
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dna, AlertTriangle } from "lucide-react";

const brcaSchema = z.object({
  brca1_mutation: z.boolean().default(false),
  brca2_mutation: z.boolean().default(false),
  family_history_breast: z.boolean().default(false),
  family_history_ovarian: z.boolean().default(false),
  ashkenazi_ancestry: z.boolean().default(false),
  age: z.number().min(18).max(100),
  gender: z.enum(['female', 'male']),
});

type BRCAFormData = z.infer<typeof brcaSchema>;

interface BRCARiskFormProps {
  onComplete?: () => void;
}

const BRCARiskForm: React.FC<BRCARiskFormProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<BRCAFormData>({
    resolver: zodResolver(brcaSchema),
    defaultValues: {
      brca1_mutation: false,
      brca2_mutation: false,
      family_history_breast: false,
      family_history_ovarian: false,
      ashkenazi_ancestry: false,
      age: 30,
      gender: 'female',
    },
  });

  const calculateBRCARisk = (data: BRCAFormData) => {
    let riskPercentage = 5; // базовый риск

    // BRCA1 мутация
    if (data.brca1_mutation) {
      riskPercentage = data.gender === 'female' ? 72 : 8; // женщины: 72%, мужчины: 8%
    }
    
    // BRCA2 мутация
    if (data.brca2_mutation) {
      riskPercentage = data.gender === 'female' ? 69 : 6; // женщины: 69%, мужчины: 6%
    }

    // Семейная история
    if (data.family_history_breast) {
      riskPercentage *= 2;
    }
    
    if (data.family_history_ovarian) {
      riskPercentage *= 1.5;
    }

    // Ашкеназское происхождение
    if (data.ashkenazi_ancestry) {
      riskPercentage *= 1.3;
    }

    // Возрастной фактор
    const ageFactor = data.age > 50 ? 1.2 : data.age < 30 ? 0.8 : 1;
    riskPercentage *= ageFactor;

    // Ограничиваем максимальный риск
    riskPercentage = Math.min(riskPercentage, 85);

    const riskLevel = riskPercentage < 20 ? 'low' : riskPercentage < 50 ? 'medium' : 'high';

    return {
      riskPercentage: Math.round(riskPercentage),
      riskLevel,
      recommendations: generateBRCARecommendations(data, riskPercentage),
    };
  };

  const generateBRCARecommendations = (data: BRCAFormData, risk: number): string[] => {
    const recommendations = [];

    if (data.brca1_mutation || data.brca2_mutation) {
      recommendations.push('Обязательная консультация с генетиком и онкологом');
      recommendations.push('Рассмотрите профилактическую мастэктомию');
      recommendations.push('МРТ молочных желез каждые 6 месяцев');
      if (data.gender === 'female') {
        recommendations.push('Рассмотрите профилактическую овариэктомию после 35-40 лет');
      }
    }

    if (risk > 20) {
      recommendations.push('Ежегодная маммография начиная с 40 лет');
      recommendations.push('Клинический осмотр молочных желез каждые 6 месяцев');
    }

    if (data.family_history_breast || data.family_history_ovarian) {
      recommendations.push('Генетическое консультирование для семьи');
      recommendations.push('Рассмотрите генетическое тестирование');
    }

    recommendations.push('Поддержание здорового образа жизни');
    recommendations.push('Ограничение алкоголя');
    recommendations.push('Регулярная физическая активность');

    return recommendations;
  };

  const onSubmit = async (data: BRCAFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const results = calculateBRCARisk(data);

      // Сохраняем результаты оценки
      const { error: assessmentError } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'BRCA',
          assessment_data: data,
          results_data: results,
          risk_percentage: results.riskPercentage,
          risk_level: results.riskLevel,
          recommendations: results.recommendations,
        });

      if (assessmentError) throw assessmentError;

      // Сохраняем генетические данные, если есть мутации
      if (data.brca1_mutation || data.brca2_mutation) {
        try {
          const { error: geneticError } = await supabase
            .from('genetic_data')
            .insert({
              user_id: user.id,
              test_type: 'BRCA',
              gene_variants: {
                BRCA1: data.brca1_mutation ? 'pathogenic' : 'normal',
                BRCA2: data.brca2_mutation ? 'pathogenic' : 'normal',
              },
              results: {
                brca1_positive: data.brca1_mutation,
                brca2_positive: data.brca2_mutation,
                risk_assessment: results,
              }
            });

          if (geneticError) {
            console.warn('Could not save genetic data:', geneticError);
            // Не блокируем весь процесс, если генетические данные не сохранились
          }
        } catch (error) {
          console.warn('Could not save genetic data:', error);
          // Не блокируем весь процесс
        }
      }

      toast.success('Оценка риска BRCA успешно сохранена');
      onComplete?.();
    } catch (error) {
      console.error('Error saving BRCA assessment:', error);
      toast.error('Ошибка при сохранении оценки риска');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Dna className="w-5 h-5 text-purple-600" />
          <span>Оценка риска BRCA (наследственный рак)</span>
        </CardTitle>
        <CardDescription>
          Оценка генетического риска развития рака молочной железы и яичников
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Важное предупреждение</h4>
              <p className="text-sm text-amber-700 mt-1">
                Данная оценка носит информационный характер. Результаты генетического тестирования 
                должны интерпретироваться только квалифицированным генетиком или онкологом.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Возраст</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пол</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите пол" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Женский</SelectItem>
                        <SelectItem value="male">Мужской</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Генетические мутации</h4>
              
              <FormField
                control={form.control}
                name="brca1_mutation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Мутация гена BRCA1</FormLabel>
                      <p className="text-sm text-gray-600">
                        Подтвержденная патогенная мутация в гене BRCA1
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brca2_mutation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Мутация гена BRCA2</FormLabel>
                      <p className="text-sm text-gray-600">
                        Подтвержденная патогенная мутация в гене BRCA2
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Семейная история</h4>
              
              <FormField
                control={form.control}
                name="family_history_breast"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Рак молочной железы в семье</FormLabel>
                      <p className="text-sm text-gray-600">
                        Близкие родственники (мать, сестра, дочь) с раком молочной железы
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="family_history_ovarian"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Рак яичников в семье</FormLabel>
                      <p className="text-sm text-gray-600">
                        Близкие родственники с раком яичников
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ashkenazi_ancestry"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Ашкеназское еврейское происхождение</FormLabel>
                      <p className="text-sm text-gray-600">
                        Повышенная частота мутаций BRCA в этой популяции
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Расчет...' : 'Рассчитать риск BRCA'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BRCARiskForm;
