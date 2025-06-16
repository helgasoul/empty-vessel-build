
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Plus, Loader2, TrendingUp, Settings, Activity } from "lucide-react";
import { useAdvancedDevices } from '@/hooks/useAdvancedDevices';
import AdvancedDeviceCard from './AdvancedDeviceCard';
import DeviceConnectionModal from './DeviceConnectionModal';
import DeviceTrendsAnalysis from './DeviceTrendsAnalysis';

const EnhancedDeviceIntegration = () => {
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('devices');
  const { devices, loading } = useAdvancedDevices();

  const connectedDevices = devices.filter(d => d.is_connected);
  const syncingDevices = devices.filter(d => d.connection_status === 'syncing');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <span>Устройства и аналитика</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2">Загрузка устройств...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                <span>Устройства и аналитика</span>
                {connectedDevices.length > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {connectedDevices.length} подключено
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Управление носимыми устройствами, синхронизация данных и анализ трендов
              </CardDescription>
            </div>
            
            <Button 
              onClick={() => setShowConnectionModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить устройство
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices" className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4" />
            <span>Устройства</span>
            {devices.length > 0 && (
              <Badge variant="secondary" className="ml-1">{devices.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Тренды</span>
            {connectedDevices.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-800">
                Активно
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Настройки</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          {/* Статус синхронизации */}
          {syncingDevices.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">
                    Синхронизация: {syncingDevices.length} устройств
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {devices.length > 0 ? (
            <div className="grid gap-4">
              {devices.map((device) => (
                <AdvancedDeviceCard key={device.id} device={device} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Начните отслеживать здоровье
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Подключите свои носимые устройства для автоматической синхронизации данных 
                  о здоровье, анализа трендов и персонализированных рекомендаций
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <Badge variant="outline">Apple Watch</Badge>
                  <Badge variant="outline">Oura Ring</Badge>
                  <Badge variant="outline">Whoop</Badge>
                  <Badge variant="outline">Libra CGM</Badge>
                  <Badge variant="outline">Google Fit</Badge>
                </div>
                <Button 
                  onClick={() => setShowConnectionModal(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Подключить первое устройство
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends">
          <DeviceTrendsAnalysis />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Глобальные настройки синхронизации</CardTitle>
                <CardDescription>
                  Общие настройки для всех подключенных устройств
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Частота синхронизации</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Автоматическая синхронизация</span>
                        <Badge className="bg-green-100 text-green-800">Включено</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Синхронизация в реальном времени</span>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Уведомления о синхронизации</span>
                        <Badge className="bg-blue-100 text-blue-800">Включено</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Хранение данных</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Период хранения</span>
                        <Badge variant="outline">1 год</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Экспорт данных</span>
                        <Badge className="bg-purple-100 text-purple-800">Доступно</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Резервное копирование</span>
                        <Badge className="bg-green-100 text-green-800">Активно</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Статистика устройств */}
            <Card>
              <CardHeader>
                <CardTitle>Статистика устройств</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{devices.length}</div>
                    <div className="text-sm text-gray-600">Всего устройств</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{connectedDevices.length}</div>
                    <div className="text-sm text-gray-600">Подключено</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {connectedDevices.reduce((sum, d) => sum + d.data_types.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Типов данных</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{syncingDevices.length}</div>
                    <div className="text-sm text-gray-600">Синхронизация</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <DeviceConnectionModal
        open={showConnectionModal}
        onOpenChange={setShowConnectionModal}
      />
    </>
  );
};

export default EnhancedDeviceIntegration;
