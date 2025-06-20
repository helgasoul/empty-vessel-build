
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Activity, FileText, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BasicInfoTab from "./BasicInfoTab";
import MedicalInfoTab from "./MedicalInfoTab";
import HealthMetricsTab from "./HealthMetricsTab";
import HealthRecordsTab from "./HealthRecordsTab";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  gender?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  occupation?: string;
  education_level?: string;
  marital_status?: string;
  blood_type?: string;
  height_cm?: number;
  weight_kg?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  lifestyle_factors?: any;
  chronic_conditions?: any[];
  allergies?: any[];
  medications?: any[];
  vaccinations?: any[];
  genetic_predispositions?: any[];
  family_history_notes?: string;
  last_medical_checkup?: string;
  preferred_doctor?: string;
  insurance_info?: string;
  is_alive: boolean;
  notes?: string;
  medical_notes?: string;
  created_at: string;
  updated_at: string;
}

interface FamilyMemberExtendedProfileProps {
  memberId: string;
  onBack: () => void;
}

const FamilyMemberExtendedProfile: React.FC<FamilyMemberExtendedProfileProps> = ({
  memberId,
  onBack
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    loadMemberData();
  }, [memberId]);

  const loadMemberData = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (error) throw error;
      setMember(data);
    } catch (error) {
      console.error('Error loading member data:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные члена семьи",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (updates: Partial<FamilyMember>) => {
    if (!member || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('family_members')
        .update(updates)
        .eq('id', memberId);

      if (error) throw error;

      setMember(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Успешно",
        description: "Информация обновлена"
      });
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить информацию",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка профиля...</p>
        </CardContent>
      </Card>
    );
  }

  if (!member) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Член семьи не найден
          </h3>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к списку
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад</span>
              </Button>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <Badge className="bg-purple-100 text-purple-800">
                    {member.relationship}
                  </Badge>
                  {member.date_of_birth && (
                    <span className="text-gray-600">
                      {calculateAge(member.date_of_birth)} лет
                    </span>
                  )}
                  {!member.is_alive && (
                    <Badge variant="destructive">Покойный</Badge>
                  )}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-purple-200">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden md:inline">Основное</span>
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span className="hidden md:inline">Здоровье</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="hidden md:inline">Показатели</span>
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Записи</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <BasicInfoTab 
            member={member}
            onUpdate={updateMember}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <MedicalInfoTab 
            member={member}
            onUpdate={updateMember}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <HealthMetricsTab memberId={memberId} />
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <HealthRecordsTab memberId={memberId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamilyMemberExtendedProfile;
