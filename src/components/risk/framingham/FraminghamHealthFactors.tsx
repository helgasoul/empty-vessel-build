
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FraminghamAlzheimerFormData } from './types';

interface FraminghamHealthFactorsProps {
  control: Control<FraminghamAlzheimerFormData>;
}

const FraminghamHealthFactors: React.FC<FraminghamHealthFactorsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Факторы здоровья</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="cardiovascular_disease"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Сердечно-сосудистые заболевания
                </FormLabel>
                <FormDescription>
                  История инфаркта, инсульта или других сердечно-сосудистых заболеваний
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

        <FormField
          control={control}
          name="diabetes"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Сахарный диабет
                </FormLabel>
                <FormDescription>
                  Диагностированный сахарный диабет 1 или 2 типа
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

        <FormField
          control={control}
          name="hypertension"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Артериальная гипертензия
                </FormLabel>
                <FormDescription>
                  Повышенное артериальное давление (более 140/90 мм рт.ст.)
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

        <FormField
          control={control}
          name="depression_history"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  История депрессии
                </FormLabel>
                <FormDescription>
                  Диагностированная депрессия или прием антидепрессантов
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

        <FormField
          control={control}
          name="head_injury_history"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Черепно-мозговые травмы
                </FormLabel>
                <FormDescription>
                  История серьезных травм головы с потерей сознания
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

        <FormField
          control={control}
          name="cognitive_complaints"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Жалобы на память
                </FormLabel>
                <FormDescription>
                  Субъективные жалобы на ухудшение памяти или когнитивных функций
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
    </div>
  );
};

export default FraminghamHealthFactors;
