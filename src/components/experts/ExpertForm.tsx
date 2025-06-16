
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateExpert, useUpdateExpert, useUploadExpertAvatar, Expert } from '@/hooks/useExperts';

interface ExpertFormData {
  name: string;
  title: string;
  specialization: string;
  experience: number;
  description: string;
  consultation_price: number;
  consultation_available: boolean;
}

interface ExpertFormProps {
  expert?: Expert;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ExpertForm: React.FC<ExpertFormProps> = ({ expert, onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ExpertFormData>({
    defaultValues: {
      name: expert?.name || '',
      title: expert?.title || '',
      specialization: expert?.specialization || '',
      experience: expert?.experience || 0,
      description: expert?.description || '',
      consultation_price: expert?.consultation_price || 0,
      consultation_available: expert?.consultation_available ?? true,
    }
  });

  const [avatar, setAvatar] = useState<string | undefined>(expert?.avatar_url);
  const [education, setEducation] = useState<string[]>(expert?.education || []);
  const [certifications, setCertifications] = useState<string[]>(expert?.certifications || []);
  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const createExpert = useCreateExpert();
  const updateExpert = useUpdateExpert();
  const uploadAvatar = useUploadExpertAvatar();

  const handleAvatarUpload = async (file: File) => {
    try {
      const avatarUrl = await uploadAvatar.mutateAsync({ 
        file, 
        expertId: expert?.id || 'temp-' + Date.now() 
      });
      setAvatar(avatarUrl);
      toast({
        title: "Аватар загружен",
        description: "Изображение успешно загружено",
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setEducation([...education, newEducation.trim()]);
      setNewEducation('');
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ExpertFormData) => {
    try {
      const expertData = {
        ...data,
        avatar_url: avatar,
        education,
        certifications,
      };

      if (expert) {
        await updateExpert.mutateAsync({ id: expert.id, ...expertData });
        toast({
          title: "Эксперт обновлен",
          description: "Данные эксперта успешно обновлены",
        });
      } else {
        await createExpert.mutateAsync(expertData);
        toast({
          title: "Эксперт добавлен",
          description: "Новый эксперт успешно добавлен",
        });
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные эксперта",
        variant: "destructive",
      });
    }
  };

  const initials = watch('name')?.split(' ').map(n => n[0]).join('').toUpperCase() || '';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{expert ? 'Редактировать эксперта' : 'Добавить эксперта'}</CardTitle>
        <CardDescription>
          {expert ? 'Обновите информацию об эксперте' : 'Заполните информацию о новом эксперте'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar} alt="Expert avatar" />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-purple-100 to-blue-100">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                {...register('name', { required: 'ФИО обязательно' })}
                placeholder="Др. Анна Петрова"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="specialization">Специализация</Label>
              <Input
                id="specialization"
                {...register('specialization', { required: 'Специализация обязательна' })}
                placeholder="Гинекология"
              />
              {errors.specialization && <p className="text-sm text-red-500 mt-1">{errors.specialization.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Должность</Label>
            <Input
              id="title"
              {...register('title', { required: 'Должность обязательна' })}
              placeholder="Врач-гинеколог высшей категории"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Опыт работы (лет)</Label>
              <Input
                id="experience"
                type="number"
                {...register('experience', { required: 'Опыт работы обязателен', min: 0 })}
              />
              {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>}
            </div>

            <div>
              <Label htmlFor="consultation_price">Стоимость консультации (₽)</Label>
              <Input
                id="consultation_price"
                type="number"
                {...register('consultation_price', { min: 0 })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Краткое описание специалиста..."
              rows={3}
            />
          </div>

          {/* Education */}
          <div>
            <Label>Образование</Label>
            <div className="space-y-2">
              {education.map((edu, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex-1 justify-between">
                    {edu}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="h-auto p-1 ml-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  placeholder="Добавить образование..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
                />
                <Button type="button" onClick={addEducation} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <Label>Сертификаты</Label>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex-1 justify-between">
                    {cert}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                      className="h-auto p-1 ml-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Добавить сертификат..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                />
                <Button type="button" onClick={addCertification} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={createExpert.isPending || updateExpert.isPending}
              className="flex-1"
            >
              {expert ? 'Обновить' : 'Добавить'} эксперта
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpertForm;
