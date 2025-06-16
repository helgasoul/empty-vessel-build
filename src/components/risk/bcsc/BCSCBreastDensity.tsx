
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BCSCFormData } from './types';

interface BCSCBreastDensityProps {
  control: Control<BCSCFormData>;
}

const BCSCBreastDensity: React.FC<BCSCBreastDensityProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Плотность молочной железы</h3>
      <p className="text-sm text-gray-600">
        Плотность молочной железы определяется по результатам маммографии (BI-RADS)
      </p>
      
      <FormField
        control={control}
        name="breast_density"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Плотность по BI-RADS</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите плотность" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="almost_entirely_fatty">
                  A - Почти полностью жировая ткань
                </SelectItem>
                <SelectItem value="scattered_fibroglandular">
                  B - Рассеянные участки фиброгландулярной ткани
                </SelectItem>
                <SelectItem value="heterogeneously_dense">
                  C - Неоднородно плотная ткань
                </SelectItem>
                <SelectItem value="extremely_dense">
                  D - Крайне плотная ткань
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Высокая плотность (C и D) увеличивает риск рака молочной железы и может затруднять обнаружение опухолей на маммографии
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BCSCBreastDensity;
