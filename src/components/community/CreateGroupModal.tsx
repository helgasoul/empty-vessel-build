
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreateSupportGroup } from "@/hooks/useSupportGroups";
import { useToast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const { mutate: createGroup, isPending } = useCreateSupportGroup();
  const { toast } = useToast();

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !category) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    createGroup({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      tags: tags.length > 0 ? tags : undefined,
      is_active: true,
      is_anonymous: true
    }, {
      onSuccess: () => {
        toast({
          title: "Успешно!",
          description: "Группа поддержки создана",
        });
        resetForm();
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: "Не удалось создать группу",
          variant: "destructive",
        });
      }
    });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setTags([]);
    setCurrentTag('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Создать группу поддержки</DialogTitle>
          <DialogDescription className="font-roboto">
            Создайте безопасное пространство для общения и взаимной поддержки
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">
              Название группы *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Поддержка при беременности"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="font-medium">
              Категория *
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health_condition">Состояние здоровья</SelectItem>
                <SelectItem value="lifestyle">Образ жизни</SelectItem>
                <SelectItem value="age_group">Возрастная группа</SelectItem>
                <SelectItem value="interest">Общие интересы</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Описание
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите, о чем будет ваша группа..."
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">
              Теги (до 5 штук)
            </Label>
            <div className="flex space-x-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Добавить тег"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                maxLength={20}
              />
              <Button 
                type="button" 
                onClick={addTag}
                disabled={!currentTag.trim() || tags.length >= 5}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isPending ? 'Создаём...' : 'Создать группу'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
