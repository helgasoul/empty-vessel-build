
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BCSCFormData } from './types';

interface BCSCMedicalHistoryProps {
  control: Control<BCSCFormData>;
}

const BCSCMedicalHistory: React.FC<BCSCMedicalHistoryProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Медицинский анамнез</h3>
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="family_history_first_degree"
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
                  Семейная история рака молочной железы у родственников первой степени
                </FormLabel>
                <FormDescription>
                  Мать, сестра, дочь с диагнозом рака молочной железы
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="previous_breast_biopsy"
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
                  Биопсия молочной железы в анамнезе
                </FormLabel>
                <FormDescription>
                  Любая биопсия молочной железы независимо от результатов
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="biopsy_with_atypia"
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
                  Атипия при биопсии
                </FormLabel>
                <FormDescription>
                  Атипичная гиперплазия, лобулярная неоплазия или другие атипичные изменения
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="current_hormone_therapy"
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
                  Текущая гормональная терапия
                </FormLabel>
                <FormDescription>
                  Заместительная гормональная терапия в менопаузе
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BCSCMedicalHistory;
