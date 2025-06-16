
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DemPortFormData } from "./types";

interface DemPortLifestyleFactorsProps {
  form: UseFormReturn<DemPortFormData>;
}

const DemPortLifestyleFactors = ({ form }: DemPortLifestyleFactorsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-600" />
          <span>Образ жизни</span>
        </CardTitle>
        <CardDescription>
          Факторы образа жизни, влияющие на риск деменции
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <SelectItem value="low">Низкая (менее 150 мин/неделя)</SelectItem>
                    <SelectItem value="moderate">Умеренная (150-300 мин/неделя)</SelectItem>
                    <SelectItem value="high">Высокая (более 300 мин/неделя)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alcohol_consumption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Потребление алкоголя</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Не употребляю</SelectItem>
                    <SelectItem value="light">Легкое (1-7 порций/неделя)</SelectItem>
                    <SelectItem value="moderate">Умеренное (8-14 порций/неделя)</SelectItem>
                    <SelectItem value="heavy">Злоупотребление (более 14 порций/неделя)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cognitive_activities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Когнитивная активность</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Низкая (редко читаю, решаю головоломки)</SelectItem>
                    <SelectItem value="moderate">Умеренная (иногда читаю, учусь)</SelectItem>
                    <SelectItem value="high">Высокая (регулярно читаю, изучаю новое)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="social_engagement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Социальная активность</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Низкая (редко общаюсь)</SelectItem>
                    <SelectItem value="moderate">Умеренная (регулярно общаюсь)</SelectItem>
                    <SelectItem value="high">Высокая (активная социальная жизнь)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sleep_quality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Качество сна</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите качество" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="poor">Плохое (частые проблемы со сном)</SelectItem>
                    <SelectItem value="fair">Удовлетворительное</SelectItem>
                    <SelectItem value="good">Хорошее (7-9 часов качественного сна)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stress_levels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Уровень стресса</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="moderate">Умеренный</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="depression_history"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>История депрессии</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="head_injury_history"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Черепно-мозговые травмы в анамнезе</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DemPortLifestyleFactors;
