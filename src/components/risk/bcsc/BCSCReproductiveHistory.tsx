
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BCSCFormData } from './types';

interface BCSCReproductiveHistoryProps {
  control: Control<BCSCFormData>;
}

const BCSCReproductiveHistory: React.FC<BCSCReproductiveHistoryProps> = ({ control }) => {
  const nulliparous = useWatch({
    control,
    name: 'nulliparous',
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Репродуктивный анамнез</h3>
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="nulliparous"
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
                  Нет детей (нерожавшая)
                </FormLabel>
                <FormDescription>
                  Отметьте, если у вас никогда не было детей
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {!nulliparous && (
          <FormField
            control={control}
            name="age_at_first_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Возраст при первых родах</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={12}
                    max={60}
                    placeholder="Введите возраст"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>
                  Возраст при рождении первого ребенка
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default BCSCReproductiveHistory;
