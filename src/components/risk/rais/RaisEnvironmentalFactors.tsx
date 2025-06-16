
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Home, Briefcase } from "lucide-react";
import { RaisRiskFormData } from './types';

interface RaisEnvironmentalFactorsProps {
  form: UseFormReturn<RaisRiskFormData>;
}

const RaisEnvironmentalFactors: React.FC<RaisEnvironmentalFactorsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-blue-600" />
            <span>Факторы окружающей среды</span>
          </CardTitle>
          <CardDescription>
            Условия окружающей среды, влияющие на воздействие
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="air_temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Температура воздуха (°C)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="20"
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
              name="humidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Влажность (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50"
                      min="0"
                      max="100"
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
              name="soil_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип почвы</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип почвы" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clay">Глинистая</SelectItem>
                      <SelectItem value="sand">Песчаная</SelectItem>
                      <SelectItem value="loam">Суглинок</SelectItem>
                      <SelectItem value="organic">Органическая</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diet_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип питания</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип питания" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Стандартное</SelectItem>
                      <SelectItem value="vegetarian">Вегетарианское</SelectItem>
                      <SelectItem value="high_fish">С высоким содержанием рыбы</SelectItem>
                      <SelectItem value="organic">Органическое</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span>Профессиональные факторы</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="work_environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Рабочая среда</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите рабочую среду" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="office">Офис</SelectItem>
                      <SelectItem value="industrial">Промышленность</SelectItem>
                      <SelectItem value="laboratory">Лаборатория</SelectItem>
                      <SelectItem value="outdoor">На открытом воздухе</SelectItem>
                      <SelectItem value="healthcare">Здравоохранение</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ventilation_quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Качество вентиляции</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите качество" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="poor">Плохое</SelectItem>
                      <SelectItem value="adequate">Удовлетворительное</SelectItem>
                      <SelectItem value="good">Хорошее</SelectItem>
                      <SelectItem value="excellent">Отличное</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="protective_equipment_use"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Использование средств защиты</FormLabel>
                  <FormDescription>
                    Регулярное использование СИЗ на рабочем месте
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-green-600" />
            <span>Жилищные условия</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="housing_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип жилья</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип жилья" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="apartment">Квартира</SelectItem>
                      <SelectItem value="house">Дом</SelectItem>
                      <SelectItem value="mobile_home">Мобильный дом</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="housing_age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Возраст жилья (лет)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="20"
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
              name="proximity_to_industrial_sites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Близость к промышленным объектам</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите близость" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="very_close">Очень близко (&lt;0.5 км)</SelectItem>
                      <SelectItem value="close">Близко (0.5-2 км)</SelectItem>
                      <SelectItem value="moderate">Умеренно (2-5 км)</SelectItem>
                      <SelectItem value="far">Далеко (&gt;5 км)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="water_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Источник воды</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите источник" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="municipal">Муниципальный</SelectItem>
                      <SelectItem value="well">Скважина</SelectItem>
                      <SelectItem value="bottled">Бутилированная</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RaisEnvironmentalFactors;
