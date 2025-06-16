
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
import { Heart } from "lucide-react";

const qrisk3Schema = z.object({
  age: z.number().min(25).max(84),
  gender: z.enum(['male', 'female']),
  smoking_status: z.enum(['non_smoker', 'ex_smoker', 'light_smoker', 'moderate_smoker', 'heavy_smoker']),
  diabetes: z.boolean().default(false),
  angina_or_heart_attack: z.boolean().default(false),
  chronic_kidney_disease: z.boolean().default(false),
  atrial_fibrillation: z.boolean().default(false),
  rheumatoid_arthritis: z.boolean().default(false),
  cholesterol_hdl_ratio: z.number().min(1).max(12),
  systolic_blood_pressure: z.number().min(70).max(210),
  blood_pressure_treatment: z.boolean().default(false),
  bmi: z.number().min(15).max(50),
  family_history_cvd: z.boolean().default(false),
  ethnicity: z.enum(['white', 'indian', 'pakistani', 'bangladeshi', 'other_asian', 'black_caribbean', 'black_african', 'chinese', 'other']),
});

type QRISK3FormData = z.infer<typeof qrisk3Schema>;

interface QRISK3FormProps {
  onComplete?: () => void;
}

const QRISK3Form: React.FC<QRISK3FormProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<QRISK3FormData>({
    resolver: zodResolver(qrisk3Schema),
    defaultValues: {
      age: 45,
      gender: 'female',
      smoking_status: 'non_smoker',
      diabetes: false,
      angina_or_heart_attack: false,
      chronic_kidney_disease: false,
      atrial_fibrillation: false,
      rheumatoid_arthritis: false,
      cholesterol_hdl_ratio: 4,
      systolic_blood_pressure: 120,
      blood_pressure_treatment: false,
      bmi: 25,
      family_history_cvd: false,
      ethnicity: 'white',
    },
  });

  const calculateQRISK3 = (data: QRISK3FormData) => {
    // Упрощенная версия QRISK3 (реальный алгоритм намного сложнее)
    let score = 0;

    // Возраст
    score += (data.age - 25) * 0.5;

    // Пол
    if (data.gender === 'male') score += 15;

    // Курение
    const smokingFactors = {
      'non_smoker': 0,
      'ex_smoker': 8,
      'light_smoker': 12,
      'moderate_smoker': 18,
      'heavy_smoker': 25
    };
    score += smokingFactors[data.smoking_status];

    // Диабет
    if (data.diabetes) score += 20;

    // Стенокардия или инфаркт
    if (data.angina_or_heart_attack) score += 25;

    // Хроническая болезнь почек
    if (data.chronic_kidney_disease) score += 15;

    // Фибрилляция предсердий
    if (data.atrial_fibrillation) score += 12;

    // Ревматоидный артрит
    if (data.rheumatoid_arthritis) score += 8;

    // Соотношение холестерин/ЛПВП
    score += (data.cholesterol_hdl_ratio - 3) * 3;

    // Систолическое давление
    score += (data.systolic_blood_pressure - 120) * 0.2;

    // Лечение давления
    if (data.blood_pressure_treatment) score += 5;

    // ИМТ
    if (data.bmi > 30) score += 10;
    else if (data.bmi > 25) score += 5;
    else if (data.bmi < 20) score += 3;

    // Семейная история
    if (data.family_history_cvd) score += 8;

    // Этническая принадлежность
    const ethnicityFactors = {
      'white': 0,
      'indian': 5,
      'pakistani': 8,
      'bangladeshi': 10,
      'other_asian': 3,
      'black_caribbean': -2,
      'black_african': -3,
      'chinese': -5,
      'other': 0
    };
    score += ethnicityFactors[data.ethnicity];

    // Конвертируем в процентный риск (упрощенно)
    const riskPercentage = Math.min(Math.max(score / 5, 1), 99);
    const riskLevel = riskPercentage < 10 ? 'low' : riskPercentage < 20 ? 'medium' : 'high';

    return {
      riskPercentage: Math.round(riskPercentage * 10) / 10,
      riskLevel,
      recommendations: generateQRISK3Recommendations(data, riskPercentage),
    };
  };

  const generateQRISK3Recommendations = (data: QRISK3FormData, risk: number): string[] => {
    const recommendations = [];

    if (risk >= 10) {
      recommendations.push('Обязательная консультация кардиолога');
      recommendations.push('Рассмотрите прием статинов');
      recommendations.push('Регулярный мониторинг артериального давления');
    }

    if (data.smoking_status !== 'non_smoker') {
      recommendations.push('Отказ от курения - приоритетная задача');
      recommendations.push('Обратитесь к специалисту по отказу от курения');
    }

    if (data.bmi > 25) {
      recommendations.push('Снижение веса до нормального ИМТ');
      recommendations.push('Консультация диетолога');
    }

    if (data.systolic_blood_pressure > 140) {
      recommendations.push('Контроль артериального давления');
      if (!data.blood_pressure_treatment) {
        recommendations.push('Обсудите с врачом назначение гипотензивных препаратов');
      }
    }

    recommendations.push('Регулярная физическая активность (150 мин/неделя)');
    recommendations.push('Средиземноморская диета');
    recommendations.push('Ограничение потребления соли');
    recommendations.push('Управление стрессом');

    if (risk < 10) {
      recommendations.push('Поддерживайте здоровый образ жизни');
      recommendations.push('Регулярные профилактические осмотры');
    }

    return recommendations;
  };

  const onSubmit = async (data: QRISK3FormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const results = calculateQRISK3(data);

      const { error } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'QRISK3',
          assessment_data: data,
          results_data: results,
          risk_percentage: results.riskPercentage,
          risk_level: results.riskLevel,
          recommendations: results.recommendations,
        });

      if (error) throw error;

      toast.success('Оценка QRISK3 успешно сохранена');
      onComplete?.();
    } catch (error) {
      console.error('Error saving QRISK3 assessment:', error);
      toast.error('Ошибка при сохранении оценки риска');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-600" />
          <span>QRISK3 - Оценка сердечно-сосудистого риска</span>
        </CardTitle>
        <CardDescription>
          10-летний риск развития сердечно-сосудистых заболеваний
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Возраст (25-84 года)</FormLabel>
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

              <FormField
                control={form.control}
                name="bmi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Индекс массы тела (ИМТ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="systolic_blood_pressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Систолическое давление (мм рт.ст.)</FormLabel>
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
                name="cholesterol_hdl_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Соотношение общий холестерин/ЛПВП</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smoking_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус курения</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус курения" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="non_smoker">Не курю</SelectItem>
                        <SelectItem value="ex_smoker">Бросил курить</SelectItem>
                        <SelectItem value="light_smoker">Легкое курение (1-9 сиг/день)</SelectItem>
                        <SelectItem value="moderate_smoker">Умеренное курение (10-19 сиг/день)</SelectItem>
                        <SelectItem value="heavy_smoker">Интенсивное курение (20+ сиг/день)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
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
                        <SelectItem value="indian">Индийская</SelectItem>
                        <SelectItem value="pakistani">Пакистанская</SelectItem>
                        <SelectItem value="bangladeshi">Бангладешская</SelectItem>
                        <SelectItem value="other_asian">Другая азиатская</SelectItem>
                        <SelectItem value="black_caribbean">Чернокожая карибская</SelectItem>
                        <SelectItem value="black_african">Чернокожая африканская</SelectItem>
                        <SelectItem value="chinese">Китайская</SelectItem>
                        <SelectItem value="other">Другая</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Медицинские состояния</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="diabetes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Сахарный диабет</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="angina_or_heart_attack"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Стенокардия или инфаркт</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chronic_kidney_disease"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Хроническая болезнь почек</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="atrial_fibrillation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Фибрилляция предсердий</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rheumatoid_arthritis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Ревматоидный артрит</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blood_pressure_treatment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Лечение гипертонии</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="family_history_cvd"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Семейная история ССЗ</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Расчет...' : 'Рассчитать риск QRISK3'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QRISK3Form;
