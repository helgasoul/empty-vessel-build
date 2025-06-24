import React, { useState } from 'react';
import { useEnhancedGailCalculator } from '../hooks/useEnhancedGailCalculator';

interface GailCalculatorDemoProps {
  className?: string;
}

export const GailCalculatorDemo: React.FC<GailCalculatorDemoProps> = ({ className }) => {
  const {
    // Основные данные
    gailInput,
    setGailInput,
    gailResult,
    isCalculating,
    
    // Эмоциональное состояние
    emotionalState,
    preparationSteps,
    showingResults,
    resultsDisclosureStage,
    relaxationTechniques,
    
    // Основные функции
    prepareForResults,
    assessAnxiety,
    setDisclosurePreference,
    performRelaxation,
    checkSupportSystem,
    getProgressPercentage,
    getEmotionalSupport
  } = useEnhancedGailCalculator();

  const [currentStep, setCurrentStep] = useState<'input' | 'preparation' | 'results'>('input');
  const [anxietyAssessment, setAnxietyAssessment] = useState({
    feelingNervous: 1,
    worriedAboutHealth: 1,
    sleepQuality: 5,
    physicalSymptoms: [] as string[],
    previousExperience: 'none' as 'positive' | 'negative' | 'none'
  });

  const handleAnxietyAssessment = () => {
    const result = assessAnxiety(anxietyAssessment);
    console.log('Anxiety assessment result:', result);
  };

  const handleStartCalculation = async () => {
    if (!gailInput) return;
    
    setCurrentStep('preparation');
    
    // Если пользователь не готов, показываем подготовку
    if (!emotionalState.isReadyForResults) {
      return;
    }
    
    // Запускаем расчет с эмоциональной подготовкой
    const success = await prepareForResults();
    if (success) {
      setCurrentStep('results');
    }
  };

  const emotionalSupport = getEmotionalSupport();

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-pink-500 to-teal-400 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            Калькулятор риска рака груди
          </h1>
          <p className="text-pink-100 mt-2">
            Мы поможем вам понять ваши риски и подготовимся к результатам вместе
          </p>
        </div>

        {/* Прогресс */}
        {currentStep === 'preparation' && (
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Подготовка к результатам
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Этап ввода данных */}
          {currentStep === 'input' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Расскажите о себе
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваш возраст
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="90"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    onChange={(e) => setGailInput(prev => prev ? 
                      { ...prev, age: parseInt(e.target.value) } : 
                      { age: parseInt(e.target.value), ageAtFirstPeriod: 13, ageAtFirstBirth: null, relatives: 0, biopsies: 0, raceEthnicity: 'white' }
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Возраст первых месячных
                  </label>
                  <input
                    type="number"
                    min="9"
                    max="18"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    onChange={(e) => setGailInput(prev => prev ? 
                      { ...prev, ageAtFirstPeriod: parseInt(e.target.value) } : 
                      { age: 30, ageAtFirstPeriod: parseInt(e.target.value), ageAtFirstBirth: null, relatives: 0, biopsies: 0, raceEthnicity: 'white' }
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Количество родственниц с раком груди
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    onChange={(e) => setGailInput(prev => prev ? 
                      { ...prev, relatives: parseInt(e.target.value) } : 
                      { age: 30, ageAtFirstPeriod: 13, ageAtFirstBirth: null, relatives: parseInt(e.target.value), biopsies: 0, raceEthnicity: 'white' }
                    )}
                  >
                    <option value="0">Нет</option>
                    <option value="1">1 родственница</option>
                    <option value="2">2 родственницы</option>
                    <option value="3">3 или более</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Количество биопсий груди
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    onChange={(e) => setGailInput(prev => prev ? 
                      { ...prev, biopsies: parseInt(e.target.value) } : 
                      { age: 30, ageAtFirstPeriod: 13, ageAtFirstBirth: null, relatives: 0, biopsies: parseInt(e.target.value), raceEthnicity: 'white' }
                    )}
                  >
                    <option value="0">Нет</option>
                    <option value="1">1 биопсия</option>
                    <option value="2">2 или более</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStartCalculation}
                disabled={!gailInput?.age}
                className="w-full bg-teal-500 text-white py-3 px-4 rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Продолжить
              </button>
            </div>
          )}

          {/* Этап подготовки */}
          {currentStep === 'preparation' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Подготовимся к получению результатов
                </h2>
                <p className="text-gray-600 mt-2">
                  {emotionalSupport.message}
                </p>
              </div>

              {/* Шаги подготовки */}
              <div className="space-y-4">
                {preparationSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`border rounded-lg p-4 ${
                      step.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step.completed ? '✓' : index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      {step.required && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Обязательно
                        </span>
                      )}
                    </div>

                    {/* Специфический контент для каждого шага */}
                    {step.id === 'anxiety-assessment' && !step.completed && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Насколько нервно вы себя чувствуете? (1-5)
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={anxietyAssessment.feelingNervous}
                            onChange={(e) => setAnxietyAssessment(prev => ({
                              ...prev,
                              feelingNervous: parseInt(e.target.value)
                            }))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Спокойно</span>
                            <span>Очень нервно</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Беспокоитесь ли о своем здоровье? (1-5)
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={anxietyAssessment.worriedAboutHealth}
                            onChange={(e) => setAnxietyAssessment(prev => ({
                              ...prev,
                              worriedAboutHealth: parseInt(e.target.value)
                            }))}
                            className="w-full"
                          />
                        </div>

                        <button
                          onClick={handleAnxietyAssessment}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Завершить оценку
                        </button>
                      </div>
                    )}

                    {step.id === 'information-preference' && !step.completed && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-700">Как вы хотели бы получить результаты?</p>
                        <div className="space-y-2">
                          {(['direct', 'gentle', 'gradual'] as const).map((style) => (
                            <label key={style} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="disclosure-style"
                                value={style}
                                onChange={() => setDisclosurePreference(style)}
                                className="text-teal-500"
                              />
                              <span className="text-sm">
                                {style === 'direct' && 'Прямо и быстро'}
                                {style === 'gentle' && 'Мягко и поддерживающе'}
                                {style === 'gradual' && 'Постепенно, шаг за шагом'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.id === 'relaxation' && emotionalState.anxietyLevel === 'high' && !step.completed && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-700 mb-3">
                          Мы рекомендуем технику релаксации для снижения тревожности:
                        </p>
                        <div className="space-y-2">
                          {relaxationTechniques.slice(0, 2).map((technique) => (
                            <button
                              key={technique.id}
                              onClick={() => performRelaxation(technique.id)}
                              className="block w-full text-left p-3 border border-gray-200 rounded hover:bg-gray-50"
                            >
                              <div className="font-medium">{technique.name}</div>
                              <div className="text-sm text-gray-600">{technique.description}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                ~{Math.round(technique.duration / 60)} минут
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.id === 'support-check' && !step.completed && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-gray-700">Проверим вашу систему поддержки:</p>
                        {[
                          { key: 'hasEmergencyContact', label: 'У вас есть экстренный контакт?' },
                          { key: 'hasSupportPerson', label: 'Есть близкий человек для поддержки?' },
                          { key: 'comfortableDiscussing', label: 'Готовы обсуждать результаты?' },
                          { key: 'knowsNextSteps', label: 'Знаете, что делать после получения результатов?' }
                        ].map((item) => (
                          <label key={item.key} className="flex items-center space-x-2">
                            <input type="checkbox" className="text-teal-500" />
                            <span className="text-sm">{item.label}</span>
                          </label>
                        ))}
                        <button
                          onClick={() => checkSupportSystem({
                            hasEmergencyContact: true,
                            hasSupportPerson: true,
                            comfortableDiscussing: true,
                            knowsNextSteps: true
                          })}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Готов продолжить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {emotionalState.isReadyForResults && (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-green-800 font-medium">
                        Вы готовы к получению результатов!
                      </span>
                    </div>
                    <p className="text-green-700 text-sm mt-2">
                      Готовность: {emotionalState.readinessScore}%
                    </p>
                  </div>
                  
                  <button
                    onClick={() => prepareForResults().then(success => {
                      if (success) setCurrentStep('results');
                    })}
                    disabled={isCalculating}
                    className="bg-teal-500 text-white py-3 px-6 rounded-md hover:bg-teal-600 disabled:bg-gray-300"
                  >
                    {isCalculating ? 'Рассчитываем...' : 'Получить результаты'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Этап результатов */}
          {currentStep === 'results' && gailResult && (
            <div className="space-y-6">
              {/* Градуальное раскрытие */}
              {showingResults && emotionalState.preferredDisclosureStyle === 'gradual' && (
                <div className="text-center space-y-4">
                  {resultsDisclosureStage >= 1 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900">Готовим ваши результаты...</h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Мы проанализировали вашу информацию и готовы поделиться результатами
                      </p>
                    </div>
                  )}

                  {resultsDisclosureStage >= 2 && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <h3 className="font-medium text-indigo-900">О процессе расчета</h3>
                      <p className="text-indigo-700 text-sm mt-1">
                        Мы использовали модель Gail - научно обоснованный метод оценки рисков
                      </p>
                    </div>
                  )}

                  {resultsDisclosureStage >= 3 && (
                    <div className={`border rounded-lg p-6 ${
                      gailResult.riskLevel === 'low' ? 'bg-green-50 border-green-200' :
                      gailResult.riskLevel === 'average' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <h3 className="text-lg font-semibold mb-2">Ваш результат</h3>
                      <p className="text-2xl font-bold mb-2">
                        {(gailResult.fiveYearRisk * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm mb-3">риск в ближайшие 5 лет</p>
                      <p className="text-sm leading-relaxed">
                        {gailResult.explanation.plainLanguage}
                      </p>
                    </div>
                  )}

                  {resultsDisclosureStage >= 4 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Факторы, влияющие на риск:</h3>
                      <div className="space-y-2">
                        {gailResult.factors.map((factor, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{factor.name}: {factor.value}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              factor.impact === 'increases' ? 'bg-red-100 text-red-800' :
                              factor.impact === 'decreases' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {factor.impact === 'increases' ? 'Увеличивает' :
                               factor.impact === 'decreases' ? 'Снижает' : 'Нейтрально'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resultsDisclosureStage >= 5 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-3">Рекомендуемые действия:</h3>
                      <ul className="text-sm text-blue-800 text-left space-y-1">
                        {gailResult.explanation.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Прямое отображение результатов */}
              {(!showingResults || emotionalState.preferredDisclosureStyle !== 'gradual') && (
                <div className="space-y-4">
                  <div className={`text-center border rounded-lg p-6 ${
                    gailResult.riskLevel === 'low' ? 'bg-green-50 border-green-200' :
                    gailResult.riskLevel === 'average' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <h2 className="text-xl font-semibold mb-2">Ваш результат</h2>
                    <p className="text-3xl font-bold mb-2">
                      {(gailResult.fiveYearRisk * 100).toFixed(1)}%
                    </p>
                    <p className="mb-4">риск в ближайшие 5 лет</p>
                    <p className="text-sm leading-relaxed max-w-2xl mx-auto">
                      {gailResult.explanation.plainLanguage}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Факторы риска:</h3>
                      <div className="space-y-2">
                        {gailResult.factors.map((factor, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{factor.name}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                factor.impact === 'increases' ? 'bg-red-100 text-red-800' :
                                factor.impact === 'decreases' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {factor.impact === 'increases' ? 'Увеличивает' :
                                 factor.impact === 'decreases' ? 'Снижает' : 'Нейтрально'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs">{factor.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-3">Следующие шаги:</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {gailResult.explanation.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-900 mb-2">Важные ограничения:</h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {gailResult.explanation.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-600 mt-0.5">⚠</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    setCurrentStep('input');
                    setGailInput(null);
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-3"
                >
                  Новый расчет
                </button>
                <button className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600">
                  Сохранить результаты
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};