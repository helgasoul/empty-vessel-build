
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DemPortFormData } from "./types";

interface DemPortFamilyHistoryProps {
  form: UseFormReturn<DemPortFormData>;
}

const DemPortFamilyHistory = ({ form }: DemPortFamilyHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Семейная история</span>
        </CardTitle>
        <CardDescription>
          Информация о заболеваниях у близких родственников
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="family_dementia_history"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Деменция или болезнь Альцгеймера у родственников первой линии</FormLabel>
                  <p className="text-sm text-gray-600">
                    Родители, братья, сестры
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="family_cardiovascular_history"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Сердечно-сосудистые заболевания у родственников</FormLabel>
                  <p className="text-sm text-gray-600">
                    Инфаркт, инсульт, ишемическая болезнь сердца у родителей, братьев, сестер до 65 лет
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Важно:</strong> Семейная история является важным фактором риска. 
            Если у ваших близких родственников была деменция, особенно важно следовать 
            рекомендациям по профилактике.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemPortFamilyHistory;
