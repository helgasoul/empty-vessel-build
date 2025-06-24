/**
 * components/gail-calculator/steps/MedicalHistoryStep.tsx
 * 
 * Шаг 2: Медицинская история
 * 💖 Деликатное собирание репродуктивной истории
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Baby, Activity, Heart } from 'lucide-react';

// Типы для данных
interface HormonalTherapy {
  everUsed: boolean;
  currentlyUsing?: boolean;
  durationMonths?: number;
  type?: 'estrogen_only' | 'combined' | 'other';
}

interface HormonalContraception {
  everUsed: boolean;
  currentlyUsing?: boolean;
  durationMonths?: number;
  ageStarted?: number;
  ageStopped?: number;
}

interface MedicalHistory {
  ageAtMenarche: number;
  ageAtFirstBirth?: number;
  numberOfBirths: number;
  numberOfBiopsies: number;
  atypicalHyperplasia: boolean;
  lobularCarcinomaInSitu: boolean;
  hormonalReplacementTherapy?: HormonalTherapy;
  hormonalContraception?: HormonalContraception;
  breastfeedingMonths?: number;
  ageAtMenopause?: number;
}

interface ValidationError {
  field: string;
  message: string;
}

interface MedicalHistoryStepProps {
  data: Partial<MedicalHistory>;
  onChange: (data: Partial<MedicalHistory>) => void;
  errors: ValidationError[];
}

export const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleChange = (field: keyof MedicalHistory, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field.includes(field))?.message;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Базовая репродуктивная история */}
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Репродуктивная история</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Возраст менархе */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-purple-700">
              <Calendar className="w-4 h-4" />
              <span>Возраст первой менструации <span className="text-red-500">*</span></span>
            </label>
            <input
              type="number"
              min="8"
              max="17"
              value={data.ageAtMenarche || ''}
              onChange={(e) => handleChange('ageAtMenarche', parseInt(e.target.value))}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all ${
                getFieldError('ageAtMenarche') ? 'border-red-300 bg-red-50' : 'border-purple-200'
              }`}
              placeholder="12"
            />
            {getFieldError('ageAtMenarche') && (
              <p className="text-red-600 text-sm">{getFieldError('ageAtMenarche')}</p>
            )}
            <p className="text-purple-600 text-xs">
              Обычно от 8 до 17 лет
            </p>
          </div>

          {/* Возраст менопаузы */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-purple-700">
              <Calendar className="w-4 h-4" />
              <span>Возраст менопаузы (если наступила)</span>
            </label>
            <input
              type="number"
              min="35"
              max="65"
              value={data.ageAtMenopause || ''}
              onChange={(e) => handleChange('ageAtMenopause', parseInt(e.target.value) || undefined)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="Оставьте пустым, если менопауза не наступила"
            />
            <p className="text-purple-600 text-xs">
              Оставьте пустым, если менопауза не наступила
            </p>
          </div>
        </div>
      </div>

      {/* История беременностей и родов */}
      <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
        <h3 className="font-semibold text-pink-800 mb-4 flex items-center space-x-2">
          <Baby className="w-5 h-5" />
          <span>Беременности и роды</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Возраст первых родов */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-pink-700">
              <Baby className="w-4 h-4" />
              <span>Возраст первых родов</span>
            </label>
            <input
              type="number"
              min="12"
              max="50"
              value={data.ageAtFirstBirth || ''}
              onChange={(e) => handleChange('ageAtFirstBirth', parseInt(e.target.value) || undefined)}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all ${
                getFieldError('ageAtFirstBirth') ? 'border-red-300 bg-red-50' : 'border-pink-200'
              }`}
              placeholder="Оставьте пустым, если не рожали"
            />
            {getFieldError('ageAtFirstBirth') && (
              <p className="text-red-600 text-sm">{getFieldError('ageAtFirstBirth')}</p>
            )}
            <p className="text-pink-600 text-xs">
              Оставьте пустым, если детей нет
            </p>
          </div>

          {/* Количество родов */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-pink-700">
              <Baby className="w-4 h-4" />
              <span>Общее количество родов</span>
            </label>
            <input
              type="number"
              min="0"
              max="15"
              value={data.numberOfBirths || 0}
              onChange={(e) => handleChange('numberOfBirths', parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>

          {/* Грудное вскармливание */}
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-pink-700">
              <Heart className="w-4 h-4" />
              <span>Общая продолжительность грудного вскармливания (месяцев)</span>
            </label>
            <input
              type="number"
              min="0"
              max="120"
              value={data.breastfeedingMonths || ''}
              onChange={(e) => handleChange('breastfeedingMonths', parseInt(e.target.value) || undefined)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              placeholder="0"
            />
            <p className="text-pink-600 text-xs">
              Суммарное время всех периодов грудного вскармливания
            </p>
          </div>
        </div>
      </div>

      {/* Медицинские процедуры */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="font-semibold text-indigo-800 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Медицинские процедуры</span>
        </h3>
        
        <div className="space-y-4">
          {/* Количество биопсий */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-indigo-700">
              <FileText className="w-4 h-4" />
              <span>Количество биопсий молочной железы <span className="text-red-500">*</span></span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={data.numberOfBiopsies || 0}
              onChange={(e) => handleChange('numberOfBiopsies', parseInt(e.target.value))}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all ${
                getFieldError('numberOfBiopsies') ? 'border-red-300 bg-red-50' : 'border-indigo-200'
              }`}
              placeholder="0"
            />
            {getFieldError('numberOfBiopsies') && (
              <p className="text-red-600 text-sm">{getFieldError('numberOfBiopsies')}</p>
            )}
            <p className="text-indigo-600 text-xs">
              Включая все виды биопсий (пункционные, трепан-биопсии и др.)
            </p>
          </div>

          {/* Патологические состояния */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-indigo-700">
              Были ли у вас диагностированы следующие состояния:
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="atypicalHyperplasia"
                  checked={data.atypicalHyperplasia || false}
                  onChange={(e) => handleChange('atypicalHyperplasia', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="atypicalHyperplasia" className="text-sm text-indigo-700">
                  <strong>Атипичная гиперплазия</strong> - избыточное разрастание клеток с нарушением структуры
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="lobularCarcinoma"
                  checked={data.lobularCarcinomaInSitu || false}
                  onChange={(e) => handleChange('lobularCarcinomaInSitu', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="lobularCarcinoma" className="text-sm text-indigo-700">
                  <strong>Дольковая карцинома in situ (LCIS)</strong> - предраковое состояние
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Гормональная терапия */}
      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
        <h3 className="font-semibold text-green-800 mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Гормональная терапия</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ЗГТ */}
          <div className="space-y-4">
            <h4 className="font-medium text-green-700">Заместительная гормональная терапия (ЗГТ)</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hrtEverUsed"
                  checked={data.hormonalReplacementTherapy?.everUsed || false}
                  onChange={(e) => handleChange('hormonalReplacementTherapy', {
                    ...data.hormonalReplacementTherapy,
                    everUsed: e.target.checked
                  })}
                  className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="hrtEverUsed" className="text-sm text-green-700">
                  Применяла или применяю ЗГТ
                </label>
              </div>

              {data.hormonalReplacementTherapy?.everUsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3 pl-8"
                >
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Тип ЗГТ
                    </label>
                    <select
                      value={data.hormonalReplacementTherapy?.type || ''}
                      onChange={(e) => handleChange('hormonalReplacementTherapy', {
                        ...data.hormonalReplacementTherapy,
                        type: e.target.value as 'estrogen_only' | 'combined' | 'other'
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">Выберите тип</option>
                      <option value="estrogen_only">Только эстрогены</option>
                      <option value="combined">Комбинированная (эстроген + прогестин)</option>
                      <option value="other">Другой тип</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Продолжительность приема (месяцев)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="600"
                      value={data.hormonalReplacementTherapy?.durationMonths || ''}
                      onChange={(e) => handleChange('hormonalReplacementTherapy', {
                        ...data.hormonalReplacementTherapy,
                        durationMonths: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="hrtCurrently"
                      checked={data.hormonalReplacementTherapy?.currentlyUsing || false}
                      onChange={(e) => handleChange('hormonalReplacementTherapy', {
                        ...data.hormonalReplacementTherapy,
                        currentlyUsing: e.target.checked
                      })}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="hrtCurrently" className="text-sm text-green-700">
                      Применяю в настоящее время
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Гормональная контрацепция */}
          <div className="space-y-4">
            <h4 className="font-medium text-green-700">Гормональная контрацепция</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="contraceptionEverUsed"
                  checked={data.hormonalContraception?.everUsed || false}
                  onChange={(e) => handleChange('hormonalContraception', {
                    ...data.hormonalContraception,
                    everUsed: e.target.checked
                  })}
                  className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="contraceptionEverUsed" className="text-sm text-green-700">
                  Применяла или применяю гормональные контрацептивы
                </label>
              </div>

              {data.hormonalContraception?.everUsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3 pl-8"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">
                        Возраст начала
                      </label>
                      <input
                        type="number"
                        min="12"
                        max="50"
                        value={data.hormonalContraception?.ageStarted || ''}
                        onChange={(e) => handleChange('hormonalContraception', {
                          ...data.hormonalContraception,
                          ageStarted: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400"
                        placeholder="18"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">
                        Возраст окончания
                      </label>
                      <input
                        type="number"
                        min="12"
                        max="55"
                        value={data.hormonalContraception?.ageStopped || ''}
                        onChange={(e) => handleChange('hormonalContraception', {
                          ...data.hormonalContraception,
                          ageStopped: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400"
                        placeholder="Оставьте пустым, если продолжаете"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="contraceptionCurrently"
                      checked={data.hormonalContraception?.currentlyUsing || false}
                      onChange={(e) => handleChange('hormonalContraception', {
                        ...data.hormonalContraception,
                        currentlyUsing: e.target.checked
                      })}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="contraceptionCurrently" className="text-sm text-green-700">
                      Применяю в настоящее время
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Информационная панель */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
        <h4 className="font-medium text-purple-800 mb-2">🔬 Как медицинская история влияет на риски</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• <strong>Ранняя менструация</strong> (до 12 лет) немного повышает риск</li>
          <li>• <strong>Поздние роды</strong> (после 30) или их отсутствие увеличивают риск</li>
          <li>• <strong>Грудное вскармливание</strong> снижает риск пропорционально продолжительности</li>
          <li>• <strong>Биопсии</strong> могут указывать на изменения в тканях молочной железы</li>
          <li>• <strong>Атипичная гиперплазия и LCIS</strong> значительно повышают риск</li>
          <li>• <strong>Гормональная терапия</strong> может влиять на риск в зависимости от типа и продолжительности</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default MedicalHistoryStep;