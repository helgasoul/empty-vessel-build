
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, User, FileText, Calendar, MessageSquare, Activity } from "lucide-react";
import { useDoctorPermissions } from '@/hooks/usePatientDoctorPermissions';
import { usePatientCalculatorResults } from '@/hooks/useCalculatorResults';

const PatientDataAccess = () => {
  const { data: permissions, isLoading } = useDoctorPermissions();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: calculatorResults } = usePatientCalculatorResults(selectedPatient || undefined);

  const filteredPermissions = permissions?.filter(permission =>
    permission.patient?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.patient?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Доступ к данным пациентов</h2>
        <p className="text-gray-600 mt-1">
          Просматривайте данные пациентов, которые предоставили вам доступ
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Список пациентов */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Мои пациенты</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск пациентов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredPermissions?.map((permission) => (
                  <div
                    key={permission.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                      selectedPatient === permission.patient_id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedPatient(permission.patient_id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {permission.patient?.full_name || 'Не указано'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {permission.patient?.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {permission.data_types.slice(0, 2).map((dataType) => (
                        <Badge key={dataType} variant="secondary" className="text-xs">
                          {dataType}
                        </Badge>
                      ))}
                      {permission.data_types.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{permission.data_types.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredPermissions?.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Нет пациентов с предоставленным доступом</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Данные выбранного пациента */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="lab-results">Анализы</TabsTrigger>
                <TabsTrigger value="calculators">Калькуляторы</TabsTrigger>
                <TabsTrigger value="chat">Сообщения</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Обзор пациента</CardTitle>
                    <CardDescription>
                      Общая информация и последние обновления
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <FileText className="w-8 h-8 text-blue-600 mb-2" />
                          <h3 className="font-semibold text-blue-900">Результаты анализов</h3>
                          <p className="text-sm text-blue-700">12 записей</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <Activity className="w-8 h-8 text-green-600 mb-2" />
                          <h3 className="font-semibold text-green-900">Расчеты</h3>
                          <p className="text-sm text-green-700">{calculatorResults?.length || 0} результатов</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lab-results">
                <Card>
                  <CardHeader>
                    <CardTitle>Результаты лабораторных анализов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      Здесь будут отображаться результаты лабораторных анализов пациента
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calculators">
                <Card>
                  <CardHeader>
                    <CardTitle>Результаты калькуляторов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {calculatorResults?.map((result) => (
                        <div key={result.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{result.calculator_name}</h3>
                            <Badge variant={result.is_critical ? "destructive" : "default"}>
                              {result.interpretation}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {result.result_text || `${result.result_value} ${result.units || ''}`}
                          </p>
                          {result.reference_range && (
                            <p className="text-xs text-gray-500">
                              Референсные значения: {result.reference_range}
                            </p>
                          )}
                        </div>
                      ))}
                      
                      {calculatorResults?.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Нет результатов калькуляторов</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <Card>
                  <CardHeader>
                    <CardTitle>Сообщения с пациентом</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      Здесь будет чат с пациентом
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Выберите пациента
                </h3>
                <p className="text-gray-600">
                  Выберите пациента из списка слева для просмотра его данных
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDataAccess;
