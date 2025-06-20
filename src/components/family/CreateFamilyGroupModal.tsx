
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Plus } from "lucide-react";

interface DatabaseFamilyGroup {
  id: string;
  family_name: string;
  description?: string;
  tree_name?: string;
  created_by: string;
  visibility_settings: any;
  created_at: string;
  updated_at: string;
}

interface CreateFamilyGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFamilyCreated: (family: DatabaseFamilyGroup) => void;
}

const CreateFamilyGroupModal: React.FC<CreateFamilyGroupModalProps> = ({
  isOpen,
  onClose,
  onFamilyCreated
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    family_name: '',
    tree_name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('family_groups')
        .insert({
          family_name: formData.family_name,
          tree_name: formData.tree_name || formData.family_name,
          description: formData.description,
          created_by: user.id,
          visibility_settings: {
            medical_sharing: true,
            default_visibility: 'family_only'
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Семейная группа создана",
        description: "Вы можете начать добавлять членов семьи и медицинскую информацию"
      });

      onFamilyCreated(data);
      setFormData({ family_name: '', tree_name: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Error creating family group:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать семейную группу",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Создать семейную группу</span>
          </DialogTitle>
          <DialogDescription>
            Создайте семейную группу для отслеживания медицинской истории и анализа наследственных рисков
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="family_name">Название семьи *</Label>
            <Input
              id="family_name"
              value={formData.family_name}
              onChange={(e) => handleInputChange('family_name', e.target.value)}
              placeholder="Например: Семья Ивановых"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tree_name">Название семейного дерева</Label>
            <Input
              id="tree_name"
              value={formData.tree_name}
              onChange={(e) => handleInputChange('tree_name', e.target.value)}
              placeholder="Оставьте пустым для автоматического заполнения"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Краткое описание группы (необязательно)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.family_name.trim()}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Создание...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Создать группу</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFamilyGroupModal;
