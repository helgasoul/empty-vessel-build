
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FraminghamAlzheimerFormData } from './types';

interface FraminghamGeneticFactorsProps {
  control: Control<FraminghamAlzheimerFormData>;
}

const FraminghamGeneticFactors: React.FC<FraminghamGeneticFactorsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Генетические факторы</h3>
      <p className="text-sm text-gray-600">
        Генетические факторы играют важную роль в развитии болезни Альцгеймера
      </p>
      
      <FormField
        control={control}
        name="apoe4_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Статус APOE4</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус APOE4" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="unknown">Неизвестно</SelectItem>
                <SelectItem value="negative">Отрицательный (нет копий APOE4)</SelectItem>
                <SelectItem value="heterozygous">Гетерозиготный (одна копия APOE4)</SelectItem>
                <SelectItem value="homozygous">Гомозиготный (две копии APOE4)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              APOE4 является основным генетическим фактором риска болезни Альцгеймера. 
              Наличие одной копии увеличивает риск в 3-4 раза, двух копий - в 8-12 раз.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="family_history_dementia"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Семейная история деменции
              </FormLabel>
              <FormDescription>
                Наличие деменции у родителей, братьев или сестер
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

export default FraminghamGeneticFactors;
