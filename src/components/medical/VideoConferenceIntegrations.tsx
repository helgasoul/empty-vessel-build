
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Video, 
  Plus, 
  Settings, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useVideoConferenceIntegrations } from "@/hooks/useVideoConferenceIntegrations";
import type { VideoConferenceIntegration } from '@/types/telemedicine';

const VideoConferenceIntegrations = () => {
  const { integrations, loading, createIntegration, updateIntegration, deleteIntegration } = useVideoConferenceIntegrations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<VideoConferenceIntegration | null>(null);
  const [formData, setFormData] = useState<{
    platform_type: VideoConferenceIntegration['platform_type'];
    platform_user_id: string;
    integration_status: VideoConferenceIntegration['integration_status'];
  }>({
    platform_type: 'zoom',
    platform_user_id: '',
    integration_status: 'active'
  });

  const platforms = [
    { value: 'zoom' as const, label: 'Zoom', icon: '🎥' },
    { value: 'google_meet' as const, label: 'Google Meet', icon: '📹' },
    { value: 'teams' as const, label: 'Microsoft Teams', icon: '💼' },
    { value: 'webex' as const, label: 'Cisco Webex', icon: '🌐' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getPlatformLabel = (platform: string) => {
    return platforms.find(p => p.value === platform)?.label || platform;
  };

  const getPlatformIcon = (platform: string) => {
    return platforms.find(p => p.value === platform)?.icon || '🎥';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingIntegration) {
        await updateIntegration(editingIntegration.id, formData);
      } else {
        await createIntegration({
          ...formData,
          platform_settings: {}
        });
      }
      
      setIsDialogOpen(false);
      setEditingIntegration(null);
      setFormData({
        platform_type: 'zoom',
        platform_user_id: '',
        integration_status: 'active'
      });
    } catch (error) {
      console.error('Ошибка при сохранении интеграции:', error);
    }
  };

  const handleEdit = (integration: VideoConferenceIntegration) => {
    setEditingIntegration(integration);
    setFormData({
      platform_type: integration.platform_type,
      platform_user_id: integration.platform_user_id || '',
      integration_status: integration.integration_status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту интеграцию?')) {
      await deleteIntegration(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Загрузка интеграций...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Интеграции с видеоконференциями</h3>
          <p className="text-sm text-gray-600">
            Подключите платформы для проведения онлайн-консультаций
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Добавить интеграцию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIntegration ? 'Редактировать интеграцию' : 'Новая интеграция'}
              </DialogTitle>
              <DialogDescription>
                Подключите платформу видеоконференций для проведения консультаций
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="platform">Платформа</Label>
                <Select
                  value={formData.platform_type}
                  onValueChange={(value: VideoConferenceIntegration['platform_type']) => 
                    setFormData({ ...formData, platform_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <span>{platform.icon}</span>
                          <span>{platform.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="platform_user_id">ID пользователя на платформе</Label>
                <Input
                  id="platform_user_id"
                  value={formData.platform_user_id}
                  onChange={(e) => setFormData({ ...formData, platform_user_id: e.target.value })}
                  placeholder="Введите ваш ID на платформе"
                />
              </div>

              <div>
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={formData.integration_status}
                  onValueChange={(value: VideoConferenceIntegration['integration_status']) => 
                    setFormData({ ...formData, integration_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активна</SelectItem>
                    <SelectItem value="inactive">Неактивна</SelectItem>
                    <SelectItem value="error">Ошибка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingIntegration ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {integrations.length > 0 ? (
        <div className="grid gap-4">
          {integrations.map(integration => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getPlatformIcon(integration.platform_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {getPlatformLabel(integration.platform_type)}
                      </CardTitle>
                      <CardDescription>
                        {integration.platform_user_id && `ID: ${integration.platform_user_id}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(integration.integration_status)}
                      <Badge variant={getStatusColor(integration.integration_status)}>
                        {integration.integration_status === 'active' ? 'Активна' :
                         integration.integration_status === 'inactive' ? 'Неактивна' : 'Ошибка'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(integration)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(integration.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет подключенных платформ</h3>
            <p className="text-gray-600 mb-4">
              Подключите платформу видеоконференций для проведения онлайн-консультаций
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Подключить платформу</Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoConferenceIntegrations;
