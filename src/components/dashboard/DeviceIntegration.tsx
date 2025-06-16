
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Watch, Heart, Activity, Plus, CheckCircle, AlertCircle } from "lucide-react";

const DeviceIntegration = () => {
  const devices = [
    {
      name: "Apple Watch",
      icon: Watch,
      status: "connected",
      lastSync: "2 часа назад",
      color: "green"
    },
    {
      name: "Oura Ring",
      icon: Heart,
      status: "disconnected",
      lastSync: "Не подключен",
      color: "gray"
    },
    {
      name: "Whoop",
      icon: Activity,
      status: "pending",
      lastSync: "Настройка...",
      color: "yellow"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700">Подключено</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Настройка</Badge>;
      default:
        return <Badge variant="outline">Не подключено</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-purple-600" />
          <span>Устройства</span>
        </CardTitle>
        <CardDescription>
          Синхронизация с носимыми устройствами
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <device.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{device.name}</h4>
                  {getStatusIcon(device.status)}
                </div>
                <p className="text-sm text-gray-600">{device.lastSync}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(device.status)}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Добавить устройство
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceIntegration;
