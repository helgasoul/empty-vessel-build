
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, Edit, Trash2, Plus } from 'lucide-react';
import { 
  useMissionImages, 
  useCreateMissionImage, 
  useUpdateMissionImage, 
  useDeleteMissionImage,
  useUploadMissionImage,
  MissionImage 
} from '@/hooks/useMissionImages';

const MissionImageManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: missionImages = [] } = useMissionImages();
  const createMissionImage = useCreateMissionImage();
  const updateMissionImage = useUpdateMissionImage();
  const deleteMissionImage = useDeleteMissionImage();
  const uploadImage = useUploadMissionImage();

  const [isOpen, setIsOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<MissionImage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    display_order: 1
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile && !editingImage) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      let imageUrl = editingImage?.image_url || '';

      if (selectedFile) {
        imageUrl = await uploadImage.mutateAsync(selectedFile);
      }

      const imageData = {
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        is_active: true,
        display_order: formData.display_order
      };

      if (editingImage) {
        await updateMissionImage.mutateAsync({
          id: editingImage.id,
          ...imageData
        });
        toast({
          title: "Изображение обновлено",
          description: "Изображение миссии успешно обновлено"
        });
      } else {
        await createMissionImage.mutateAsync(imageData);
        toast({
          title: "Изображение добавлено",
          description: "Изображение миссии успешно добавлено"
        });
      }

      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изображение",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (image: MissionImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      display_order: image.display_order
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMissionImage.mutateAsync(id);
      toast({
        title: "Изображение удалено",
        description: "Изображение миссии успешно удалено"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить изображение",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingImage(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      display_order: 1
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 left-4 z-50 bg-white shadow-lg hover:shadow-xl">
            <Plus className="w-4 h-4 mr-2" />
            Добавить изображение миссии
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? 'Редактировать изображение' : 'Добавить изображение миссии'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="display_order">Порядок отображения</Label>
              <Input
                id="display_order"
                type="number"
                min="1"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Изображение</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!editingImage}
              />
              {editingImage && !selectedFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Оставьте пустым, чтобы сохранить текущее изображение
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Загрузка...' : (editingImage ? 'Обновить' : 'Добавить')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Display existing images */}
      {missionImages.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Управление изображениями миссии</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {missionImages.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 space-y-2">
                  <img 
                    src={image.image_url} 
                    alt={image.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  <h3 className="font-medium">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-gray-600">{image.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Порядок: {image.display_order}</span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(image)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MissionImageManager;
