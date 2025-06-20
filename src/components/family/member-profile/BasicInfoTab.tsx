
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save } from "lucide-react";

interface BasicInfoTabProps {
  member: any;
  onUpdate: (updates: any) => Promise<void>;
  saving: boolean;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ member, onUpdate, saving }) => {
  const [formData, setFormData] = useState({
    name: member.name || '',
    relationship: member.relationship || '',
    gender: member.gender || '',
    date_of_birth: member.date_of_birth || '',
    place_of_birth: member.place_of_birth || '',
    occupation: member.occupation || '',
    education_level: member.education_level || '',
    marital_status: member.marital_status || '',
    blood_type: member.blood_type || '',
    height_cm: member.height_cm || '',
    weight_kg: member.weight_kg || '',
    emergency_contact_name: member.emergency_contact_name || '',
    emergency_contact_phone: member.emergency_contact_phone || '',
    notes: member.notes || ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const updates = { ...formData };
    // Преобразуем числовые поля
    if (updates.height_cm) updates.height_cm = parseInt(updates.height_cm);
    if (updates.weight_kg) updates.weight_kg = parseFloat(updates.weight_kg);
    
    await onUpdate(updates);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-purple-600" />
            <span>Личная информация</span>
          </CardTitle>
          <CardDescription>
            Основные данные о члене семьи
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Полное имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Иван Иванович Иванов"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Родственная связь</Label>
              <Select value={formData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите связь" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="отец">Отец</SelectItem>
                  <SelectItem value="мать">Мать</SelectItem>
                  <SelectItem value="сын">Сын</SelectItem>
                  <SelectItem value="дочь">Дочь</SelectItem>
                  <SelectItem value="брат">Брат</SelectItem>
                  <SelectItem value="сестра">Сестра</SelectItem>
                  <SelectItem value="дедушка">Дедушка</SelectItem>
                  <SelectItem value="бабушка">Бабушка</SelectItem>
                  <SelectItem value="внук">Внук</SelectItem>
                  <SelectItem value="внучка">Внучка</SelectItem>
                  <SelectItem value="дядя">Дядя</SelectItem>
                  <SelectItem value="тетя">Тетя</SelectItem>
                  <SelectItem value="племянник">Племянник</SelectItem>
                  <SelectItem value="племянница">Племянница</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Пол</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пол" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Дата рождения</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place_of_birth">Место рождения</Label>
              <Input
                id="place_of_birth"
                value={formData.place_of_birth}
                onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                placeholder="Москва, Россия"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Профессия</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                placeholder="Врач, Учитель, Инженер..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education_level">Образование</Label>
              <Select value={formData.education_level} onValueChange={(value) => handleInputChange('education_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Уровень образования" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="начальное">Начальное</SelectItem>
                  <SelectItem value="среднее">Среднее</SelectItem>
                  <SelectItem value="среднее_специальное">Среднее специальное</SelectItem>
                  <SelectItem value="высшее">Высшее</SelectItem>
                  <SelectItem value="кандидат_наук">Кандидат наук</SelectItem>
                  <SelectItem value="доктор_наук">Доктор наук</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marital_status">Семейное положение</Label>
              <Select value={formData.marital_status} onValueChange={(value) => handleInputChange('marital_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Семейное положение" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="холост/не замужем">Холост/Не замужем</SelectItem>
                  <SelectItem value="женат/замужем">Женат/Замужем</SelectItem>
                  <SelectItem value="разведен/разведена">Разведен/Разведена</SelectItem>
                  <SelectItem value="вдовец/вдова">Вдовец/Вдова</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Общие заметки</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Дополнительная информация о члене семьи..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Физические данные</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blood_type">Группа крови</Label>
              <Select value={formData.blood_type} onValueChange={(value) => handleInputChange('blood_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Группа крови" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="O+">O+ (I положительная)</SelectItem>
                  <SelectItem value="O-">O- (I отрицательная)</SelectItem>
                  <SelectItem value="A+">A+ (II положительная)</SelectItem>
                  <SelectItem value="A-">A- (II отрицательная)</SelectItem>
                  <SelectItem value="B+">B+ (III положительная)</SelectItem>
                  <SelectItem value="B-">B- (III отрицательная)</SelectItem>
                  <SelectItem value="AB+">AB+ (IV положительная)</SelectItem>
                  <SelectItem value="AB-">AB- (IV отрицательная)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height_cm">Рост (см)</Label>
              <Input
                id="height_cm"
                type="number"
                value={formData.height_cm}
                onChange={(e) => handleInputChange('height_cm', e.target.value)}
                placeholder="175"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_kg">Вес (кг)</Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.1"
                value={formData.weight_kg}
                onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                placeholder="70.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Экстренные контакты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Контактное лицо</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                placeholder="ФИО контактного лица"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">Телефон</Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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

export default BasicInfoTab;
