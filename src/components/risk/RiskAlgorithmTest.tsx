
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, PlayCircle, Beaker, AlertTriangle } from "lucide-react";

interface TestCase {
  name: string;
  input: any;
  expectedRisk: number;
  expectedLevel: string;
  description: string;
}

interface TestResult {
  testName: string;
  passed: boolean;
  actualRisk: number;
  expectedRisk: number;
  actualLevel: string;
  expectedLevel: string;
  error?: string;
}

const RiskAlgorithmTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Тестовые случаи для QRISK3
  const qrisk3TestCases: TestCase[] = [
    {
      name: "QRISK3 - Низкий риск",
      input: {
        age: 30,
        gender: "female",
        systolic_bp: 120,
        cholesterol_ratio: 4.0,
        bmi: 22,
        smoking: false,
        diabetes: false,
        family_history_cvd: false,
        chronic_kidney_disease: false,
        atrial_fibrillation: false,
        rheumatoid_arthritis: false,
        treated_hypertension: false
      },
      expectedRisk: 2,
      expectedLevel: "low",
      description: "Молодая женщина без факторов риска"
    },
    {
      name: "QRISK3 - Высокий риск",
      input: {
        age: 65,
        gender: "male",
        systolic_bp: 160,
        cholesterol_ratio: 7.0,
        bmi: 30,
        smoking: true,
        diabetes: true,
        family_history_cvd: true,
        chronic_kidney_disease: false,
        atrial_fibrillation: true,
        rheumatoid_arthritis: false,
        treated_hypertension: true
      },
      expectedRisk: 25,
      expectedLevel: "high",
      description: "Пожилой мужчина с множественными факторами риска"
    }
  ];

  // Тестовые случаи для Gail Model
  const gailTestCases: TestCase[] = [
    {
      name: "Gail - Низкий риск",
      input: {
        age: 40,
        age_at_menarche: 13,
        age_at_first_birth: 22,
        num_relatives: 0,
        num_biopsies: 0,
        hyperplasia: "none",
        race_ethnicity: "white"
      },
      expectedRisk: 1.2,
      expectedLevel: "low",
      description: "Средний возраст без факторов риска"
    },
    {
      name: "Gail - Высокий риск",
      input: {
        age: 60,
        age_at_menarche: 11,
        age_at_first_birth: null,
        num_relatives: 2,
        num_biopsies: 3,
        hyperplasia: "with_atypia",
        race_ethnicity: "white"
      },
      expectedRisk: 5.0,
      expectedLevel: "high",
      description: "Множественные факторы риска рака молочной железы"
    }
  ];

  // Функция имитации расчета QRISK3
  const calculateQRISK3 = (data: any) => {
    let score = 0;
    
    // Возраст
    score += (data.age - 25) * 0.5;
    
    // Пол
    if (data.gender === 'male') score += 5;
    
    // Давление
    if (data.systolic_bp > 140) score += 8;
    else if (data.systolic_bp > 120) score += 3;
    
    // Холестерин
    if (data.cholesterol_ratio > 6) score += 6;
    else if (data.cholesterol_ratio > 4.5) score += 2;
    
    // ИМТ
    if (data.bmi > 30) score += 4;
    else if (data.bmi > 25) score += 1;
    
    // Курение
    if (data.smoking) score += 8;
    
    // Диабет
    if (data.diabetes) score += 10;
    
    // Семейная история
    if (data.family_history_cvd) score += 6;
    
    // Другие факторы
    if (data.chronic_kidney_disease) score += 5;
    if (data.atrial_fibrillation) score += 7;
    if (data.rheumatoid_arthritis) score += 3;
    if (data.treated_hypertension) score += 2;
    
    // Преобразование в процент риска
    const risk = Math.min(Math.max(score * 0.8, 0.1), 45);
    const level = risk < 10 ? 'low' : risk < 20 ? 'moderate' : 'high';
    
    return { risk: Number(risk.toFixed(1)), level };
  };

  // Функция имитации расчета Gail Model
  const calculateGail = (data: any) => {
    let relativeRisk = 1.0;

    // Возраст
    const ageFactor = data.age < 40 ? 0.5 : data.age < 50 ? 0.8 : data.age < 60 ? 1.2 : 1.5;
    relativeRisk *= ageFactor;

    // Возраст менархе
    if (data.age_at_menarche <= 11) relativeRisk *= 1.3;
    else if (data.age_at_menarche >= 14) relativeRisk *= 0.9;

    // Возраст первых родов
    if (data.age_at_first_birth === null || data.age_at_first_birth >= 30) {
      relativeRisk *= 1.4;
    } else if (data.age_at_first_birth < 20) {
      relativeRisk *= 0.7;
    }

    // Родственники с раком
    relativeRisk *= Math.pow(2.5, data.num_relatives);

    // Биопсии
    if (data.num_biopsies >= 2) relativeRisk *= 1.6;
    else if (data.num_biopsies === 1) relativeRisk *= 1.3;

    // Гиперплазия
    if (data.hyperplasia === 'with_atypia') relativeRisk *= 2.1;
    else if (data.hyperplasia === 'without_atypia') relativeRisk *= 1.4;

    // Базовый риск
    const baselineRisk = data.age < 40 ? 0.5 : data.age < 50 ? 0.8 : data.age < 60 ? 1.2 : 1.6;
    const fiveYearRisk = baselineRisk * relativeRisk;
    
    const risk = Number(fiveYearRisk.toFixed(1));
    const level = risk < 1.67 ? 'low' : risk < 3.0 ? 'moderate' : 'high';
    
    return { risk, level };
  };

  const runAlgorithmTest = async (testCase: TestCase, algorithm: string) => {
    try {
      let result;
      
      if (algorithm === 'qrisk3') {
        result = calculateQRISK3(testCase.input);
      } else if (algorithm === 'gail') {
        result = calculateGail(testCase.input);
      } else {
        throw new Error(`Unknown algorithm: ${algorithm}`);
      }

      const tolerance = 2; // Допустимое отклонение в 2%
      const riskDiff = Math.abs(result.risk - testCase.expectedRisk);
      const passed = riskDiff <= tolerance && result.level === testCase.expectedLevel;

      return {
        testName: testCase.name,
        passed,
        actualRisk: result.risk,
        expectedRisk: testCase.expectedRisk,
        actualLevel: result.level,
        expectedLevel: testCase.expectedLevel
      };
    } catch (error) {
      return {
        testName: testCase.name,
        passed: false,
        actualRisk: 0,
        expectedRisk: testCase.expectedRisk,
        actualLevel: 'error',
        expectedLevel: testCase.expectedLevel,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const allTestCases = [
      ...qrisk3TestCases.map(tc => ({ ...tc, algorithm: 'qrisk3' })),
      ...gailTestCases.map(tc => ({ ...tc, algorithm: 'gail' }))
    ];

    const results: TestResult[] = [];

    for (const testCase of allTestCases) {
      const result = await runAlgorithmTest(testCase, testCase.algorithm);
      results.push(result);
      setTestResults([...results]); // Обновляем результаты по мере выполнения
      
      // Небольшая задержка для наглядности
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (passed: boolean, error?: string) => {
    if (error) return <XCircle className="w-5 h-5 text-red-600" />;
    return passed ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusColor = (passed: boolean, error?: string) => {
    if (error) return "bg-red-100 text-red-800 border-red-200";
    return passed ? 
      "bg-green-100 text-green-800 border-green-200" : 
      "bg-red-100 text-red-800 border-red-200";
  };

  const passedTests = testResults.filter(result => result.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Beaker className="w-5 h-5 text-blue-600" />
            <span>Тестирование алгоритмов оценки рисков</span>
          </CardTitle>
          <CardDescription>
            Автоматическое тестирование точности расчетов различных алгоритмов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{isRunning ? 'Выполняется...' : 'Запустить тесты'}</span>
              </Button>
              
              {testResults.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    Пройдено: {passedTests}/{totalTests}
                  </Badge>
                  <Badge className={passedTests === totalTests ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {passedTests === totalTests ? 'Все тесты прошли' : 'Есть ошибки'}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {testResults.length > 0 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Результаты тестирования алгоритмов. Допустимое отклонение: ±2%.
                Некоторые тесты могут не проходить из-за упрощенных реализаций алгоритмов.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.passed, result.error)}
                    <div>
                      <h3 className="font-medium">{result.testName}</h3>
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1">Ошибка: {result.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={getStatusColor(result.passed, result.error)}>
                      {result.error ? 'Ошибка' : result.passed ? 'Пройден' : 'Не пройден'}
                    </Badge>
                  </div>
                </div>
                
                {!result.error && (
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ожидаемый риск:</span>
                      <span className="ml-2 font-medium">{result.expectedRisk}% ({result.expectedLevel})</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Фактический риск:</span>
                      <span className="ml-2 font-medium">{result.actualRisk}% ({result.actualLevel})</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskAlgorithmTest;
