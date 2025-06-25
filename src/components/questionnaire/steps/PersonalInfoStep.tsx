
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalData } from '../../../types/health';

interface PersonalInfoStepProps {
  data?: PersonalData;
  onComplete: (data: PersonalData) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<PersonalData>({
    fullName: '',
    dateOfBirth: null,
    age: 0,
    height: 0,
    weight: 0,
    maritalStatus: 'single',
    occupation: '',
    location: {
      country: 'Россия',
      city: ''
    },
    ...data
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setFormData(prev => ({ ...prev, age: age - 1 }));
      } else {
        setFormData(prev => ({ ...prev, age }));
      }
    }
  }, [formData.dateOfBirth]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Введите полное имя';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Выберите дату рождения';
    } else {
      const age = formData.age;
      if (age < 18 || age > 100) {
        newErrors.dateOfBirth = 'Возраст должен быть от 18 до 100 лет';
      }
    }

    if (formData.height < 140 || formData.height > 220) {
      newErrors.height = 'Рост должен быть от 140 до 220 см';
    }

    if (formData.weight < 30 || formData.weight > 200) {
      newErrors.weight = 'Вес должен быть от 30 до 200 кг';
    }

    if (!formData.location.city.trim()) {
      newErrors.city = 'Введите город';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const getBMI = () => {
    if (formData.height && formData.weight) {
      const heightInM = formData.height / 100;
      return (formData.weight / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Недостаточный вес', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Нормальный вес', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Избыточный вес', color: 'text-yellow-600' };
    return { category: 'Ожирение', color: 'text-red-600' };
  };

  const bmi = getBMI();
  const bmiData = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Полное имя *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Анна Ивановна Петрова"
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Дата рождения *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                dateOfBirth: e.target.value ? new Date(e.target.value) : null 
              }))}
              max={new Date().toISOString().split('T')[0]}
              className={errors.dateOfBirth ? 'border-red-500' : ''}
            />
            {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
            {formData.age > 0 && (
              <p className="text-sm text-gray-600">Возраст: {formData.age} лет</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Рост (см) *</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                placeholder="165"
                min="140"
                max="220"
                className={errors.height ? 'border-red-500' : ''}
              />
              {errors.height && <p className="text-sm text-red-600">{errors.height}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Вес (кг) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                placeholder="65"
                min="30"
                max="200"
                className={errors.weight ? 'border-red-500' : ''}
              />
              {errors.weight && <p className="text-sm text-red-600">{errors.weight}</p>}
            </div>
          </div>

          {bmi && bmiData && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">ИМТ: {bmi}</div>
                  <div className={`text-sm ${bmiData.color}`}>{bmiData.category}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Семейное положение</Label>
            <Select 
              value={formData.maritalStatus} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, maritalStatus: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Не замужем</SelectItem>
                <SelectItem value="married">Замужем</SelectItem>
                <SelectItem value="partnered">В отношениях</SelectItem>
                <SelectItem value="divorced">Разведена</SelectItem>
                <SelectItem value="widowed">Вдова</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Профессия</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
              placeholder="Маркетолог, врач, учитель..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Страна</Label>
            <Select 
              value={formData.location.country} 
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                location: { ...prev.location, country: value } 
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Россия">Россия</SelectItem>
                <SelectItem value="Украина">Украина</SelectItem>
                <SelectItem value="Беларусь">Беларусь</SelectItem>
                <SelectItem value="Казахстан">Казахстан</SelectItem>
                <SelectItem value="Другая">Другая</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Город *</Label>
            <Input
              id="city"
              value={formData.location.city}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                location: { ...prev.location, city: e.target.value } 
              }))}
              placeholder="Москва, Санкт-Петербург, Киев..."
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
