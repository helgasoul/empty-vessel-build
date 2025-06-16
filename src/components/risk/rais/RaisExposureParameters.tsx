
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { RaisRiskFormData } from './types';

interface RaisExposureParametersProps {
  form: UseFormReturn<RaisRiskFormData>;
}

const RaisExposureParameters: React.FC<RaisExposureParametersProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-orange-600" />
          <span>Параметры экспозиции</span>
        </CardTitle>
        <CardDescription>
          Характеристики воздействия химических веществ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="exposure_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Продолжительность воздействия (лет)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="30"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exposure_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Частота воздействия (дней в году)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="250"
                    min="1"
                    max="365"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exposure_time_per_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Время воздействия в день (часов)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="8"
                    min="0"
                    max="24"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chemical_substance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Химическое вещество</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вещество" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="benzene">Бензол</SelectItem>
                    <SelectItem value="toluene">Толуол</SelectItem>
                    <SelectItem value="formaldehyde">Формальдегид</SelectItem>
                    <SelectItem value="mercury">Ртуть</SelectItem>
                    <SelectItem value="lead">Свинец</SelectItem>
                    <SelectItem value="cadmium">Кадмий</SelectItem>
                    <SelectItem value="chromium_vi">Хром VI</SelectItem>
                    <SelectItem value="arsenic">Мышьяк</SelectItem>
                    <SelectItem value="vinyl_chloride">Винилхлорид</SelectItem>
                    <SelectItem value="dichloromethane">Дихлорметан</SelectItem>
                    <SelectItem value="tetrachloroethylene">Тетрахлорэтилен</SelectItem>
                    <SelectItem value="trichloroethylene">Трихлорэтилен</SelectItem>
                    <SelectItem value="pcb">ПХБ (PCB)</SelectItem>
                    <SelectItem value="dioxin">Диоксин</SelectItem>
                    <SelectItem value="pah">ПАУ (PAH)</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch('chemical_substance') === 'other' && (
          <FormField
            control={form.control}
            name="other_chemical_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название другого химического вещества</FormLabel>
                <FormControl>
                  <Input placeholder="Укажите название вещества" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RaisExposureParameters;
