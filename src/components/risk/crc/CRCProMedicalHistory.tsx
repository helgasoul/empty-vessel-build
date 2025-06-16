
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CRCProFormData } from './types';

interface CRCProMedicalHistoryProps {
  data: CRCProFormData;
  updateData: (updates: Partial<CRCProFormData>) => void;
}

export const CRCProMedicalHistory: React.FC<CRCProMedicalHistoryProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Полипы кишечника в личной истории</Label>
            <p className="text-sm text-gray-600">
              Были ли у вас диагностированы полипы кишечника?
            </p>
          </div>
          <Switch
            checked={data.personal_history_polyps}
            onCheckedChange={(checked) => updateData({ personal_history_polyps: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Воспалительные заболевания кишечника</Label>
            <p className="text-sm text-gray-600">
              Есть ли у вас болезнь Крона или язвенный колит?
            </p>
          </div>
          <Switch
            checked={data.personal_history_ibd}
            onCheckedChange={(checked) => updateData({ personal_history_ibd: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Сахарный диабет 2 типа</Label>
            <p className="text-sm text-gray-600">
              Диагностирован ли у вас сахарный диабет 2 типа?
            </p>
          </div>
          <Switch
            checked={data.diabetes_type2}
            onCheckedChange={(checked) => updateData({ diabetes_type2: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Предыдущие колоноскопии</Label>
            <p className="text-sm text-gray-600">
              Проходили ли вы колоноскопию ранее?
            </p>
          </div>
          <Switch
            checked={data.previous_colonoscopy}
            onCheckedChange={(checked) => updateData({ previous_colonoscopy: checked })}
          />
        </div>
      </div>

      {data.previous_colonoscopy && (
        <div className="space-y-2">
          <Label htmlFor="last_colonoscopy">Дата последней колоноскопии</Label>
          <Input
            id="last_colonoscopy"
            type="date"
            value={data.last_colonoscopy_date || ''}
            onChange={(e) => updateData({ last_colonoscopy_date: e.target.value })}
          />
          <p className="text-sm text-gray-600">
            Укажите дату последней колоноскопии для оценки необходимости повторного обследования
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Лекарственные препараты</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Регулярный прием НПВП</Label>
            <p className="text-sm text-gray-600">
              Принимаете ли вы регулярно нестероидные противовоспалительные препараты (аспирин, ибупрофен и др.)?
            </p>
          </div>
          <Switch
            checked={data.nsaid_use}
            onCheckedChange={(checked) => updateData({ nsaid_use: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Препараты кальция</Label>
            <p className="text-sm text-gray-600">
              Принимаете ли вы добавки кальция?
            </p>
          </div>
          <Switch
            checked={data.calcium_supplements}
            onCheckedChange={(checked) => updateData({ calcium_supplements: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Мультивитамины</Label>
            <p className="text-sm text-gray-600">
              Принимаете ли вы мультивитаминные комплексы?
            </p>
          </div>
          <Switch
            checked={data.multivitamin_use}
            onCheckedChange={(checked) => updateData({ multivitamin_use: checked })}
          />
        </div>
      </div>

      {(data.personal_history_polyps || data.personal_history_ibd) && (
        <div className="p-4 bg-red-50 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2">Важно!</h4>
          <p className="text-sm text-red-800">
            Личная история полипов или воспалительных заболеваний кишечника 
            значительно увеличивает риск развития колоректального рака. 
            Необходимо регулярное наблюдение у специалиста.
          </p>
        </div>
      )}
    </div>
  );
};
