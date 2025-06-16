
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind } from "lucide-react";
import { RaisRiskFormData } from './types';

interface RaisExposureRoutesProps {
  form: UseFormReturn<RaisRiskFormData>;
}

const RaisExposureRoutes: React.FC<RaisExposureRoutesProps> = ({ form }) => {
  const inhalationExposure = form.watch('inhalation_exposure');
  const dermalExposure = form.watch('dermal_exposure');
  const oralExposure = form.watch('oral_exposure');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-green-600" />
          <span>Пути воздействия</span>
        </CardTitle>
        <CardDescription>
          Способы попадания химических веществ в организм
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="inhalation_exposure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Ингаляционное воздействие</FormLabel>
                  <FormDescription>
                    Вдыхание загрязненного воздуха
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {inhalationExposure && (
            <FormField
              control={form.control}
              name="inhalation_concentration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Концентрация в воздухе (мг/м³)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="0.1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="dermal_exposure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Контактное воздействие</FormLabel>
                  <FormDescription>
                    Контакт с кожей
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {dermalExposure && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dermal_concentration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Концентрация на коже (мг/см²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="0.01"
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
                name="skin_surface_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Площадь контакта (см²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="oral_exposure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Пероральное воздействие</FormLabel>
                  <FormDescription>
                    Попадание через пищу и воду
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {oralExposure && (
            <FormField
              control={form.control}
              name="oral_dose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пероральная доза (мг/кг/день)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="0.001"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RaisExposureRoutes;
