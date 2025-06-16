
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CRCProFormData } from './types';

interface CRCProFamilyHistoryProps {
  data: CRCProFormData;
  updateData: (updates: Partial<CRCProFormData>) => void;
}

export const CRCProFamilyHistory: React.FC<CRCProFamilyHistoryProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Колоректальный рак у родственников</Label>
            <p className="text-sm text-gray-600">
              Был ли диагностирован колоректальный рак у ваших близких родственников (родители, братья, сестры, дети)?
            </p>
          </div>
          <Switch
            checked={data.family_history_crc}
            onCheckedChange={(checked) => updateData({ family_history_crc: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Полипы кишечника у родственников</Label>
            <p className="text-sm text-gray-600">
              Были ли диагностированы полипы кишечника у ваших близких родственников?
            </p>
          </div>
          <Switch
            checked={data.family_history_polyps}
            onCheckedChange={(checked) => updateData({ family_history_polyps: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Воспалительные заболевания кишечника у родственников</Label>
            <p className="text-sm text-gray-600">
              Были ли диагностированы болезнь Крона или язвенный колит у ваших близких родственников?
            </p>
          </div>
          <Switch
            checked={data.family_history_ibd}
            onCheckedChange={(checked) => updateData({ family_history_ibd: checked })}
          />
        </div>
      </div>

      {(data.family_history_crc || data.family_history_polyps || data.family_history_ibd) && (
        <div className="space-y-2">
          <Label htmlFor="relatives">Количество пораженных родственников</Label>
          <Input
            id="relatives"
            type="number"
            min="0"
            max="10"
            value={data.number_affected_relatives}
            onChange={(e) => updateData({ number_affected_relatives: parseInt(e.target.value) || 0 })}
            placeholder="Количество родственников с диагнозом"
          />
          <p className="text-sm text-gray-600">
            Укажите общее количество близких родственников с указанными заболеваниями
          </p>
        </div>
      )}

      {(data.family_history_crc || data.family_history_polyps) && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Важная информация</h4>
          <p className="text-sm text-blue-800">
            Семейная история колоректального рака или полипов значительно увеличивает ваш риск. 
            Рекомендуется обсудить с врачом возможность более раннего начала скрининга.
          </p>
        </div>
      )}
    </div>
  );
};
