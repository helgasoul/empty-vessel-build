
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { PersonalInfoData, OnboardingData } from '@/types/onboarding';

interface PersonalInfoStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (stepKey: keyof OnboardingData, data: any) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onUpdate }) => {
  const personalInfo = data.personalInfo || {} as PersonalInfoData;

  const updateField = (field: keyof PersonalInfoData, value: any) => {
    onUpdate('personalInfo', { ...personalInfo, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Имя *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName || ''}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="Анна"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Фамилия *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName || ''}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Иванова"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Дата рождения *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {personalInfo.dateOfBirth ? (
                  format(personalInfo.dateOfBirth, "dd MMMM yyyy", { locale: ru })
                ) : (
                  <span>Выберите дату</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={personalInfo.dateOfBirth || undefined}
                onSelect={(date) => updateField('dateOfBirth', date)}
                initialFocus
                locale={ru}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            value={personalInfo.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height">Рост (см) *</Label>
          <Input
            id="height"
            type="number"
            min="100"
            max="250"
            value={personalInfo.height || ''}
            onChange={(e) => updateField('height', e.target.value ? Number(e.target.value) : null)}
            placeholder="165"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Вес (кг) *</Label>
          <Input
            id="weight"
            type="number"
            min="30"
            max="300"
            step="0.1"
            value={personalInfo.weight || ''}
            onChange={(e) => updateField('weight', e.target.value ? Number(e.target.value) : null)}
            placeholder="65"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Семейное положение</Label>
          <Select value={personalInfo.maritalStatus || ''} onValueChange={(value) => updateField('maritalStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Не замужем</SelectItem>
              <SelectItem value="married">Замужем</SelectItem>
              <SelectItem value="divorced">В разводе</SelectItem>
              <SelectItem value="widowed">Вдова</SelectItem>
              <SelectItem value="partnered">В отношениях</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Страна</Label>
          <Input
            id="country"
            value={personalInfo.country || ''}
            onChange={(e) => updateField('country', e.target.value)}
            placeholder="Россия"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            value={personalInfo.city || ''}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="Москва"
          />
        </div>

        <div className="space-y-2">
          <Label>Часовой пояс</Label>
          <Select value={personalInfo.timezone || ''} onValueChange={(value) => updateField('timezone', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите часовой пояс" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Europe/Moscow">МСК (UTC+3)</SelectItem>
              <SelectItem value="Asia/Yekaterinburg">ЕКАТ (UTC+5)</SelectItem>
              <SelectItem value="Asia/Novosibirsk">НОВОСИБ (UTC+7)</SelectItem>
              <SelectItem value="Asia/Krasnoyarsk">КРАС (UTC+7)</SelectItem>
              <SelectItem value="Asia/Irkutsk">ИРКУТ (UTC+8)</SelectItem>
              <SelectItem value="Asia/Yakutsk">ЯКУТ (UTC+9)</SelectItem>
              <SelectItem value="Asia/Vladivostok">ВЛАД (UTC+10)</SelectItem>
              <SelectItem value="Asia/Magadan">МАГАД (UTC+11)</SelectItem>
              <SelectItem value="Asia/Kamchatka">КАМЧ (UTC+12)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Зачем нам эта информация?</h4>
        <p className="text-sm text-blue-800">
          Персональные данные помогают нам рассчитать более точные риски заболеваний 
          и создать индивидуальные рекомендации, учитывающие ваш возраст, физические 
          параметры и образ жизни.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
