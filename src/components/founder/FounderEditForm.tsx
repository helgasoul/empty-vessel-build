import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFounderInfo, useUpdateFounderInfo, useUploadFounderImage, useUploadFounderCertificate, FounderInfo } from '@/hooks/useFounderInfo';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Upload, Edit, FileText, X } from 'lucide-react';

const FounderEditForm = () => {
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();
  const { toast } = useToast();
  const { data: founderInfo } = useFounderInfo();
  const updateFounderInfo = useUpdateFounderInfo();
  const uploadImage = useUploadFounderImage();
  const uploadCertificate = useUploadFounderCertificate();

  const [formData, setFormData] = useState<Omit<FounderInfo, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    title: '',
    description: '',
    education: [],
    achievements: [],
    quote: '',
    image_url: '',
    certificates: []
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedCertFile, setSelectedCertFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCert, setIsUploadingCert] = useState(false);

  useEffect(() => {
    if (founderInfo) {
      setFormData({
        name: founderInfo.name || '',
        title: founderInfo.title || '',
        description: founderInfo.description || '',
        education: founderInfo.education || [],
        achievements: founderInfo.achievements || [],
        quote: founderInfo.quote || '',
        image_url: founderInfo.image_url || '',
        certificates: founderInfo.certificates || []
      });
    }
  }, [founderInfo]);

  // Если пользователь не администратор или загрузка роли еще идет, не показываем кнопку
  if (adminLoading || !isAdmin) {
    return null;
  }

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
    }
  };

  const handleCertFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedCertFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImageFile) return;

    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadImage.mutateAsync(selectedImageFile);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setSelectedImageFile(null);
      toast({
        title: "Изображение загружено",
        description: "Изображение успешно загружено и будет сохранено при сохранении формы"
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение",
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCertificateUpload = async () => {
    if (!selectedCertFile) return;

    setIsUploadingCert(true);
    try {
      const certUrl = await uploadCertificate.mutateAsync(selectedCertFile);
      setFormData(prev => ({ 
        ...prev, 
        certificates: [...(prev.certificates || []), certUrl] 
      }));
      setSelectedCertFile(null);
      toast({
        title: "Сертификат загружен",
        description: "Сертификат успешно загружен и будет сохранен при сохранении формы"
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить сертификат",
        variant: "destructive"
      });
    } finally {
      setIsUploadingCert(false);
    }
  };

  const removeCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: (prev.certificates || []).filter((_, i) => i !== index)
    }));
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
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  const updateEducationItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: (prev.education || []).map((item, i) => i === index ? value : item)
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
      achievements: (prev.achievements || []).filter((_, i) => i !== index)
    }));
  };

  const updateAchievementItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: (prev.achievements || []).map((item, i) => i === index ? value : item)
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
        description: "Не удалось сохранить информацию",
        variant: "destructive"
      });
    }
  };

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
              {/* Avatar Upload Section */}
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
                    onChange={handleImageFileChange}
                  />
                  {selectedImageFile && (
                    <Button 
                      type="button" 
                      onClick={handleImageUpload}
                      disabled={isUploadingImage}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploadingImage ? 'Загрузка...' : 'Загрузить изображение'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Certificates Upload Section */}
              <div>
                <Label>Сертификаты</Label>
                <div className="space-y-2">
                  {formData.certificates && formData.certificates.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Загруженные сертификаты:</Label>
                      {formData.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Сертификат {index + 1}</span>
                            <a 
                              href={cert} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Просмотр
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCertificate(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleCertFileChange}
                  />
                  {selectedCertFile && (
                    <Button 
                      type="button" 
                      onClick={handleCertificateUpload}
                      disabled={isUploadingCert}
                      className="w-full"
                      variant="outline"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploadingCert ? 'Загрузка...' : 'Загрузить сертификат'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Education Section */}
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
              {(formData.education || []).map((item, index) => (
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

          {/* Achievements Section */}
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
              {(formData.achievements || []).map((item, index) => (
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
