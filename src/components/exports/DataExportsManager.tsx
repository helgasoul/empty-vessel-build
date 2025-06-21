
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useDataExports, useCreateExport, useDownloadExport, DataExport } from '@/hooks/useDataExports';
import { Download, FileText, Calendar, Database, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const DataExportsManager = () => {
  const { data: exports, isLoading } = useDataExports();
  const createExport = useCreateExport();
  const downloadExport = useDownloadExport();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<{
    export_type: DataExport['export_type'];
    export_format: DataExport['export_format'];
    date_range_start?: string;
    date_range_end?: string;
  }>({
    export_type: 'health_data',
    export_format: 'pdf',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createExport.mutateAsync(formData);
    
    setShowCreateDialog(false);
    setFormData({
      export_type: 'health_data',
      export_format: 'pdf',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return <Database className="w-4 h-4" />;
      case 'health_data': return <FileText className="w-4 h-4" />;
      case 'cycles': return <Calendar className="w-4 h-4" />;
      case 'family_history': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      full: 'Полный экспорт',
      health_data: 'Данные о здоровье',
      cycles: 'Менструальные циклы',
      family_history: 'Семейная история'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'success',
      failed: 'destructive'
    } as const;
    
    const labels = {
      pending: 'Ожидание',
      processing: 'Обработка',
      completed: 'Готов',
      failed: 'Ошибка'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка экспортов...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-montserrat text-text-primary">Экспорт данных</h2>
          <p className="text-text-secondary">Скачивайте свои медицинские данные в различных форматах</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Создать экспорт
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Новый экспорт данных</DialogTitle>
              <DialogDescription>
                Выберите тип данных и формат для экспорта
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Тип данных</Label>
                  <Select
                    value={formData.export_type}
                    onValueChange={(value) => setFormData({ ...formData, export_type: value as DataExport['export_type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health_data">Данные о здоровье</SelectItem>
                      <SelectItem value="cycles">Менструальные циклы</SelectItem>
                      <SelectItem value="family_history">Семейная история</SelectItem>
                      <SelectItem value="full">Полный экспорт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Формат</Label>
                  <Select
                    value={formData.export_format}
                    onValueChange={(value) => setFormData({ ...formData, export_format: value as DataExport['export_format'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_start">Начальная дата (опционально)</Label>
                  <Input
                    id="date_start"
                    type="date"
                    value={formData.date_range_start || ''}
                    onChange={(e) => setFormData({ ...formData, date_range_start: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date_end">Конечная дата (опционально)</Label>
                  <Input
                    id="date_end"
                    type="date"
                    value={formData.date_range_end || ''}
                    onChange={(e) => setFormData({ ...formData, date_range_end: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={createExport.isPending}>
                  {createExport.isPending ? 'Создание...' : 'Создать экспорт'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {!exports || exports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Download className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет экспортов</h3>
              <p className="text-gray-500 text-center mb-4">
                Создайте первый экспорт для скачивания ваших данных
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Создать экспорт
              </Button>
            </CardContent>
          </Card>
        ) : (
          exports.map((exportItem) => (
            <Card key={exportItem.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(exportItem.export_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {getTypeLabel(exportItem.export_type)} • {exportItem.export_format.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span>Запрошен: {format(new Date(exportItem.requested_at), 'dd.MM.yyyy HH:mm', { locale: ru })}</span>
                        {exportItem.file_size && (
                          <span>• {formatFileSize(exportItem.file_size)}</span>
                        )}
                      </div>
                      {exportItem.date_range_start && exportItem.date_range_end && (
                        <p className="text-sm text-gray-600">
                          Период: {format(new Date(exportItem.date_range_start), 'dd.MM.yyyy', { locale: ru })} - 
                          {format(new Date(exportItem.date_range_end), 'dd.MM.yyyy', { locale: ru })}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(exportItem.export_status)}
                    {exportItem.export_status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadExport.mutate(exportItem.id)}
                        disabled={downloadExport.isPending}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Скачать
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DataExportsManager;
