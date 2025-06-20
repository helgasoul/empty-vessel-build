
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, AlertTriangle, Users, TrendingUp, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HereditaryRisk {
  id: string;
  condition_name: string;
  affected_members: string[];
  risk_level: string;
  inheritance_pattern?: string;
  age_of_onset_range?: string;
  prevention_recommendations: any[];
  screening_recommendations: any[];
  notes?: string;
  calculated_at: string;
}

interface FamilyHereditaryRisksProps {
  familyGroupId: string;
  familyMembers: Array<{
    id: string;
    name: string;
    relationship: string;
  }>;
}

const FamilyHereditaryRisks: React.FC<FamilyHereditaryRisksProps> = ({
  familyGroupId,
  familyMembers
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [risks, setRisks] = useState<HereditaryRisk[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newRisk, setNewRisk] = useState({
    condition_name: '',
    affected_members: [] as string[],
    risk_level: 'unknown',
    inheritance_pattern: '',
    age_of_onset_range: '',
    prevention_recommendations: [] as any[],
    screening_recommendations: [] as any[],
    notes: ''
  });

  const riskLevels = [
    { value: 'low', label: 'Низкий', color: 'bg-green-100 text-green-800' },
    { value: 'moderate', label: 'Умеренный', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Высокий', color: 'bg-orange-100 text-orange-800' },
    { value: 'very_high', label: 'Очень высокий', color: 'bg-red-100 text-red-800' },
    { value: 'unknown', label: 'Неизвестен', color: 'bg-gray-100 text-gray-800' }
  ];

  const inheritancePatterns = [
    { value: 'autosomal_dominant', label: 'Аутосомно-доминантный' },
    { value: 'autosomal_recessive', label: 'Аутосомно-рецессивный' },
    { value: 'x_linked', label: 'Х-сцепленный' },
    { value: 'multifactorial', label: 'Многофакторный' },
    { value: 'maternal', label: 'Материнский' }
  ];

  React.useEffect(() => {
    loadHereditaryRisks();
  }, [familyGroupId]);

  const loadHereditaryRisks = async () => {
    if (!familyGroupId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('family_hereditary_risks')
        .select('*')
        .eq('family_group_id', familyGroupId)
        .order('risk_level', { ascending: false });

      if (error) throw error;
      setRisks(data || []);
    } catch (error) {
      console.error('Error loading hereditary risks:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить наследственные риски",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRisk = async () => {
    if (!user || !newRisk.condition_name.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('family_hereditary_risks')
        .insert({
          ...newRisk,
          family_group_id: familyGroupId,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setRisks(prev => [data, ...prev]);
      setNewRisk({
        condition_name: '',
        affected_members: [],
        risk_level: 'unknown',
        inheritance_pattern: '',
        age_of_onset_range: '',
        prevention_recommendations: [],
        screening_recommendations: [],
        notes: ''
      });
      setIsAddModalOpen(false);

      toast({
        title: "Риск добавлен",
        description: "Наследственный риск успешно добавлен"
      });
    } catch (error) {
      console.error('Error adding hereditary risk:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить наследственный риск",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelConfig = (level: string) => {
    return riskLevels.find(r => r.value === level) || riskLevels[4];
  };

  const getAffectedMembersNames = (memberIds: string[]) => {
    return memberIds
      .map(id => familyMembers.find(m => m.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
      case 'very_high':
        return AlertTriangle;
      case 'moderate':
        return TrendingUp;
      default:
        return Shield;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Наследственные риски</h3>
          <p className="text-sm text-gray-600">
            Анализ генетических предрасположенностей в семье
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
              <Plus className="w-4 h-4 mr-2" />
              Добавить риск
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить наследственный риск</DialogTitle>
              <DialogDescription>
                Добавьте информацию о генетической предрасположенности
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Название заболевания *</Label>
                <Input
                  value={newRisk.condition_name}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, condition_name: e.target.value }))}
                  placeholder="Например: Сахарный диабет 2 типа"
                />
              </div>

              <div className="space-y-2">
                <Label>Затронутые члены семьи</Label>
                <div className="space-y-2">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={member.id}
                        checked={newRisk.affected_members.includes(member.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewRisk(prev => ({
                              ...prev,
                              affected_members: [...prev.affected_members, member.id]
                            }));
                          } else {
                            setNewRisk(prev => ({
                              ...prev,
                              affected_members: prev.affected_members.filter(id => id !== member.id)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={member.id}>
                        {member.name} ({member.relationship})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Уровень риска</Label>
                  <Select
                    value={newRisk.risk_level}
                    onValueChange={(value) => setNewRisk(prev => ({ ...prev, risk_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Тип наследования</Label>
                  <Select
                    value={newRisk.inheritance_pattern}
                    onValueChange={(value) => setNewRisk(prev => ({ ...prev, inheritance_pattern: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {inheritancePatterns.map((pattern) => (
                        <SelectItem key={pattern.value} value={pattern.value}>
                          {pattern.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Возраст проявления</Label>
                <Input
                  value={newRisk.age_of_onset_range}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, age_of_onset_range: e.target.value }))}
                  placeholder="Например: 40-60 лет"
                />
              </div>

              <div className="space-y-2">
                <Label>Заметки</Label>
                <Textarea
                  value={newRisk.notes}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Дополнительная информация о риске"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Отмена
                </Button>
                <Button 
                  onClick={handleAddRisk}
                  disabled={loading || !newRisk.condition_name.trim()}
                >
                  {loading ? 'Добавление...' : 'Добавить риск'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Список рисков */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Загрузка рисков...</p>
          </div>
        ) : risks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Наследственных рисков пока нет
              </h3>
              <p className="text-gray-600 mb-4">
                Добавьте информацию о генетических предрасположенностях семьи
              </p>
            </CardContent>
          </Card>
        ) : (
          risks.map((risk) => {
            const riskConfig = getRiskLevelConfig(risk.risk_level);
            const RiskIcon = getRiskIcon(risk.risk_level);
            
            return (
              <Card key={risk.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${riskConfig.color}`}>
                      <RiskIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{risk.condition_name}</h4>
                          {risk.affected_members.length > 0 && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Users className="w-3 h-3" />
                              <span>Затронуты: {getAffectedMembersNames(risk.affected_members)}</span>
                            </div>
                          )}
                        </div>
                        
                        <Badge className={riskConfig.color}>
                          {riskConfig.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {risk.inheritance_pattern && (
                          <div>
                            <span className="font-medium">Тип наследования:</span>
                            <p className="text-gray-600">
                              {inheritancePatterns.find(p => p.value === risk.inheritance_pattern)?.label}
                            </p>
                          </div>
                        )}
                        {risk.age_of_onset_range && (
                          <div>
                            <span className="font-medium">Возраст проявления:</span>
                            <p className="text-gray-600">{risk.age_of_onset_range}</p>
                          </div>
                        )}
                      </div>
                      
                      {risk.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Заметки:</span>
                          <p className="text-gray-600">{risk.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FamilyHereditaryRisks;
