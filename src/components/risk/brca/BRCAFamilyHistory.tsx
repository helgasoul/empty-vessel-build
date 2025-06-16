
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from 'react-hook-form';
import { BRCAFormData } from './types';

interface BRCAFamilyHistoryProps {
  control: Control<BRCAFormData>;
}

const BRCAFamilyHistory: React.FC<BRCAFamilyHistoryProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Семейная история</h4>
      
      <FormField
        control={control}
        name="family_history_breast"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Рак молочной железы в семье</FormLabel>
              <p className="text-sm text-gray-600">
                Близкие родственники (мать, сестра, дочь) с раком молочной железы
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="family_history_ovarian"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Рак яичников в семье</FormLabel>
              <p className="text-sm text-gray-600">
                Близкие родственники с раком яичников
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="ashkenazi_ancestry"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Ашкеназское еврейское происхождение</FormLabel>
              <p className="text-sm text-gray-600">
                Повышенная частота мутаций BRCA в этой популяции
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default BRCAFamilyHistory;
