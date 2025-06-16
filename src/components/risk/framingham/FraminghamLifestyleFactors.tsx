
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FraminghamAlzheimerFormData } from './types';

interface FraminghamLifestyleFactorsProps {
  control: Control<FraminghamAlzheimerFormData>;
}

const FraminghamLifestyleFactors: React.FC<FraminghamLifestyleFactorsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Образ жизни</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
                  <SelectItem value="former">Бывший курильщик</SelectItem>
                  <SelectItem value="current">Курю в настоящее время</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
              <FormDescription>
                Физическая активность умеренной интенсивности в неделю
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
                  <SelectItem value="light">Легкое (1-7 единиц/неделя)</SelectItem>
                  <SelectItem value="moderate">Умеренное (8-14 единиц/неделя)</SelectItem>
                  <SelectItem value="heavy">Высокое (более 14 единиц/неделя)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Одна единица = 10 мл чистого алкоголя
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="social_isolation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Социальная изоляция
              </FormLabel>
              <FormDescription>
                Ограниченные социальные контакты, одиночество
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default FraminghamLifestyleFactors;
