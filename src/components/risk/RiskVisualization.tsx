
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar } from 'recharts';
import { Heart, Brain, Shield, Activity, TrendingUp, Info } from "lucide-react";

interface RiskData {
  assessment_type: string;
  risk_percentage: number;
  risk_level: string;
  created_at: string;
  recommendations: string[];
  results_data?: any;
}

interface RiskVisualizationProps {
  riskData: RiskData[];
}

const RiskVisualization: React.FC<RiskVisualizationProps> = ({ riskData }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#27AE60';
      case 'intermediate':
      case 'medium':
      case 'moderate': return '#FFB347';
      case 'high': return '#E74C3C';
      case 'very_high': return '#C0392B';
      default: return '#95A5A6';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Низкий';
      case 'intermediate':
      case 'medium':
      case 'moderate': return 'Средний';
      case 'high': return 'Высокий';
      case 'very_high': return 'Очень высокий';
      default: return 'Неизвестно';
    }
  };

  const getAssessmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'qrisk3':
      case 'framingham_alzheimer':
        return Heart;
      case 'demport':
        return Brain;
      case 'cancer_risk':
        return Shield;
      case 'bcsc':
      case 'brca':
      case 'gail':
        return Activity;
      default:
        return TrendingUp;
    }
  };

  const getAssessmentName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'qrisk3': return 'QRISK3';
      case 'framingham_alzheimer': return 'Framingham';
      case 'demport': return 'DemPoRT';
      case 'cancer_risk': return 'Cancer Risk';
      case 'bcsc': return 'BCSC v3';
      case 'brca': return 'BRCA';
      case 'gail': return 'Gail Model';
      case 'rais_chemical': return 'RAIS Chemical';
      default: return type.toUpperCase();
    }
  };

  // Подготовка данных для круговой диаграммы
  const pieData = riskData.map(item => ({
    name: getAssessmentName(item.assessment_type),
    value: item.risk_percentage,
    color: getRiskColor(item.risk_level),
    level: getRiskLevelText(item.risk_level)
  }));

  // Подготовка данных для столбчатой диаграммы
  const barData = riskData.map(item => ({
    name: getAssessmentName(item.assessment_type),
    risk: item.risk_percentage,
    color: getRiskColor(item.risk_level)
  }));

  // Данные для радиальной диаграммы общего риска
  const overallRisk = riskData.length > 0 
    ? riskData.reduce((sum, item) => sum + item.risk_percentage, 0) / riskData.length 
    : 0;

  const radialData = [{
    name: 'Общий риск',
    value: overallRisk,
    fill: getRiskColor(overallRisk < 10 ? 'low' : overallRisk < 25 ? 'medium' : 'high')
  }];

  if (riskData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет данных для визуализации
            </h3>
            <p className="text-gray-600">
              Пройдите оценку рисков для просмотра графиков и диаграмм
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Обзор общего риска */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Общий обзор рисков</span>
          </CardTitle>
          <CardDescription>
            Сводная информация по всем проведенным оценкам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Радиальная диаграмма общего риска */}
            <div className="text-center">
              <h4 className="font-medium mb-4">Средний риск</h4>
              <ResponsiveContainer width="100%" height={150}>
                <RadialBarChart data={radialData}>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={radialData[0].fill}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="mt-2">
                <div className="text-2xl font-bold">{overallRisk.toFixed(1)}%</div>
                <Badge className={`mt-1`} style={{ 
                  backgroundColor: getRiskColor(overallRisk < 10 ? 'low' : overallRisk < 25 ? 'medium' : 'high'),
                  color: 'white'
                }}>
                  {getRiskLevelText(overallRisk < 10 ? 'low' : overallRisk < 25 ? 'medium' : 'high')}
                </Badge>
              </div>
            </div>

            {/* Статистика */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Низкий риск</div>
                  <div className="text-2xl font-bold text-green-700">
                    {riskData.filter(item => item.risk_level === 'low').length}
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium">Средний риск</div>
                  <div className="text-2xl font-bold text-yellow-700">
                    {riskData.filter(item => ['medium', 'moderate', 'intermediate'].includes(item.risk_level)).length}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Высокий риск</div>
                  <div className="text-2xl font-bold text-red-700">
                    {riskData.filter(item => ['high', 'very_high'].includes(item.risk_level)).length}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Всего оценок</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {riskData.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Детальные диаграммы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Круговая диаграмма */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение рисков</CardTitle>
            <CardDescription>
              Процентное соотношение рисков по категориям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: string, props: any) => [
                    `${value}% (${props.payload.level})`, 
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Столбчатая диаграмма */}
        <Card>
          <CardHeader>
            <CardTitle>Сравнение рисков</CardTitle>
            <CardDescription>
              Сравнительный анализ по типам оценки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Риск']} />
                <Bar dataKey="risk" fill="#8884d8">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Детальная информация по каждой оценке */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskData.map((item, index) => {
          const IconComponent = getAssessmentIcon(item.assessment_type);
          return (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-lg">
                      {getAssessmentName(item.assessment_type)}
                    </CardTitle>
                  </div>
                  <Badge style={{ 
                    backgroundColor: getRiskColor(item.risk_level),
                    color: 'white'
                  }}>
                    {getRiskLevelText(item.risk_level)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Риск:</span>
                      <span className="font-medium">{item.risk_percentage}%</span>
                    </div>
                    <Progress 
                      value={item.risk_percentage} 
                      className="h-2"
                      style={{
                        '--progress-background': getRiskColor(item.risk_level)
                      } as React.CSSProperties}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Дата: {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </div>
                  
                  {item.recommendations && item.recommendations.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1 flex items-center space-x-1">
                        <Info className="w-3 h-3" />
                        <span>Рекомендации:</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.recommendations.slice(0, 2).map((rec, idx) => (
                          <div key={idx} className="mb-1">• {rec}</div>
                        ))}
                        {item.recommendations.length > 2 && (
                          <div className="text-gray-500">
                            +{item.recommendations.length - 2} ещё...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RiskVisualization;
