
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Heart, Info } from "lucide-react";

const gailSchema = z.object({
  age: z.number().min(35).max(85),
  age_at_menarche: z.number().min(10).max(18),
  age_at_first_birth: z.number().min(15).max(50).nullable(),
  num_relatives: z.number().min(0).max(5),
  num_biopsies: z.number().min(0).max(10),
  hyperplasia: z.enum(['none', 'without_atypia', 'with_atypia']),
  race_ethnicity: z.enum(['white', 'african_american', 'hispanic', 'asian', 'other']),
});

type GailFormData = z.infer<typeof gailSchema>;

interface GailRiskFormProps {
  onComplete?: () => void;
}

const GailRiskForm: React.FC<GailRiskFormProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<GailFormData>({
    resolver: zodResolver(gailSchema),
    defaultValues: {
      age: 50,
      age_at_menarche: 12,
      age_at_first_birth: null,
      num_relatives: 0,
      num_biopsies: 0,
      hyperplasia: 'none',
      race_ethnicity: 'white',
    },
  });

  const calculateGailRisk = (data: GailFormData) => {
    // Упрощенная версия модели Гейла
    let relativeRisk = 1.0;

    // Возраст
    const ageFactors = {
      35: 0.5, 40: 0.7, 45: 0.8, 50: 1.0, 
      55: 1.2, 60: 1.4, 65: 1.5, 70: 1.6, 
      75: 1.7, 80: 1.8, 85: 1.9
    };
    const ageKeys = Object.keys(ageFactors).map(Number);
    const closestAge = ageKeys.reduce((prev, curr) => 
      Math.abs(curr - data.age) < Math.abs(prev - data.age) ? curr : prev
    );
    relativeRisk *= ageFactors[closestAge as keyof typeof ageFactors];

    // Возраст первой менструации
    if (data.age_at_menarche <= 11) {
      relativeRisk *= 1.2;
    } else if (data.age_at_menarche >= 14) {
      relativeRisk *= 0.9;
    }

    // Возраст первых родов
    if (data.age_at_first_birth === null || data.age_at_first_birth >= 30) {
      relativeRisk *= 1.3;
    } else if (data.age_at_first_birth < 20) {
      relativeRisk *= 0.8;
    }

    // Количество родственников с раком молочной железы
    relativeRisk *= Math.pow(2.3, data.num_relatives);

    // Количество биопсий
    if (data.num_biopsies >= 2) {
      relativeRisk *= 1.5;
    } else if (data.num_biopsies === 1) {
      relativeRisk *= 1.2;
    }

    // Гиперплазия
    switch (data.hyperplasia) {
      case 'with_atypia':
        relativeRisk *= 2.0;
        break;
      case 'without_atypia':
        relativeRisk *= 1.3;
        break;
    }

    // Этническая принадлежность
    switch (data.race_ethnicity) {
      case 'african_american':
        relativeRisk *= 0.7;
        break;
      case 'hispanic':
        relativeRisk *= 0.8;
        break;
      case 'asian':
        relativeRisk *= 0.6;
        break;
    }

    // Базовый риск по возрасту (5-летний риск)
    const baselineRisks = {
      35: 0.4, 40: 0.6, 45: 0.9, 50: 1.1, 
      55: 1.4, 60: 1.7, 65: 2.1, 70: 2.5, 
      75: 2.8, 80: 3.0, 85: 3.1
    };
    
    const baselineRisk = baselineRisks[closestAge as keyof typeof baselineRisks] || 1.0;
    const fiveYearRisk = baselineRisk * relativeRisk;
    const lifetimeRisk = fiveYearRisk * 8; // Приблизительная оценка пожизненного риска

    const riskLevel = fiveYearRisk < 1.67 ? 'low' : fiveYearRisk < 3.0 ? 'medium' : 'high';

    return {
      fiveYearRisk: Math.round(fiveYearRisk * 10) / 10,
      lifetimeRisk: Math.min(Math.round(lifetimeRisk * 10) / 10, 50),
      riskLevel,
      recommendations: generateGailRecommendations(fiveYearRisk, data),
    };
  };

  const generateGailRecommendations = (risk: number, data: GailFormData): string[] => {
    const recommendations = [];

    if (risk >= 1.67) {
      recommendations.push('Обсудите с врачом возможность химиопрофилактики (тамоксифен, ралоксифен)');
      recommendations.push('Рассмотрите участие в программах скрининга высокого риска');
    }

    if (data.age >= 40) {
      recommendations.push('Ежегодная маммография');
    } else {
      recommendations.push('Начните ежегодную маммографию с 40 лет');
    }

    if (risk >= 3.0) {
      recommendations.push('Консультация онколога-маммолога');
      recommendations.push('Рассмотрите МРТ молочных желез как дополнение к маммографии');
    }

    recommendations.push('Ежемесячное самообследование молочных желез');
    recommendations.push('Клинический осмотр молочных желез каждые 6-12 месяцев');
    recommendations.push('Поддержание здорового веса');
    recommendations.push('Регулярная физическая активность');
    recommendations.push('Ограничение употребления алкоголя');

    if (data.hyperplasia === 'with_atypia') {
      recommendations.push('Более частое наблюдение у маммолога');
    }

    return recommendations;
  };

  const onSubmit = async (data: GailFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const results = calculateGailRisk(data);

      const { error } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'Gail',
          assessment_data: data,
          results_data: results,
          risk_percentage: results.fiveYearRisk,
          risk_level: results.riskLevel,
          recommendations: results.recommendations,
        });

      if (error) throw error;

      toast.success('Оценка риска по модели Гейла успешно сохранена');
      onComplete?.();
    } catch (error) {
      console.error('Error saving Gail assessment:', error);
      toast.error('Ошибка при сохранении оценки риска');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-600" />
          <span>Модель Гейла (риск рака молочной железы)</span>
        </CardTitle>
        <CardDescription>
          Оценка 5-летнего и пожизненного риска развития рака молочной железы
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">О модели Гейла</h4>
              <p className="text-sm text-blue-700 mt-1">
                Модель Гейла разработана Национальным институтом рака США и используется 
                для оценки риска инвазивного рака молочной железы у женщин от 35 лет.
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
                    <FormLabel>Текущий возраст (35-85 лет)</FormLabel>
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
                name="age_at_menarche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Возраст первой менструации</FormLabel>
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
                name="age_at_first_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Возраст первых родов (или не было родов)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Оставьте пустым, если не было родов"
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value;
                          field.onChange(value === '' ? null : parseInt(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_relatives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество родственников первой степени с раком молочной железы</FormLabel>
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
                name="num_biopsies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество биопсий молочной железы</FormLabel>
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
                name="hyperplasia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Гиперплазия</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип гиперплазии" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Нет</SelectItem>
                        <SelectItem value="without_atypia">Без атипии</SelectItem>
                        <SelectItem value="with_atypia">С атипией</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="race_ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Этническая принадлежность</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите этническую принадлежность" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="white">Европеоидная</SelectItem>
                        <SelectItem value="african_american">Афроамериканская</SelectItem>
                        <SelectItem value="hispanic">Латиноамериканская</SelectItem>
                        <SelectItem value="asian">Азиатская</SelectItem>
                        <SelectItem value="other">Другая</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Расчет...' : 'Рассчитать риск по модели Гейла'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GailRiskForm;
