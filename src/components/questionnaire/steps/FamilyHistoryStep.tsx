import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyHistoryData, FamilyCondition } from '../../../types/health';

interface FamilyHistoryStepProps {
  data?: FamilyHistoryData;
  onComplete: (data: FamilyHistoryData) => void;
}

const FamilyHistoryStep: React.FC<FamilyHistoryStepProps> = ({ data, onComplete }) => {
  const [formData, setFormData] = useState<FamilyHistoryData>({
    cancers: {
      breastCancer: [],
      ovarianCancer: [],
      colorectalCancer: [],
      lungCancer: [],
      otherCancers: []
    },
    cardiovascular: {
      heartAttack: [],
      stroke: [],
      hypertension: []
    },
    metabolic: {
      diabetes: [],
      thyroidDisease: [],
      osteoporosis: []
    },
    neurological: {
      alzheimer: [],
      parkinson: [],
      otherDementia: []
    },
    ...data
  });

  const [newCondition, setNewCondition] = useState<Partial<FamilyCondition>>({
    relationship: 'mother',
    ageAtDiagnosis: null,
    currentAge: null,
    deceased: false,
    ageAtDeath: null
  });

  const handleSubmit = () => {
    onComplete(formData);
  };

  const addCondition = (category: keyof FamilyHistoryData, conditionType: string) => {
    const condition: FamilyCondition = {
      relationship: newCondition.relationship as any,
      ageAtDiagnosis: newCondition.ageAtDiagnosis,
      currentAge: newCondition.currentAge,
      deceased: newCondition.deceased || false,
      ageAtDeath: newCondition.ageAtDeath
    };

    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [conditionType]: [...(prev[category] as any)[conditionType], condition]
      }
    }));

    // Reset form
    setNewCondition({
      relationship: 'mother',
      ageAtDiagnosis: null,
      currentAge: null,
      deceased: false,
      ageAtDeath: null
    });
  };

  const removeCondition = (category: keyof FamilyHistoryData, conditionType: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [conditionType]: (prev[category] as any)[conditionType].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const ConditionCard = ({ 
    condition, 
    onRemove 
  }: { 
    condition: FamilyCondition; 
    onRemove: () => void;
  }) => (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium capitalize">{condition.relationship}</p>
          {condition.ageAtDiagnosis && (
            <p className="text-sm text-gray-600">Диагноз в {condition.ageAtDiagnosis} лет</p>
          )}
          {condition.deceased ? (
            condition.ageAtDeath && (
              <p className="text-sm text-gray-600">Умер(ла) в {condition.ageAtDeath} лет</p>
            )
          ) : (
            condition.currentAge && (
              <p className="text-sm text-gray-600">Текущий возраст: {condition.currentAge} лет</p>
            )
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          Удалить
        </Button>
      </div>
    </div>
  );

  const AddConditionForm = ({ 
    category, 
    conditionType, 
    title 
  }: { 
    category: keyof FamilyHistoryData; 
    conditionType: string; 
    title: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing conditions */}
        <div className="space-y-2">
          {((formData[category] as any)[conditionType] as FamilyCondition[]).map((condition, index) => (
            <ConditionCard
              key={index}
              condition={condition}
              onRemove={() => removeCondition(category, conditionType, index)}
            />
          ))}
        </div>

        {/* Add new condition form */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="font-medium">Добавить случай заболевания</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relationship">Степень родства</Label>
              <Select 
                value={newCondition.relationship} 
                onValueChange={(value) => setNewCondition(prev => ({ ...prev, relationship: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите родство" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mother">Мать</SelectItem>
                  <SelectItem value="father">Отец</SelectItem>
                  <SelectItem value="sister">Сестра</SelectItem>
                  <SelectItem value="brother">Брат</SelectItem>
                  <SelectItem value="grandmother">Бабушка</SelectItem>
                  <SelectItem value="grandfather">Дедушка</SelectItem>
                  <SelectItem value="aunt">Тетя</SelectItem>
                  <SelectItem value="uncle">Дядя</SelectItem>
                  <SelectItem value="cousin">Двоюродная сестра/брат</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosisAge">Возраст постановки диагноза</Label>
              <Input
                id="diagnosisAge"
                type="number"
                value={newCondition.ageAtDiagnosis || ''}
                onChange={(e) => setNewCondition(prev => ({ 
                  ...prev, 
                  ageAtDiagnosis: e.target.value ? parseInt(e.target.value) : null 
                }))}
                min="1"
                max="100"
                placeholder="50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="deceased"
                checked={newCondition.deceased}
                onCheckedChange={(checked) => setNewCondition(prev => ({ ...prev, deceased: !!checked }))}
              />
              <Label htmlFor="deceased">Умер(ла)</Label>
            </div>

            {newCondition.deceased ? (
              <div className="space-y-2">
                <Label htmlFor="ageAtDeath">Возраст смерти</Label>
                <Input
                  id="ageAtDeath"
                  type="number"
                  value={newCondition.ageAtDeath || ''}
                  onChange={(e) => setNewCondition(prev => ({ 
                    ...prev, 
                    ageAtDeath: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  min="1"
                  max="120"
                  placeholder="75"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="currentAge">Текущий возраст</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={newCondition.currentAge || ''}
                  onChange={(e) => setNewCondition(prev => ({ 
                    ...prev, 
                    currentAge: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  min="1"
                  max="120"
                  placeholder="65"
                />
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={() => addCondition(category, conditionType)}
            disabled={!newCondition.relationship}
            className="w-full"
          >
            Добавить
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Укажите заболевания у ваших кровных родственников. Эта информация поможет оценить наследственные риски.
        </p>
      </div>

      <Tabs defaultValue="cancers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cancers">Онкология</TabsTrigger>
          <TabsTrigger value="cardiovascular">Сердце</TabsTrigger>
          <TabsTrigger value="metabolic">Обмен веществ</TabsTrigger>
          <TabsTrigger value="neurological">Неврология</TabsTrigger>
        </TabsList>

        <TabsContent value="cancers" className="space-y-4">
          <AddConditionForm
            category="cancers"
            conditionType="breastCancer"
            title="Рак молочной железы"
          />
          <AddConditionForm
            category="cancers"
            conditionType="ovarianCancer"
            title="Рак яичников"
          />
          <AddConditionForm
            category="cancers"
            conditionType="colorectalCancer"
            title="Колоректальный рак"
          />
        </TabsContent>

        <TabsContent value="cardiovascular" className="space-y-4">
          <AddConditionForm
            category="cardiovascular"
            conditionType="heartAttack"
            title="Инфаркт миокарда"
          />
          <AddConditionForm
            category="cardiovascular"
            conditionType="stroke"
            title="Инсульт"
          />
          <AddConditionForm
            category="cardiovascular"
            conditionType="hypertension"
            title="Гипертония"
          />
        </TabsContent>

        <TabsContent value="metabolic" className="space-y-4">
          <AddConditionForm
            category="metabolic"
            conditionType="diabetes"
            title="Сахарный диабет"
          />
          <AddConditionForm
            category="metabolic"
            conditionType="thyroidDisease"
            title="Заболевания щитовидной железы"
          />
          <AddConditionForm
            category="metabolic"
            conditionType="osteoporosis"
            title="Остеопороз"
          />
        </TabsContent>

        <TabsContent value="neurological" className="space-y-4">
          <AddConditionForm
            category="neurological"
            conditionType="alzheimer"
            title="Болезнь Альцгеймера"
          />
          <AddConditionForm
            category="neurological"
            conditionType="parkinson"
            title="Болезнь Паркинсона"
          />
          <AddConditionForm
            category="neurological"
            conditionType="otherDementia"
            title="Другие виды деменции"
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="px-8">
          Завершить анкету
        </Button>
      </div>
    </div>
  );
};

export default FamilyHistoryStep;
