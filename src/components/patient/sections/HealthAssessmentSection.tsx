
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Edit3 } from 'lucide-react';
import { HealthAssessment } from '@/types/patient';

interface HealthAssessmentSectionProps {
  data?: HealthAssessment;
  onUpdate: (data: HealthAssessment) => void;
}

export default function HealthAssessmentSection({ data, onUpdate }: HealthAssessmentSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Оценка здоровья</h2>
        <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Обновить данные
        </Button>
      </div>

      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Текущие симптомы */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                Текущие симптомы
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.currentSymptoms.length > 0 ? (
                <div className="space-y-2">
                  {data.currentSymptoms.map((symptom) => (
                    <div key={symptom.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{symptom.name}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          symptom.severity === 'severe' ? 'bg-red-100 text-red-700' :
                          symptom.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {symptom.severity === 'severe' ? 'Серьезный' :
                           symptom.severity === 'moderate' ? 'Умеренный' : 'Легкий'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{symptom.duration}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Нет текущих симптомов</p>
              )}
            </CardContent>
          </Card>

          {/* Хронические заболевания */}
          <Card>
            <CardHeader>
              <CardTitle>Хронические заболевания</CardTitle>
            </CardHeader>
            <CardContent>
              {data.chronicConditions.length > 0 ? (
                <div className="space-y-2">
                  {data.chronicConditions.map((condition) => (
                    <div key={condition.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{condition.name}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          condition.status === 'active' ? 'bg-red-100 text-red-700' :
                          condition.status === 'remission' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {condition.status === 'active' ? 'Активно' :
                           condition.status === 'remission' ? 'Ремиссия' : 'Излечено'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Диагноз: {condition.diagnosisDate.toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Нет хронических заболеваний</p>
              )}
            </CardContent>
          </Card>

          {/* Аллергии */}
          <Card>
            <CardHeader>
              <CardTitle>Аллергии</CardTitle>
            </CardHeader>
            <CardContent>
              {data.allergies.length > 0 ? (
                <div className="space-y-2">
                  {data.allergies.map((allergy) => (
                    <div key={allergy.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{allergy.allergen}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          allergy.severity === 'life-threatening' ? 'bg-red-100 text-red-700' :
                          allergy.severity === 'severe' ? 'bg-orange-100 text-orange-700' :
                          allergy.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {allergy.severity === 'life-threatening' ? 'Угроза жизни' :
                           allergy.severity === 'severe' ? 'Серьезная' :
                           allergy.severity === 'moderate' ? 'Умеренная' : 'Легкая'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{allergy.reaction}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Нет известных аллергий</p>
              )}
            </CardContent>
          </Card>

          {/* Лекарства */}
          <Card>
            <CardHeader>
              <CardTitle>Текущие лекарства</CardTitle>
            </CardHeader>
            <CardContent>
              {data.medications.length > 0 ? (
                <div className="space-y-2">
                  {data.medications.map((medication) => (
                    <div key={medication.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{medication.name}</span>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                      <p className="text-xs text-gray-500 mt-1">{medication.purpose}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Не принимаете лекарства</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Создайте профиль здоровья</h3>
            <p className="text-gray-600 mb-6">Заполните анкету для получения персонализированных рекомендаций</p>
            <Button 
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              onClick={() => console.log('Start health assessment')}
            >
              Начать оценку здоровья
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
