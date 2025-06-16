
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CancerRiskFormData } from "./types";

interface CancerLifestyleFactorsProps {
  form: UseFormReturn<CancerRiskFormData>;
}

const CancerLifestyleFactors = ({ form }: CancerLifestyleFactorsProps) => {
  const smokingStatus = form.watch("smoking_status");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-600" />
          <span>Образ жизни</span>
        </CardTitle>
        <CardDescription>
          Факторы образа жизни, влияющие на риск развития рака
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="smoking_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус курения</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="never">Никогда не курил(а)</SelectItem>
                    <SelectItem value="former">Бросил(а) курить</SelectItem>
                    <SelectItem value="current">Курю в настоящее время</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {(smokingStatus === 'current' || smokingStatus === 'former') && (
            <>
              <FormField
                control={form.control}
                name="smoking_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стаж курения (лет)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={80}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cigarettes_per_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сигарет в день</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="alcohol_consumption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Употребление алкоголя</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Не употребляю</SelectItem>
                    <SelectItem value="light">Умеренно (1-2 порции в неделю)</SelectItem>
                    <SelectItem value="moderate">Средне (3-7 порций в неделю)</SelectItem>
                    <SelectItem value="heavy">Часто (более 7 порций в неделю)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="physical_activity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Физическая активность</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Низкая (менее 150 мин/неделю)</SelectItem>
                    <SelectItem value="moderate">Умеренная (150-300 мин/неделю)</SelectItem>
                    <SelectItem value="high">Высокая (более 300 мин/неделю)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sun_exposure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Воздействие солнца</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Низкое (избегаю солнца)</SelectItem>
                    <SelectItem value="moderate">Умеренное (с защитой)</SelectItem>
                    <SelectItem value="high">Высокое (частое пребывание на солнце)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skin_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип кожи</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип кожи" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="very_fair">Очень светлая (всегда обгорает)</SelectItem>
                    <SelectItem value="fair">Светлая (часто обгорает)</SelectItem>
                    <SelectItem value="medium">Средняя</SelectItem>
                    <SelectItem value="olive">Оливковая</SelectItem>
                    <SelectItem value="brown">Коричневая</SelectItem>
                    <SelectItem value="black">Черная</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Важно:</strong> Курение является основным фактором риска для рака легких, 
            мочевого пузыря, почек и многих других органов. Отказ от курения в любом возрасте 
            значительно снижает риск развития рака.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CancerLifestyleFactors;
