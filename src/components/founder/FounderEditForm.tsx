
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFounderInfo, useUpdateFounderInfo, useUploadFounderImage, FounderInfo } from '@/hooks/useFounderInfo';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Upload, Edit } from 'lucide-react';

const FounderEditForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: founderInfo } = useFounderInfo();
  const updateFounderInfo = useUpdateFounderInfo();
  const uploadImage = useUploadFounderImage();

  const [formData, setFormData] = useState<Omit<FounderInfo, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    title: '',
    description: '',
    education: [],
    achievements: [],
    quote: '',
    image_url: ''
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (founderInfo) {
      setFormData({
        name: founderInfo.name || '',
        title: founderInfo.title || '',
        description: founderInfo.description || '',
        education: founderInfo.education || [],
        achievements: founderInfo.achievements || [],
        quote: founderInfo.quote || '',
        image_url: founderInfo.image_url || ''
      });
    }
  }, [founderInfo]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage.mutateAsync(selectedFile);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setSelectedFile(null);
      toast({
        title: "Изображение загружено",
        description: "Изображение успешно загружено и будет сохранено при сохранении формы"
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addEducationItem = () => {
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), '']
    }));
  };

  const removeEducationItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index) || []
    }));
  };

  const updateEducationItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const addAchievementItem = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), '']
    }));
  };

  const removeAchievementItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || []
    }));
  };

  const updateAchievementItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateFounderInfo.mutateAsync(formData);
      toast({
        title: "Информация обновлена",
        description: "Информация об основателе успешно сохранена"
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить информацию"
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-4 right-4 z-50 bg-white shadow-lg hover:shadow-xl"
        >
          <Edit className="w-4 h-4 mr-2" />
          Редактировать основателя
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование информации об основателе</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="title">Должность и звания</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="quote">Цитата</Label>
                <textarea
                  id="quote"
                  className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md"
                  value={formData.quote}
                  onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Изображение</Label>
                <div className="space-y-2">
                  {formData.image_url && (
                    <img 
                      src={formData.image_url} 
                      alt="Предварительный просмотр"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <Button 
                      type="button" 
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Загрузка...' : 'Загрузить изображение'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Образование
                <Button type="button" size="sm" onClick={addEducationItem}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formData.education?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) => updateEducationItem(index, e.target.value)}
                    placeholder="Введите информацию об образовании"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeEducationItem(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Достижения
                <Button type="button" size="sm" onClick={addAchievementItem}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formData.achievements?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) => updateAchievementItem(index, e.target.value)}
                    placeholder="Введите достижение"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeAchievementItem(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={updateFounderInfo.isPending}>
              {updateFounderInfo.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FounderEditForm;
