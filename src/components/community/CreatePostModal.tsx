
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreatePost } from "@/hooks/useCommunityPosts";
import { useSupportGroups } from "@/hooks/useSupportGroups";
import { useToast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, groupId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('discussion');
  const [selectedGroupId, setSelectedGroupId] = useState(groupId || '');
  const [anonymousName, setAnonymousName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const { mutate: createPost, isPending } = useCreatePost();
  const { data: groups } = useSupportGroups();
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
    
    if (!content.trim() || !selectedGroupId || !anonymousName.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    createPost({
      group_id: selectedGroupId,
      anonymous_name: anonymousName.trim(),
      title: title.trim() || undefined,
      content: content.trim(),
      post_type: postType,
      tags: tags.length > 0 ? tags : undefined,
      is_anonymous: true
    }, {
      onSuccess: () => {
        toast({
          title: "Успешно!",
          description: "Пост опубликован",
        });
        resetForm();
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: "Не удалось опубликовать пост",
          variant: "destructive",
        });
      }
    });
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPostType('discussion');
    if (!groupId) setSelectedGroupId('');
    setAnonymousName('');
    setTags([]);
    setCurrentTag('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Создать обсуждение</DialogTitle>
          <DialogDescription className="font-roboto">
            Поделитесь своими мыслями, опытом или задайте вопрос сообществу
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="anonymousName" className="font-medium">
              Ваше анонимное имя *
            </Label>
            <Input
              id="anonymousName"
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              placeholder="Например: Мама_двоих"
              maxLength={50}
            />
          </div>

          {!groupId && (
            <div className="space-y-2">
              <Label htmlFor="group" className="font-medium">
                Группа *
              </Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите группу" />
                </SelectTrigger>
                <SelectContent>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="postType" className="font-medium">
              Тип поста
            </Label>
            <Select value={postType} onValueChange={setPostType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discussion">Обсуждение</SelectItem>
                <SelectItem value="experience">Делюсь опытом</SelectItem>
                <SelectItem value="question">Вопрос</SelectItem>
                <SelectItem value="support">Нужна поддержка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">
              Заголовок (опционально)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Кратко опишите тему"
              maxLength={150}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="font-medium">
              Содержание *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Поделитесь своими мыслями..."
              rows={5}
              maxLength={2000}
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
              {isPending ? 'Публикуем...' : 'Опубликовать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
