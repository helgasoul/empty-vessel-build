
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Search, Filter, Calendar } from 'lucide-react';
import { LabResult } from '@/types/patient';

interface LabResultsSectionProps {
  data: LabResult[];
  onUpload: (result: LabResult) => void;
}

export default function LabResultsSection({ data, onUpload }: LabResultsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Готов';
      case 'pending': return 'В обработке';
      case 'reviewed': return 'Проверен врачом';
      default: return 'Неизвестно';
    }
  };

  const filteredResults = data.filter(result => {
    const matchesSearch = result.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || result.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Результаты анализов</h2>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
          <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            <Upload className="w-4 h-4 mr-2" />
            Загрузить анализы
          </Button>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по типу анализа..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="completed">Готов</option>
                <option value="pending">В обработке</option>
                <option value="reviewed">Проверен врачом</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Результаты */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredResults.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-600" />
                    {result.testType}
                  </CardTitle>
                  <Badge className={getStatusColor(result.status)}>
                    {getStatusText(result.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Основная информация */}
                  <div>
                    <h4 className="font-medium mb-3">Основная информация</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Дата: {result.testDate.toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Загружено: </span>
                        <span>{result.uploadedBy === 'patient' ? 'Пациентом' : 
                               result.uploadedBy === 'doctor' ? 'Врачом' : 'Лабораторией'}</span>
                      </div>
                      {result.interpretation && (
                        <div>
                          <span className="text-gray-600">Интерпретация: </span>
                          <span>{result.interpretation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Результаты */}
                  <div>
                    <h4 className="font-medium mb-3">Результаты</h4>
                    <div className="space-y-2">
                      {Object.entries(result.results).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span className={`font-medium ${value.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                            {value.value} {value.unit}
                          </span>
                        </div>
                      ))}
                      {Object.keys(result.results).length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{Object.keys(result.results).length - 3} показателей
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Критические значения */}
                  {result.criticalValues && result.criticalValues.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-red-600">Критические значения</h4>
                      <div className="space-y-2">
                        {result.criticalValues.map((critical, index) => (
                          <div key={index} className="p-2 bg-red-50 rounded text-sm">
                            <div className="font-medium text-red-700">{critical.parameter}</div>
                            <div className="text-red-600">{critical.recommendation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Заметки врача */}
                {result.doctorNotes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Заметки врача</h4>
                    <p className="text-sm text-blue-700">{result.doctorNotes}</p>
                  </div>
                )}

                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Скачать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {data.length === 0 ? 'Нет результатов анализов' : 'Результаты не найдены'}
            </h3>
            <p className="text-gray-600 mb-6">
              {data.length === 0 
                ? 'Загрузите результаты ваших анализов для отслеживания здоровья'
                : 'Попробуйте изменить параметры поиска'
              }
            </p>
            {data.length === 0 && (
              <Button 
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                onClick={() => console.log('Upload lab results')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Загрузить первый анализ
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
