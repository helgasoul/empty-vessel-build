
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BMIDisplay } from "@/components/ui/bmi-display";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DemPortFormData } from "./types";

interface DemPortPersonalInfoProps {
  form: UseFormReturn<DemPortFormData>;
}

const DemPortPersonalInfo = ({ form }: DemPortPersonalInfoProps) => {
  const bmi = form.watch('bmi');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-purple-600" />
          <span>Личная информация</span>
        </CardTitle>
        <CardDescription>
          Базовые демографические данные для оценки риска
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Возраст (лет)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="65"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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
            control={form.control}
            name="education_years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Годы образования</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="12"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apoe4_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус APOE4</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="unknown">Неизвестно</SelectItem>
                    <SelectItem value="none">Нет копий</SelectItem>
                    <SelectItem value="one_copy">Одна копия</SelectItem>
                    <SelectItem value="two_copies">Две копии</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bmi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ИМТ (кг/м²) - опционально</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="25.0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Отображение ИМТ если он введен */}
          {bmi && (
            <div className="flex items-end">
              <BMIDisplay 
                weight={bmi * 1.7 * 1.7} // Примерный вес для отображения категории
                height={170} // Примерный рост
                className="w-full"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemPortPersonalInfo;
