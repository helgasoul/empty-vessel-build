
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FamilyGroup {
  id: string;
  family_name: string;
  description: string;
  created_by: string;
  created_at: string;
}

interface CreateFamilyGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFamilyCreated: (family: FamilyGroup) => void;
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
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.family_name.trim()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('family_groups')
        .insert({
          family_name: formData.family_name.trim(),
          description: formData.description.trim() || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Семейная группа создана",
        description: `Группа "${formData.family_name}" успешно создана.`
      });

      onFamilyCreated(data);
      setFormData({ family_name: '', description: '' });
    } catch (error) {
      console.error('Error creating family group:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать семейную группу.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ family_name: '', description: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создать семейную группу</DialogTitle>
          <DialogDescription>
            Создайте новую семейную группу для отслеживания медицинской информации
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="family_name">Название семьи *</Label>
            <Input
              id="family_name"
              value={formData.family_name}
              onChange={(e) => setFormData(prev => ({ ...prev, family_name: e.target.value }))}
              placeholder="Например: Семья Ивановых"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Краткое описание семейной группы (необязательно)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading || !formData.family_name.trim()}>
              {loading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFamilyGroupModal;
