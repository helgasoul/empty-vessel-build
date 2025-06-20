
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, X, Save } from "lucide-react";

interface MedicalInfoTabProps {
  member: any;
  onUpdate: (updates: any) => Promise<void>;
  saving: boolean;
}

const MedicalInfoTab: React.FC<MedicalInfoTabProps> = ({ member, onUpdate, saving }) => {
  const [formData, setFormData] = useState({
    chronic_conditions: member.chronic_conditions || [],
    allergies: member.allergies || [],
    medications: member.medications || [],
    vaccinations: member.vaccinations || [],
    genetic_predispositions: member.genetic_predispositions || [],
    family_history_notes: member.family_history_notes || '',
    last_medical_checkup: member.last_medical_checkup || '',
    preferred_doctor: member.preferred_doctor || '',
    insurance_info: member.insurance_info || '',
    lifestyle_factors: member.lifestyle_factors || {}
  });

  const [newItems, setNewItems] = useState({
    chronic_condition: '',
    allergy: '',
    medication: '',
    vaccination: '',
    genetic_predisposition: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleLifestyleChange = (factor: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      lifestyle_factors: {
        ...prev.lifestyle_factors,
        [factor]: value
      }
    }));
    setHasChanges(true);
  };

  const addItem = (type: string) => {
    const newItem = newItems[type as keyof typeof newItems];
    if (newItem.trim()) {
      const currentItems = formData[type as keyof typeof formData] as any[];
      setFormData(prev => ({
        ...prev,
        [type]: [...currentItems, newItem.trim()]
      }));
      setNewItems(prev => ({ ...prev, [type]: '' }));
      setHasChanges(true);
    }
  };

  const removeItem = (type: string, index: number) => {
    const currentItems = formData[type as keyof typeof formData] as any[];
    setFormData(prev => ({
      ...prev,
      [type]: currentItems.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onUpdate(formData);
    setHasChanges(false);
  };

  const renderItemsList = (type: string, title: string, placeholder: string) => {
    const items = formData[type as keyof typeof formData] as string[];
    const newItemValue = newItems[type as keyof typeof newItems];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newItemValue}
              onChange={(e) => setNewItems(prev => ({ ...prev, [type]: e.target.value }))}
              placeholder={placeholder}
              onKeyPress={(e) => e.key === 'Enter' && addItem(type)}
            />
            <Button onClick={() => addItem(type)} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{item}</span>
                <button
                  onClick={() => removeItem(type, index)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span>Медицинская информация</span>
          </CardTitle>
          <CardDescription>
            Подробные медицинские данные и история болезней
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_medical_checkup">Последний осмотр</Label>
              <Input
                id="last_medical_checkup"
                type="date"
                value={formData.last_medical_checkup}
                onChange={(e) => handleInputChange('last_medical_checkup', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_doctor">Лечащий врач</Label>
              <Input
                id="preferred_doctor"
                value={formData.preferred_doctor}
                onChange={(e) => handleInputChange('preferred_doctor', e.target.value)}
                placeholder="ФИО врача, специализация"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance_info">Страховая информация</Label>
            <Input
              id="insurance_info"
              value={formData.insurance_info}
              onChange={(e) => handleInputChange('insurance_info', e.target.value)}
              placeholder="Номер полиса, страховая компания"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="family_history_notes">Семейная медицинская история</Label>
            <Textarea
              id="family_history_notes"
              value={formData.family_history_notes}
              onChange={(e) => handleInputChange('family_history_notes', e.target.value)}
              placeholder="Наследственные заболевания, особенности семейной истории..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Образ жизни</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smoking">Курение</Label>
              <select
                className="w-full p-2 border rounded"
                value={formData.lifestyle_factors.smoking || ''}
                onChange={(e) => handleLifestyleChange('smoking', e.target.value)}
              >
                <option value="">Не указано</option>
                <option value="never">Никогда не курил</option>
                <option value="former">Бросил курить</option>
                <option value="current_light">Курю изредка</option>
                <option value="current_moderate">Курю умеренно</option>
                <option value="current_heavy">Курю много</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alcohol">Алкоголь</Label>
              <select
                className="w-full p-2 border rounded"
                value={formData.lifestyle_factors.alcohol || ''}
                onChange={(e) => handleLifestyleChange('alcohol', e.target.value)}
              >
                <option value="">Не указано</option>
                <option value="never">Не употребляю</option>
                <option value="rarely">Редко</option>
                <option value="occasionally">Иногда</option>
                <option value="regularly">Регулярно</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise">Физическая активность</Label>
              <select
                className="w-full p-2 border rounded"
                value={formData.lifestyle_factors.exercise || ''}
                onChange={(e) => handleLifestyleChange('exercise', e.target.value)}
              >
                <option value="">Не указано</option>
                <option value="sedentary">Малоподвижный</option>
                <option value="light">Легкая активность</option>
                <option value="moderate">Умеренная активность</option>
                <option value="high">Высокая активность</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diet">Тип питания</Label>
              <select
                className="w-full p-2 border rounded"
                value={formData.lifestyle_factors.diet || ''}
                onChange={(e) => handleLifestyleChange('diet', e.target.value)}
              >
                <option value="">Не указано</option>
                <option value="omnivore">Всеядный</option>
                <option value="vegetarian">Вегетарианец</option>
                <option value="vegan">Веган</option>
                <option value="pescatarian">Пескетарианец</option>
                <option value="keto">Кето</option>
                <option value="mediterranean">Средиземноморская</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {renderItemsList('chronic_conditions', 'Хронические заболевания', 'Добавить заболевание...')}
      {renderItemsList('allergies', 'Аллергии', 'Добавить аллергию...')}
      {renderItemsList('medications', 'Принимаемые препараты', 'Добавить препарат...')}
      {renderItemsList('vaccinations', 'Прививки', 'Добавить прививку...')}
      {renderItemsList('genetic_predispositions', 'Генетические предрасположенности', 'Добавить предрасположенность...')}

      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Сохраняется...' : 'Сохранить изменения'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MedicalInfoTab;
