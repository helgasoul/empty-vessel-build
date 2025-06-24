/**
 * components/gail-calculator/steps/FamilyHistoryStep.tsx
 * 
 * Шаг 3: Семейная история
 * 👨‍👩‍👧‍👦 Деликатное собирание информации о семейной онкологии
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, Dna, AlertTriangle, Plus, Minus } from 'lucide-react';

// Типы для данных
interface FirstDegreeRelatives {
  mother: boolean;
  sisters: number;
  daughters: number;
}

interface FamilyHistory {
  breastCancerRelatives: number;
  ovarianCancerRelatives: number;
  firstDegreeRelatives?: FirstDegreeRelatives;
  maleBreastCancer: boolean;
  knownGeneticMutations?: string[];
  averageAgeAtDiagnosis?: number;
  paternalHistory?: boolean;
  maternalHistory?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

interface FamilyHistoryStepProps {
  data: Partial<FamilyHistory>;
  onChange: (data: Partial<FamilyHistory>) => void;
  errors: ValidationError[];
}

export const FamilyHistoryStep: React.FC<FamilyHistoryStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const [showDetailedFamily, setShowDetailedFamily] = useState(false);
  
  const handleChange = (field: keyof FamilyHistory, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field.includes(field))?.message;
  };

  const getRiskLevel = () => {
    const relatives = data.breastCancerRelatives || 0;
    if (relatives === 0) return { level: 'low', color: 'green', text: 'Низкий риск' };
    if (relatives === 1) return { level: 'moderate', color: 'yellow', text: 'Умеренный риск' };
    if (relatives === 2) return { level: 'high', color: 'orange', text: 'Повышенный риск' };
    return { level: 'very_high', color: 'red', text: 'Высокий риск' };
  };

  const riskInfo = getRiskLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Общая семейная история */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Общая семейная история</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Общее количество родственников с РМЖ */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-blue-700">
              <Users className="w-4 h-4" />
              <span>Родственники с раком молочной железы <span className="text-red-500">*</span></span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={data.breastCancerRelatives || 0}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                handleChange('breastCancerRelatives', value);
                if (value > 1) {
                  setShowDetailedFamily(true);
                }
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                getFieldError('breastCancerRelatives') ? 'border-red-300 bg-red-50' : 'border-blue-200'
              }`}
              placeholder="0"
            />
            {getFieldError('breastCancerRelatives') && (
              <p className="text-red-600 text-sm">{getFieldError('breastCancerRelatives')}</p>
            )}
            <p className="text-blue-600 text-xs">
              Включая всех кровных родственников (любая степень родства)
            </p>
          </div>

          {/* Рак яичников */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-blue-700">
              <Heart className="w-4 h-4" />
              <span>Родственники с раком яичников</span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={data.ovarianCancerRelatives || 0}
              onChange={(e) => handleChange('ovarianCancerRelatives', parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="0"
            />
            <p className="text-blue-600 text-xs">
              Рак яичников часто связан с теми же генетическими мутациями
            </p>
          </div>
        </div>

        {/* Индикатор риска */}
        <div className={`mt-4 p-4 rounded-lg border-2 bg-${riskInfo.color}-50 border-${riskInfo.color}-200`}>
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full bg-${riskInfo.color}-400`} />
            <span className={`font-medium text-${riskInfo.color}-800`}>
              {riskInfo.text} на основе семейной истории
            </span>
          </div>
          <p className={`text-sm text-${riskInfo.color}-700 mt-2`}>
            {data.breastCancerRelatives === 0 && "Отсутствие семейной истории снижает риск"}
            {data.breastCancerRelatives === 1 && "Один родственник с РМЖ умеренно повышает риск"}
            {data.breastCancerRelatives === 2 && "Два родственника с РМЖ значительно повышают риск"}
            {(data.breastCancerRelatives || 0) > 2 && "Множественные случаи РМЖ в семье - высокий риск"}
          </p>
        </div>
      </div>

      {/* Детальная информация о родственниках первой степени */}
      <AnimatePresence>
        {(data.breastCancerRelatives || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-cyan-50 rounded-xl p-6 border border-cyan-200"
          >
            <h3 className="font-semibold text-cyan-800 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Родственники первой степени</span>
            </h3>
            <p className="text-cyan-700 text-sm mb-4">
              Мать, сестры, дочери (наиболее важны для оценки риска)
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Мать */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-700">Мать</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="motherBreastCancer"
                    checked={data.firstDegreeRelatives?.mother || false}
                    onChange={(e) => handleChange('firstDegreeRelatives', {
                      ...data.firstDegreeRelatives,
                      mother: e.target.checked
                    })}
                    className="w-5 h-5 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="motherBreastCancer" className="text-sm text-cyan-700">
                    Рак молочной железы у матери
                  </label>
                </div>
              </div>

              {/* Сестры */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-700">Сестры с РМЖ</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const current = data.firstDegreeRelatives?.sisters || 0;
                      if (current > 0) {
                        handleChange('firstDegreeRelatives', {
                          ...data.firstDegreeRelatives,
                          sisters: current - 1
                        });
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-cyan-200 text-cyan-700 hover:bg-cyan-300 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-cyan-800">
                    {data.firstDegreeRelatives?.sisters || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = data.firstDegreeRelatives?.sisters || 0;
                      if (current < 10) {
                        handleChange('firstDegreeRelatives', {
                          ...data.firstDegreeRelatives,
                          sisters: current + 1
                        });
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-cyan-200 text-cyan-700 hover:bg-cyan-300 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Дочери */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-700">Дочери с РМЖ</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const current = data.firstDegreeRelatives?.daughters || 0;
                      if (current > 0) {
                        handleChange('firstDegreeRelatives', {
                          ...data.firstDegreeRelatives,
                          daughters: current - 1
                        });
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-cyan-200 text-cyan-700 hover:bg-cyan-300 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-cyan-800">
                    {data.firstDegreeRelatives?.daughters || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = data.firstDegreeRelatives?.daughters || 0;
                      if (current < 10) {
                        handleChange('firstDegreeRelatives', {
                          ...data.firstDegreeRelatives,
                          daughters: current + 1
                        });
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-cyan-200 text-cyan-700 hover:bg-cyan-300 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Дополнительные вопросы о семейной истории */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-cyan-700">
                    Средний возраст диагностики в семье
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="90"
                    value={data.averageAgeAtDiagnosis || ''}
                    onChange={(e) => handleChange('averageAgeAtDiagnosis', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-400"
                    placeholder="Примерный возраст (если известен)"
                  />
                  <p className="text-cyan-600 text-xs">
                    Ранний возраст диагностики (до 50 лет) увеличивает значимость
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-cyan-700">Сторона семьи:</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="maternalHistory"
                        checked={data.maternalHistory || false}
                        onChange={(e) => handleChange('maternalHistory', e.target.checked)}
                        className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
                      />
                      <label htmlFor="maternalHistory" className="text-sm text-cyan-700">
                        По материнской линии
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="paternalHistory"
                        checked={data.paternalHistory || false}
                        onChange={(e) => handleChange('paternalHistory', e.target.checked)}
                        className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
                      />
                      <label htmlFor="paternalHistory" className="text-sm text-cyan-700">
                        По отцовской линии
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Мужская линия */}
      <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
        <h3 className="font-semibold text-teal-800 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Мужская линия семьи</span>
        </h3>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="maleBreastCancer"
            checked={data.maleBreastCancer || false}
            onChange={(e) => handleChange('maleBreastCancer', e.target.checked)}
            className="w-5 h-5 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="maleBreastCancer" className="text-sm font-medium text-teal-700">
            Есть мужчины в семье с раком молочной железы
          </label>
        </div>
        
        <p className="text-teal-600 text-sm mt-2">
          Рак молочной железы у мужчин встречается редко, но может указывать на генетическую предрасположенность (особенно мутации BRCA2)
        </p>
      </div>

      {/* Известные генетические мутации */}
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-4 flex items-center space-x-2">
          <Dna className="w-5 h-5" />
          <span>Известные генетические мутации в семье</span>
        </h3>
        
        <div className="space-y-4">
          <p className="text-purple-700 text-sm">
            Отметьте, если кому-то из родственников были диагностированы следующие мутации:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['BRCA1', 'BRCA2', 'TP53', 'PALB2', 'CHEK2', 'ATM', 'BARD1', 'CDH1'].map((gene) => (
              <div key={gene} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={gene}
                  checked={data.knownGeneticMutations?.includes(gene) || false}
                  onChange={(e) => {
                    const mutations = data.knownGeneticMutations || [];
                    if (e.target.checked) {
                      handleChange('knownGeneticMutations', [...mutations, gene]);
                    } else {
                      handleChange('knownGeneticMutations', mutations.filter(m => m !== gene));
                    }
                  }}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor={gene} className="text-sm text-purple-700 font-medium">
                  {gene}
                </label>
              </div>
            ))}
          </div>

          {/* Информация о основных генах */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">Основные гены риска:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
              <div>
                <strong>BRCA1:</strong> Повышает риск до 70-80%
              </div>
              <div>
                <strong>BRCA2:</strong> Повышает риск до 60-70%
              </div>
              <div>
                <strong>TP53:</strong> Синдром Ли-Фраумени
              </div>
              <div>
                <strong>PALB2:</strong> Умеренно-высокий риск
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Предупреждение о высоком риске */}
      <AnimatePresence>
        {((data.breastCancerRelatives || 0) > 2 || 
          (data.knownGeneticMutations?.length || 0) > 0 || 
          data.maleBreastCancer) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-orange-50 rounded-xl p-6 border border-orange-200"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-orange-800 mb-2">⚠️ Рекомендация генетического консультирования</h4>
                <div className="text-sm text-orange-700 space-y-2">
                  <p>
                    На основе вашей семейной истории рекомендуется консультация генетика для:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Оценки необходимости генетического тестирования</li>
                    <li>Разработки персонального плана скрининга</li>
                    <li>Обсуждения профилактических мер</li>
                    <li>Консультирования других членов семьи</li>
                  </ul>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200">
                    <p className="font-medium text-orange-800 mb-1">Критерии для генетического консультирования:</p>
                    <ul className="text-xs space-y-1">
                      {(data.breastCancerRelatives || 0) > 2 && (
                        <li>✓ 3+ родственников с раком молочной железы</li>
                      )}
                      {(data.knownGeneticMutations?.length || 0) > 0 && (
                        <li>✓ Известные мутации в семье</li>
                      )}
                      {data.maleBreastCancer && (
                        <li>✓ Рак молочной железы у мужчин в семье</li>
                      )}
                      {data.ovarianCancerRelatives && data.ovarianCancerRelatives > 0 && (
                        <li>✓ Рак яичников в семье</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Информационная панель */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">🧬 Семейная история и наследственные риски</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>5-10%</strong> случаев рака молочной железы связаны с наследственностью</li>
          <li>• <strong>Родственники первой степени</strong> (мать, сестры, дочери) увеличивают риск в 2-3 раза</li>
          <li>• <strong>Мутации BRCA1/BRCA2</strong> повышают пожизненный риск до 70-80%</li>
          <li>• <strong>Ранний возраст заболевания</strong> в семье (до 50 лет) увеличивает значимость</li>
          <li>• <strong>Двусторонний рак</strong> или множественные опухоли указывают на генетическую причину</li>
          <li>• <strong>Мужской рак молочной железы</strong> часто связан с BRCA2 мутациями</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default FamilyHistoryStep;