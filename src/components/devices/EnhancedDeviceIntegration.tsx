
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Plus, Loader2 } from "lucide-react";
import { useDevices } from '@/hooks/useDevices';
import DeviceCard from './DeviceCard';
import DeviceConnectionModal from './DeviceConnectionModal';

const EnhancedDeviceIntegration = () => {
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const { devices, loading } = useDevices();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <span>Устройства</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <span>Устройства</span>
          </CardTitle>
          <CardDescription>
            Синхронизация с носимыми устройствами и приложениями здоровья
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices.length > 0 ? (
            <>
              {devices.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Устройства не подключены
              </h3>
              <p className="text-gray-600 mb-4">
                Подключите свои устройства для автоматической синхронизации данных о здоровье
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button 
              onClick={() => setShowConnectionModal(true)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить устройство
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeviceConnectionModal
        open={showConnectionModal}
        onOpenChange={setShowConnectionModal}
      />
    </>
  );
};

export default EnhancedDeviceIntegration;
