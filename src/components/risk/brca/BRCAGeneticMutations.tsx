
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from 'react-hook-form';
import { BRCAFormData } from './types';

interface BRCAGeneticMutationsProps {
  control: Control<BRCAFormData>;
}

const BRCAGeneticMutations: React.FC<BRCAGeneticMutationsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Генетические мутации</h4>
      
      <FormField
        control={control}
        name="brca1_mutation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Мутация гена BRCA1</FormLabel>
              <p className="text-sm text-gray-600">
                Подтвержденная патогенная мутация в гене BRCA1
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="brca2_mutation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Мутация гена BRCA2</FormLabel>
              <p className="text-sm text-gray-600">
                Подтвержденная патогенная мутация в гене BRCA2
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default BRCAGeneticMutations;
