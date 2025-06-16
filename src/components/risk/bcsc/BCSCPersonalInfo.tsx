
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BCSCFormData } from './types';

interface BCSCPersonalInfoProps {
  control: Control<BCSCFormData>;
}

const BCSCPersonalInfo: React.FC<BCSCPersonalInfoProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Личная информация</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Возраст (35-79 лет)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={35}
                  max={79}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="race_ethnicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Расовая/этническая принадлежность</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="white">Европеоидная</SelectItem>
                  <SelectItem value="african_american">Афроамериканская</SelectItem>
                  <SelectItem value="hispanic">Латиноамериканская</SelectItem>
                  <SelectItem value="asian">Азиатская</SelectItem>
                  <SelectItem value="native_american">Коренные американцы</SelectItem>
                  <SelectItem value="other">Другая</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BCSCPersonalInfo;
