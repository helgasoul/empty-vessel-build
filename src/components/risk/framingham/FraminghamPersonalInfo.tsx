
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FraminghamAlzheimerFormData } from './types';

interface FraminghamPersonalInfoProps {
  control: Control<FraminghamAlzheimerFormData>;
}

const FraminghamPersonalInfo: React.FC<FraminghamPersonalInfoProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Персональная информация</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Возраст</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Введите возраст"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Возраст от 40 до 95 лет
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пол</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите пол" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="female">Женский</SelectItem>
                  <SelectItem value="male">Мужской</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="education_years"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Годы образования</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Количество лет"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Общее количество лет формального образования
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bmi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ИМТ (опционально)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1"
                  placeholder="Индекс массы тела"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormDescription>
                Индекс массы тела (кг/м²)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FraminghamPersonalInfo;
