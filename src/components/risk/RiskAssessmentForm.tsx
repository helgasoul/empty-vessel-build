
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Heart, Calculator, Loader2 } from "lucide-react";

const qrisk3Schema = z.object({
  age: z.number().min(25).max(84),
  gender: z.enum(['male', 'female']),
  ethnicity: z.enum(['white', 'indian', 'pakistani', 'bangladeshi', 'other_asian', 'black_caribbean', 'black_african', 'chinese', 'other']),
  postcode: z.string().optional(),
  smokingStatus: z.enum(['non_smoker', 'ex_smoker', 'light_smoker', 'moderate_smoker', 'heavy_smoker']),
  diabetesType: z.enum(['none', 'type1', 'type2']),
  familyHistory: z.boolean(),
  chronicKidneyDisease: z.boolean(),
  atrialFibrillation: z.boolean(),
  bloodPressureTreatment: z.boolean(),
  rheumatoidArthritis: z.boolean(),
  migraine: z.boolean(),
  systolicBP: z.number().min(70).max(210),
  cholesterolRatio: z.number().min(1).max(12),
  bmi: z.number().min(15).max(50),
  additionalNotes: z.string().optional(),
});

type QRisk3FormData = z.infer<typeof qrisk3Schema>;

const RiskAssessmentForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QRisk3FormData>({
    resolver: zodResolver(qrisk3Schema),
    defaultValues: {
      familyHistory: false,
      chronicKidneyDisease: false,
      atrialFibrillation: false,
      bloodPressureTreatment: false,
      rheumatoidArthritis: false,
      migraine: false,
    },
  });

  const calculateQRisk3Score = (data: QRisk3FormData): { score: number; level: string } => {
    // Упрощенная формула QRISK3 для демонстрации
    // В реальном приложении здесь должен быть вызов внешнего API или полная формула
    let score = 0;
    
    // Возраст
    score += (data.age - 25) * 0.5;
    
    // Пол
    if (data.gender === 'male') score += 5;
    
    // Курение
    const smokingScores = {
      'non_smoker': 0,
      'ex_smoker': 2,
      'light_smoker': 4,
      'moderate_smoker': 6,
      'heavy_smoker': 8
    };
    score += smokingScores[data.smokingStatus];
    
    // Диабет
    if (data.diabetesType === 'type1') score += 8;
    if (data.diabetesType === 'type2') score += 6;
    
    // Семейная история
    if (data.familyHistory) score += 3;
    
    // Другие факторы
    if (data.chronicKidneyDisease) score += 4;
    if (data.atrialFibrillation) score += 5;
    if (data.bloodPressureTreatment) score += 3;
    if (data.rheumatoidArthritis) score += 2;
    
    // Физиологические показатели
    score += (data.systolicBP - 120) * 0.1;
    score += (data.cholesterolRatio - 4) * 1.5;
    score += (data.bmi - 25) * 0.3;
    
    // Ограничиваем результат
    score = Math.max(0, Math.min(100, score));
    
    const level = score < 10 ? 'low' : score < 20 ? 'medium' : 'high';
    
    return { score: Math.round(score * 100) / 100, level };
  };

  const generateRecommendations = (data: QRisk3FormData, riskLevel: string): string[] => {
    const recommendations: string[] = [];
    
    if (data.smokingStatus !== 'non_smoker') {
      recommendations.push('Прекращение курения значительно снизит ваш сердечно-сосудистый риск');
    }
    
    if (data.bmi > 25) {
      recommendations.push('Снижение веса поможет улучшить ваше сердечно-сосудистое здоровье');
    }
    
    if (data.systolicBP > 140) {
      recommendations.push('Контроль артериального давления критически важен');
    }
    
    if (riskLevel === 'medium' || riskLevel === 'high') {
      recommendations.push('Рекомендуется консультация с кардиологом');
      recommendations.push('Рассмотрите возможность статинотерапии');
    }
    
    recommendations.push('Регулярная физическая активность (минимум 150 минут в неделю)');
    recommendations.push('Средиземноморская диета с низким содержанием насыщенных жиров');
    
    return recommendations;
  };

  const onSubmit = async (data: QRisk3FormData) => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему для проведения оценки рисков",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { score, level } = calculateQRisk3Score(data);
      const recommendations = generateRecommendations(data, level);
      
      // Сохраняем результат оценки в базу данных
      const { data: assessment, error: assessmentError } = await supabase
        .from('risk_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'qrisk3',
          risk_percentage: score,
          risk_level: level,
          assessment_data: data,
          results_data: {
            calculatedScore: score,
            methodology: 'simplified_qrisk3',
            timestamp: new Date().toISOString(),
          },
          recommendations,
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Создаем детальные рекомендации
      const recommendationPromises = recommendations.map((rec, index) => {
        const category = rec.includes('курение') ? 'lifestyle' :
                        rec.includes('вес') ? 'nutrition' :
                        rec.includes('давление') ? 'medical' :
                        rec.includes('активность') || rec.includes('диета') ? 'exercise' :
                        'medical';

        return supabase
          .from('health_recommendations')
          .insert({
            risk_assessment_id: assessment.id,
            category,
            title: `Рекомендация ${index + 1}`,
            description: rec,
            priority: rec.includes('кардиолог') || rec.includes('статин') ? 5 : 3,
          });
      });

      await Promise.all(recommendationPromises);

      toast({
        title: "Оценка завершена",
        description: `Ваш сердечно-сосудистый риск: ${score}% (${level === 'low' ? 'низкий' : level === 'medium' ? 'средний' : 'высокий'})`,
      });

      form.reset();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить результаты оценки",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-red-500" />
          <span>Оценка сердечно-сосудистого риска QRISK3</span>
        </CardTitle>
        <CardDescription>
          Заполните форму для расчета 10-летнего риска сердечно-сосудистых заболеваний
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
                    <FormLabel>Возраст</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="25"
                        max="84"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>От 25 до 84 лет</FormDescription>
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
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
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
                        <SelectItem value="white">Белая</SelectItem>
                        <SelectItem value="indian">Индийская</SelectItem>
                        <SelectItem value="pakistani">Пакистанская</SelectItem>
                        <SelectItem value="bangladeshi">Бангладешская</SelectItem>
                        <SelectItem value="other_asian">Другая азиатская</SelectItem>
                        <SelectItem value="black_caribbean">Чернокожие карибы</SelectItem>
                        <SelectItem value="black_african">Чернокожие африканцы</SelectItem>
                        <SelectItem value="chinese">Китайская</SelectItem>
                        <SelectItem value="other">Другая</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smokingStatus"
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
                        <SelectItem value="heavy_smoker">Тяжелое курение (20+ сиг/день)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diabetesType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Диабет</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип диабета" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Нет диабета</SelectItem>
                        <SelectItem value="type1">Диабет 1 типа</SelectItem>
                        <SelectItem value="type2">Диабет 2 типа</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="systolicBP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Систолическое АД (мм рт.ст.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="70"
                        max="210"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Верхнее давление, от 70 до 210 мм рт.ст.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cholesterolRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Соотношение холестерина (общий/ЛПВП)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="12"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>От 1.0 до 12.0</FormDescription>
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
                        min="15"
                        max="50"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>От 15.0 до 50.0 кг/м²</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="familyHistory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Семейная история сердечно-сосудистых заболеваний
                      </FormLabel>
                      <FormDescription>
                        Инфаркт или инсульт у родственников первой линии до 60 лет
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chronicKidneyDisease"
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
                name="atrialFibrillation"
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
                name="bloodPressureTreatment"
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
                name="rheumatoidArthritis"
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
                name="migraine"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Мигрень</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительные заметки (необязательно)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Любые дополнительные медицинские состояния или заметки..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Расчет риска...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Рассчитать риск
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentForm;
