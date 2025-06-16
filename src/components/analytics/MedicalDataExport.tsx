
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  Stethoscope, 
  Heart, 
  Activity, 
  Moon,
  Brain,
  Droplet
} from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useHealthData } from '@/hooks/useHealthData';
import { useMenstrualCycle } from '@/hooks/useMenstrualCycle';
import { useSymptomMoodLog } from '@/hooks/useSymptomMoodLog';
import { useResearchFiles } from '@/hooks/useResearchFiles';
import { useReportExport } from '@/hooks/useReportExport';

interface ExportOptions {
  healthMetrics: boolean;
  menstrualCycles: boolean;
  moodSymptoms: boolean;
  researchFiles: boolean;
  correlationAnalysis: boolean;
  trendAnalysis: boolean;
}

const MedicalDataExport: React.FC = () => {
  const { healthData } = useHealthData();
  const { cycles } = useMenstrualCycle();
  const { logs } = useSymptomMoodLog();
  const { files } = useResearchFiles();
  const { exporting, exportToPDF } = useReportExport();

  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: subMonths(new Date(), 3),
    to: new Date()
  });

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    healthMetrics: true,
    menstrualCycles: true,
    moodSymptoms: true,
    researchFiles: false,
    correlationAnalysis: true,
    trendAnalysis: true
  });

  const [reportFormat, setReportFormat] = useState<'comprehensive' | 'summary' | 'timeline'>('comprehensive');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    dateOfBirth: '',
    doctorName: '',
    appointmentDate: format(new Date(), 'yyyy-MM-dd')
  });

  // Подготавливаем данные для экспорта
  const exportData = useMemo(() => {
    const filteredHealthData = healthData.filter(item => {
      const date = new Date(item.recorded_at);
      return date >= dateRange.from && date <= dateRange.to;
    });

    const filteredCycles = cycles.filter(cycle => {
      const date = new Date(cycle.cycle_start_date);
      return date >= dateRange.from && date <= dateRange.to;
    });

    const filteredLogs = logs.filter(log => {
      const date = new Date(log.log_date);
      return date >= dateRange.from && date <= dateRange.to;
    });

    const filteredFiles = files.filter(file => {
      const date = new Date(file.research_date);
      return date >= dateRange.from && date <= dateRange.to;
    });

    // Агрегируем данные по типам
    const healthMetrics = {
      steps: filteredHealthData.filter(d => d.data_type === 'steps'),
      heartRate: filteredHealthData.filter(d => d.data_type === 'heart_rate'),
      sleep: filteredHealthData.filter(d => d.data_type === 'sleep'),
      bloodPressure: filteredHealthData.filter(d => d.data_type === 'blood_pressure'),
      weight: filteredHealthData.filter(d => d.data_type === 'weight')
    };

    // Вычисляем средние значения
    const averages = {
      dailySteps: healthMetrics.steps.length > 0 
        ? Math.round(healthMetrics.steps.reduce((sum, d) => sum + (d.data_value || 0), 0) / healthMetrics.steps.length)
        : 0,
      restingHeartRate: healthMetrics.heartRate.length > 0 
        ? Math.round(healthMetrics.heartRate.reduce((sum, d) => sum + (d.data_value || 0), 0) / healthMetrics.heartRate.length)
        : 0,
      avgSleepHours: healthMetrics.sleep.length > 0 
        ? Math.round((healthMetrics.sleep.reduce((sum, d) => sum + (d.data_value || 0), 0) / healthMetrics.sleep.length) * 10) / 10
        : 0,
      avgCycleLength: filteredCycles.length > 0 
        ? Math.round(filteredCycles.reduce((sum, c) => sum + (c.cycle_length || 28), 0) / filteredCycles.length)
        : 28
    };

    return {
      reportInfo: {
        generatedAt: new Date().toISOString(),
        dateRange: {
          from: format(dateRange.from, 'dd.MM.yyyy'),
          to: format(dateRange.to, 'dd.MM.yyyy')
        },
        patient: patientInfo,
        format: reportFormat
      },
      summary: {
        totalDataPoints: filteredHealthData.length,
        cyclesTracked: filteredCycles.length,
        moodLogEntries: filteredLogs.length,
        researchFiles: filteredFiles.length,
        averages
      },
      healthMetrics: exportOptions.healthMetrics ? healthMetrics : null,
      menstrualCycles: exportOptions.menstrualCycles ? filteredCycles : null,
      moodSymptoms: exportOptions.moodSymptoms ? filteredLogs : null,
      researchFiles: exportOptions.researchFiles ? filteredFiles : null,
      rawData: {
        healthData: filteredHealthData,
        cycles: filteredCycles,
        logs: filteredLogs,
        files: filteredFiles
      }
    };
  }, [healthData, cycles, logs, files, dateRange, exportOptions, patientInfo, reportFormat]);

  const handleExportOptionChange = (option: keyof ExportOptions, checked: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleExport = async () => {
    await exportToPDF(exportData, `medical_report_${patientInfo.name || 'patient'}`);
  };

  const quickDateRanges = [
    { label: '1 месяц', action: () => setDateRange({ from: subMonths(new Date(), 1), to: new Date() }) },
    { label: '3 месяца', action: () => setDateRange({ from: subMonths(new Date(), 3), to: new Date() }) },
    { label: '6 месяцев', action: () => setDateRange({ from: subMonths(new Date(), 6), to: new Date() }) },
    { label: '1 год', action: () => setDateRange({ from: subMonths(new Date(), 12), to: new Date() }) }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <span>Медицинский экспорт данных</span>
          </CardTitle>
          <CardDescription>
            Подготовка детального отчета для врача с анализом состояния здоровья
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Информация о пациенте */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Информация о пациенте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Имя пациента</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Введите имя пациента"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Дата рождения</label>
              <input
                type="date"
                className="w-full mt-1 p-2 border rounded-md"
                value={patientInfo.dateOfBirth}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Лечащий врач</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md"
                value={patientInfo.doctorName}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, doctorName: e.target.value }))}
                placeholder="Введите имя врача"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Дата приема</label>
              <input
                type="date"
                className="w-full mt-1 p-2 border rounded-md"
                value={patientInfo.appointmentDate}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, appointmentDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Настройки экспорта */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Период данных */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Период данных</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(dateRange.from, 'dd.MM.yyyy')} - {format(dateRange.to, 'dd.MM.yyyy')}
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
            
            <div className="grid grid-cols-2 gap-2">
              {quickDateRanges.map((range) => (
                <Button
                  key={range.label}
                  variant="outline"
                  size="sm"
                  onClick={range.action}
                  className="text-xs"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Тип отчета */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Формат отчета</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportFormat} onValueChange={(value: any) => setReportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Комплексный отчет</SelectItem>
                <SelectItem value="summary">Краткая сводка</SelectItem>
                <SelectItem value="timeline">Хронология событий</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-4 text-sm text-gray-600">
              {reportFormat === 'comprehensive' && "Полный анализ всех данных с графиками и корреляциями"}
              {reportFormat === 'summary' && "Краткий обзор ключевых показателей и трендов"}
              {reportFormat === 'timeline' && "Хронологическое представление событий и изменений"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Выбор данных для экспорта */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Включить в отчет</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="healthMetrics"
                checked={exportOptions.healthMetrics}
                onCheckedChange={(checked) => handleExportOptionChange('healthMetrics', !!checked)}
              />
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <label htmlFor="healthMetrics" className="text-sm font-medium">
                  Показатели здоровья
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="menstrualCycles"
                checked={exportOptions.menstrualCycles}
                onCheckedChange={(checked) => handleExportOptionChange('menstrualCycles', !!checked)}
              />
              <div className="flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-pink-500" />
                <label htmlFor="menstrualCycles" className="text-sm font-medium">
                  Менструальные циклы
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="moodSymptoms"
                checked={exportOptions.moodSymptoms}
                onCheckedChange={(checked) => handleExportOptionChange('moodSymptoms', !!checked)}
              />
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <label htmlFor="moodSymptoms" className="text-sm font-medium">
                  Настроение и симптомы
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="researchFiles"
                checked={exportOptions.researchFiles}
                onCheckedChange={(checked) => handleExportOptionChange('researchFiles', !!checked)}
              />
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-500" />
                <label htmlFor="researchFiles" className="text-sm font-medium">
                  Файлы исследований
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="correlationAnalysis"
                checked={exportOptions.correlationAnalysis}
                onCheckedChange={(checked) => handleExportOptionChange('correlationAnalysis', !!checked)}
              />
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <label htmlFor="correlationAnalysis" className="text-sm font-medium">
                  Корреляционный анализ
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="trendAnalysis"
                checked={exportOptions.trendAnalysis}
                onCheckedChange={(checked) => handleExportOptionChange('trendAnalysis', !!checked)}
              />
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                <label htmlFor="trendAnalysis" className="text-sm font-medium">
                  Анализ трендов
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Предварительный просмотр */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Предварительный просмотр</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Период:</span>
                <div className="font-medium">{exportData.reportInfo.dateRange.from} - {exportData.reportInfo.dateRange.to}</div>
              </div>
              <div>
                <span className="text-gray-600">Записей данных:</span>
                <div className="font-medium">{exportData.summary.totalDataPoints}</div>
              </div>
              <div>
                <span className="text-gray-600">Циклов:</span>
                <div className="font-medium">{exportData.summary.cyclesTracked}</div>
              </div>
              <div>
                <span className="text-gray-600">Записей настроения:</span>
                <div className="font-medium">{exportData.summary.moodLogEntries}</div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Средние шаги/день:</span>
                <div className="font-medium">{exportData.summary.averages.dailySteps.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Средний пульс:</span>
                <div className="font-medium">{exportData.summary.averages.restingHeartRate} bpm</div>
              </div>
              <div>
                <span className="text-gray-600">Средний сон:</span>
                <div className="font-medium">{exportData.summary.averages.avgSleepHours}ч</div>
              </div>
              <div>
                <span className="text-gray-600">Средняя длина цикла:</span>
                <div className="font-medium">{exportData.summary.averages.avgCycleLength} дней</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Кнопка экспорта */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Готов к экспорту</h3>
              <p className="text-sm text-gray-600">
                Отчет будет сохранен в формате PDF с медицинским форматированием
              </p>
            </div>
            <Button 
              onClick={handleExport} 
              disabled={exporting || !patientInfo.name}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Экспорт...' : 'Экспортировать отчет'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalDataExport;
