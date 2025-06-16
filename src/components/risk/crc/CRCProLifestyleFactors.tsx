
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CRCProFormData } from './types';

interface CRCProLifestyleFactorsProps {
  data: CRCProFormData;
  updateData: (updates: Partial<CRCProFormData>) => void;
}

export const CRCProLifestyleFactors: React.FC<CRCProLifestyleFactorsProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Курение и алкоголь</h3>
        
        <div className="space-y-2">
          <Label>Статус курения</Label>
          <Select 
            value={data.smoking_status || ''} 
            onValueChange={(value: 'never' | 'former' | 'current') => updateData({ smoking_status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите статус курения" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Никогда не курил(а)</SelectItem>
              <SelectItem value="former">Бросил(а) курить</SelectItem>
              <SelectItem value="current">Курю в настоящее время</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Употребление алкоголя</Label>
          <Select 
            value={data.alcohol_consumption || ''} 
            onValueChange={(value: 'none' | 'light' | 'moderate' | 'heavy') => updateData({ alcohol_consumption: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень употребления алкоголя" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Не употребляю</SelectItem>
              <SelectItem value="light">Редко (менее 1 раза в неделю)</SelectItem>
              <SelectItem value="moderate">Умеренно (1-3 раза в неделю)</SelectItem>
              <SelectItem value="heavy">Часто (4+ раза в неделю)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Физическая активность</h3>
        
        <div className="space-y-2">
          <Label>Уровень физической активности</Label>
          <Select 
            value={data.physical_activity || ''} 
            onValueChange={(value: 'low' | 'moderate' | 'high') => updateData({ physical_activity: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень активности" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Низкий (менее 150 мин/неделя)</SelectItem>
              <SelectItem value="moderate">Умеренный (150-300 мин/неделя)</SelectItem>
              <SelectItem value="high">Высокий (более 300 мин/неделя)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            Включает ходьбу, бег, плавание, велосипед и другие виды физической активности
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Питание</h3>
        
        <div className="space-y-2">
          <Label>Потребление красного мяса</Label>
          <Select 
            value={data.red_meat_consumption || ''} 
            onValueChange={(value: 'low' | 'moderate' | 'high') => updateData({ red_meat_consumption: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень потребления" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Низкое (менее 2 раз в неделю)</SelectItem>
              <SelectItem value="moderate">Умеренное (2-4 раза в неделю)</SelectItem>
              <SelectItem value="high">Высокое (более 4 раз в неделю)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            Говядина, свинина, баранина и другое красное мясо
          </p>
        </div>

        <div className="space-y-2">
          <Label>Потребление переработанного мяса</Label>
          <Select 
            value={data.processed_meat_consumption || ''} 
            onValueChange={(value: 'low' | 'moderate' | 'high') => updateData({ processed_meat_consumption: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень потребления" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Низкое (менее 1 раза в неделю)</SelectItem>
              <SelectItem value="moderate">Умеренное (1-3 раза в неделю)</SelectItem>
              <SelectItem value="high">Высокое (более 3 раз в неделю)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            Колбасы, сосиски, бекон, ветчина и другие обработанные мясные продукты
          </p>
        </div>

        <div className="space-y-2">
          <Label>Потребление клетчатки</Label>
          <Select 
            value={data.fiber_intake || ''} 
            onValueChange={(value: 'low' | 'moderate' | 'high') => updateData({ fiber_intake: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень потребления" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Низкое (менее 20г в день)</SelectItem>
              <SelectItem value="moderate">Умеренное (20-30г в день)</SelectItem>
              <SelectItem value="high">Высокое (более 30г в день)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            Цельнозерновые продукты, овощи, фрукты, бобовые
          </p>
        </div>

        <div className="space-y-2">
          <Label>Потребление овощей</Label>
          <Select 
            value={data.vegetable_intake || ''} 
            onValueChange={(value: 'low' | 'moderate' | 'high') => updateData({ vegetable_intake: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень потребления" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Низкое (менее 3 порций в день)</SelectItem>
              <SelectItem value="moderate">Умеренное (3-5 порций в день)</SelectItem>
              <SelectItem value="high">Высокое (более 5 порций в день)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            Одна порция = примерно 80г свежих овощей
          </p>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Рекомендации по профилактике</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Поддерживайте здоровый вес</li>
          <li>• Ограничьте потребление красного и переработанного мяса</li>
          <li>• Увеличьте потребление клетчатки и овощей</li>
          <li>• Регулярно занимайтесь физической активностью</li>
          <li>• Избегайте курения и ограничьте алкоголь</li>
        </ul>
      </div>
    </div>
  );
};
