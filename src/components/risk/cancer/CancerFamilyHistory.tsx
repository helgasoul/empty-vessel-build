
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CancerRiskFormData } from "./types";

interface CancerFamilyHistoryProps {
  form: UseFormReturn<CancerRiskFormData>;
}

const CancerFamilyHistory = ({ form }: CancerFamilyHistoryProps) => {
  const familyCancerHistory = form.watch("family_cancer_history");
  const familyCancerTypes = form.watch("family_cancer_types") || [];

  const cancerTypeOptions = [
    { value: 'breast', label: 'Рак молочной железы' },
    { value: 'lung', label: 'Рак легких' },
    { value: 'colorectal', label: 'Колоректальный рак' },
    { value: 'prostate', label: 'Рак простаты' },
    { value: 'ovarian', label: 'Рак яичников' },
    { value: 'melanoma', label: 'Меланома' },
    { value: 'pancreatic', label: 'Рак поджелудочной железы' },
    { value: 'stomach', label: 'Рак желудка' },
    { value: 'kidney', label: 'Рак почки' },
    { value: 'bladder', label: 'Рак мочевого пузыря' },
    { value: 'cervical', label: 'Рак шейки матки' },
    { value: 'endometrial', label: 'Рак эндометрия' },
  ];

  const handleCancerTypeChange = (cancerType: string, checked: boolean) => {
    const currentTypes = familyCancerTypes || [];
    if (checked) {
      form.setValue("family_cancer_types", [...currentTypes, cancerType]);
    } else {
      form.setValue("family_cancer_types", currentTypes.filter(type => type !== cancerType));
    }
  };

  const removeCancerType = (cancerType: string) => {
    const currentTypes = familyCancerTypes || [];
    form.setValue("family_cancer_types", currentTypes.filter(type => type !== cancerType));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span>Семейная история и медицинские факторы</span>
        </CardTitle>
        <CardDescription>
          Информация о заболеваниях у родственников и личной медицинской истории
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="family_cancer_history"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>У моих близких родственников был диагностирован рак</FormLabel>
                  <p className="text-sm text-gray-600">
                    Родители, братья, сестры, дети
                  </p>
                </div>
              </FormItem>
            )}
          />

          {familyCancerHistory && (
            <div className="ml-6 space-y-4">
              <FormField
                control={form.control}
                name="family_cancer_degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Степень родства</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите степень родства" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="first">Первая линия (родители, дети, братья/сестры)</SelectItem>
                        <SelectItem value="second">Вторая линия (дедушки/бабушки, тети/дяди)</SelectItem>
                        <SelectItem value="both">Обе линии</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-sm font-medium mb-3 block">Типы рака у родственников</FormLabel>
                
                {familyCancerTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {familyCancerTypes.map((type) => {
                      const typeLabel = cancerTypeOptions.find(option => option.value === type)?.label || type;
                      return (
                        <Badge key={type} variant="secondary" className="flex items-center gap-1">
                          {typeLabel}
                          <button
                            type="button"
                            onClick={() => removeCancerType(type)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cancerTypeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`family-cancer-${option.value}`}
                        checked={familyCancerTypes.includes(option.value)}
                        onCheckedChange={(checked) => handleCancerTypeChange(option.value, checked as boolean)}
                      />
                      <label
                        htmlFor={`family-cancer-${option.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Личная медицинская история</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="previous_cancer_history"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Ранее диагностированный рак</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diabetes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Сахарный диабет</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inflammatory_bowel_disease"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Воспалительные заболевания кишечника</FormLabel>
                      <p className="text-xs text-gray-500">Болезнь Крона, язвенный колит</p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupational_exposure"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Профессиональное воздействие канцерогенов</FormLabel>
                      <p className="text-xs text-gray-500">Асбест, радиация, химикаты</p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Важно:</strong> Семейная история рака увеличивает ваш риск, но не означает, 
            что у вас обязательно разовьется заболевание. Регулярный скрининг и здоровый образ 
            жизни могут значительно снизить риски.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CancerFamilyHistory;
