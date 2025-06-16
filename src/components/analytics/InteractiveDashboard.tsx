
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  Filter, 
  Download, 
  FileText,
  FileSpreadsheet,
  FileJson,
  Share2
} from "lucide-react";
import { format, subDays, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import HealthTrends from './HealthTrends';
import PredictiveTrends from './PredictiveTrends';
import AgeGroupComparison from './AgeGroupComparison';
import { useReportExport } from '@/hooks/useReportExport';

interface InteractiveDashboardProps {
  healthData: any[];
  userAge?: number;
}

const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ 
  healthData, 
  userAge = 30 
}) => {
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['steps', 'heartRate', 'sleep']);
  const [comparison, setComparison] = useState<'none' | 'previous' | 'ageGroup'>('ageGroup');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  
  const { exporting, exportToPDF, exportToExcel, exportToJSON } = useReportExport();

  // Фильтрация данных по выбранному диапазону
  const filteredData = useMemo(() => {
    return healthData.filter(item => {
      const itemDate = new Date(item.date);
      return isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to });
    });
  }, [healthData, dateRange]);

  // Вычисление метрик
  const metrics = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        avgSteps: 0,
        avgHeartRate: 0,
        avgSleepHours: 0,
        avgActiveMinutes: 0,
        consistencyScore: 0
      };
    }

    const totalDays = filteredData.length;
    const avgSteps = filteredData.reduce((sum, day) => sum + (day.steps || 0), 0) / totalDays;
    const avgHeartRate = filteredData.reduce((sum, day) => sum + (day.heartRate || 0), 0) / totalDays;
    const avgSleepHours = filteredData.reduce((sum, day) => sum + (day.sleepHours || 0), 0) / totalDays;
    const avgActiveMinutes = filteredData.reduce((sum, day) => sum + (day.activeMinutes || 0), 0) / totalDays;

    const activeDays = filteredData.filter(day => 
      (day.steps || 0) > 1000 || (day.activeMinutes || 0) > 10
    ).length;
    const consistencyScore = (activeDays / totalDays) * 100;

    return {
      avgSteps: Math.round(avgSteps),
      avgHeartRate: Math.round(avgHeartRate),
      avgSleepHours: Math.round(avgSleepHours * 10) / 10,
      avgActiveMinutes: Math.round(avgActiveMinutes),
      consistencyScore: Math.round(consistencyScore)
    };
  }, [filteredData]);

  // Данные для экспорта
  const exportData = useMemo(() => ({
    timeRange: `${format(dateRange.from, 'dd.MM.yyyy')} - ${format(dateRange.to, 'dd.MM.yyyy')}`,
    metrics,
    data: filteredData,
    userAge,
    exportDate: new Date().toISOString(),
    categories: selectedCategories
  }), [filteredData, metrics, dateRange, userAge, selectedCategories]);

  const quickDateRanges = [
    { label: '7 дней', days: 7 },
    { label: '30 дней', days: 30 },
    { label: '90 дней', days: 90 },
    { label: '1 год', days: 365 }
  ];

  const categories = [
    { id: 'steps', label: 'Шаги', color: 'bg-blue-500' },
    { id: 'heartRate', label: 'Пульс', color: 'bg-red-500' },
    { id: 'sleep', label: 'Сон', color: 'bg-purple-500' },
    { id: 'activeMinutes', label: 'Активность', color: 'bg-green-500' }
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Панель управления */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <span>Интерактивный дашборд</span>
              </CardTitle>
              <CardDescription>
                Настройте фильтры для детального анализа ваших данных
              </CardDescription>
            </div>
            
            {/* Кнопки экспорта */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToPDF(exportData, 'health_dashboard')}
                disabled={exporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToExcel(filteredData, 'health_dashboard')}
                disabled={exporting}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToJSON(exportData, 'health_dashboard')}
                disabled={exporting}
              >
                <FileJson className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Выбор периода */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Период анализа</label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {format(dateRange.from, 'dd.MM')} - {format(dateRange.to, 'dd.MM')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap gap-1">
                {quickDateRanges.map((range) => (
                  <Button
                    key={range.days}
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({
                      from: subDays(new Date(), range.days),
                      to: new Date()
                    })}
                    className="text-xs"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Выбор категорий */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Показатели</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedCategories.includes(category.id) ? category.color + ' text-white' : ''
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Тип сравнения */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Сравнение</label>
              <Select value={comparison} onValueChange={(value: any) => setComparison(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без сравнения</SelectItem>
                  <SelectItem value="previous">С предыдущим периодом</SelectItem>
                  <SelectItem value="ageGroup">С возрастной группой</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Тип графика */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Тип графика</label>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Линейный</SelectItem>
                  <SelectItem value="bar">Столбчатый</SelectItem>
                  <SelectItem value="area">Область</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистика периода */}
      <Card>
        <CardHeader>
          <CardTitle>
            Статистика за период: {format(dateRange.from, 'dd MMM', { locale: ru })} - {format(dateRange.to, 'dd MMM', { locale: ru })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.avgSteps.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Средние шаги</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {metrics.avgHeartRate}
              </div>
              <div className="text-sm text-gray-600">Средний пульс</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.avgSleepHours}ч
              </div>
              <div className="text-sm text-gray-600">Средний сон</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {metrics.avgActiveMinutes}мин
              </div>
              <div className="text-sm text-gray-600">Активность</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {metrics.consistencyScore}%
              </div>
              <div className="text-sm text-gray-600">Постоянство</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Основной контент с вкладками */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Тренды</TabsTrigger>
          <TabsTrigger value="predictions">Прогнозы ИИ</TabsTrigger>
          <TabsTrigger value="comparison">Сравнение</TabsTrigger>
          <TabsTrigger value="insights">Инсайты</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <HealthTrends 
            data={filteredData} 
            timeRange={filteredData.length <= 7 ? '7d' : filteredData.length <= 30 ? '30d' : '90d'}
          />
        </TabsContent>

        <TabsContent value="predictions">
          <PredictiveTrends historicalData={filteredData} />
        </TabsContent>

        <TabsContent value="comparison">
          {comparison === 'ageGroup' ? (
            <AgeGroupComparison 
              userMetrics={metrics} 
              userAge={userAge} 
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Filter className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Выберите тип сравнения
                  </h3>
                  <p className="text-gray-600">
                    Используйте фильтр "Сравнение" для анализа данных
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Персональные инсайты</CardTitle>
              <CardDescription>
                Ключевые выводы на основе анализа ваших данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.length > 0 ? (
                  <>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">📊 Анализ активности</h4>
                      <p className="text-blue-800 text-sm">
                        За выбранный период ваша средняя активность составила {metrics.avgSteps.toLocaleString()} шагов в день. 
                        {metrics.avgSteps >= 10000 ? ' Отличный результат!' : ' Рекомендуем увеличить ежедневную активность.'}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">😴 Качество сна</h4>
                      <p className="text-purple-800 text-sm">
                        Средняя продолжительность сна: {metrics.avgSleepHours} часов. 
                        {metrics.avgSleepHours >= 7 ? ' Хорошее время сна!' : ' Рекомендуем увеличить время сна до 7-9 часов.'}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">💪 Постоянство</h4>
                      <p className="text-green-800 text-sm">
                        Показатель постоянства: {metrics.consistencyScore}%. 
                        {metrics.consistencyScore >= 80 ? ' Вы очень последовательны!' : ' Старайтесь поддерживать активность каждый день.'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Недостаточно данных для генерации инсайтов.</p>
                    <p className="text-sm mt-2">Выберите другой период или добавьте больше данных.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveDashboard;
