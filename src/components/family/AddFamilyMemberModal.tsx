
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  gender: string;
  date_of_birth: string;
  is_alive: boolean;
  notes: string;
  created_at: string;
}

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyGroupId: string;
  onMemberAdded: (member: FamilyMember) => void;
}

const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  familyGroupId,
  onMemberAdded
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    gender: '',
    date_of_birth: '',
    is_alive: true,
    notes: ''
  });

  const relationships = [
    'Мать', 'Отец', 'Сын', 'Дочь', 'Брат', 'Сестра',
    'Дедушка', 'Бабушка', 'Дядя', 'Тётя', 'Племянник', 'Племянница'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name.trim() || !formData.relationship) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert({
          family_group_id: familyGroupId,
          name: formData.name.trim(),
          relationship: formData.relationship,
          gender: formData.gender || null,
          date_of_birth: formData.date_of_birth || null,
          is_alive: formData.is_alive,
          notes: formData.notes.trim() || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Член семьи добавлен",
        description: `${formData.name} успешно добавлен в семейную группу.`
      });

      onMemberAdded(data);
      setFormData({
        name: '',
        relationship: '',
        gender: '',
        date_of_birth: '',
        is_alive: true,
        notes: ''
      });
    } catch (error) {
      console.error('Error adding family member:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить члена семьи.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      relationship: '',
      gender: '',
      date_of_birth: '',
      is_alive: true,
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить члена семьи</DialogTitle>
          <DialogDescription>
            Добавьте нового члена семьи для отслеживания медицинской информации
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Полное имя"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Родственная связь *</Label>
            <Select
              value={formData.relationship}
              onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите родственную связь" />
              </SelectTrigger>
              <SelectContent>
                {relationships.map((rel) => (
                  <SelectItem key={rel} value={rel.toLowerCase()}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Пол</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите пол" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Мужской</SelectItem>
                <SelectItem value="female">Женский</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Дата рождения</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_alive"
              checked={formData.is_alive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_alive: checked as boolean }))}
            />
            <Label htmlFor="is_alive">В живых</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Дополнительная информация (необязательно)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim() || !formData.relationship}>
              {loading ? 'Добавление...' : 'Добавить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFamilyMemberModal;
