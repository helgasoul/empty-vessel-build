import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Heart, 
  FileText, 
  Settings, 
  Shield, 
  TrendingUp,
  Activity,
  Calendar,
  Archive
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Импортируем существующие компоненты
import FamilyGroupList from './FamilyGroupList';
import FamilyMembersList from './FamilyMembersList';
import FamilyMedicalHistory from './FamilyMedicalHistory';
import FamilyDocuments from './FamilyDocuments';
import FamilyAccessManagement from './FamilyAccessManagement';

// Импортируем новые компоненты
import FamilyMedicalEvents from './FamilyMedicalEvents';
import FamilyHereditaryRisks from './FamilyHereditaryRisks';

interface FamilyGroup {
  id: string;
  family_name: string;
  description?: string;
  tree_name?: string;
  visibility_settings: any;
  created_at: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  gender?: string;
  date_of_birth?: string;
  birth_year?: number;
  medical_notes?: string;
  visibility_scope: string;
  shared_data_types: string[];
  status: string;
  avatar_url?: string;
  consent_status: boolean;
  is_alive: boolean;
  notes?: string;
}

const EnhancedFamilyDataBank: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<FamilyGroup | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadFamilyGroups();
  }, [user]);

  useEffect(() => {
    if (selectedGroup) {
      loadFamilyMembers();
    }
  }, [selectedGroup]);

  const loadFamilyGroups = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('family_groups')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFamilyGroups(data || []);
      if (data && data.length > 0 && !selectedGroup) {
        setSelectedGroup(data[0]);
      }
    } catch (error) {
      console.error('Error loading family groups:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить семейные группы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFamilyMembers = async () => {
    if (!selectedGroup) return;

    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('family_group_id', selectedGroup.id)
        .order('relationship');

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error loading family members:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить членов семьи",
        variant: "destructive"
      });
    }
  };

  const refreshData = () => {
    loadFamilyGroups();
    if (selectedGroup) {
      loadFamilyMembers();
    }
  };

  const handleGroupSelect = (group: FamilyGroup) => {
    setSelectedGroup(group);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка семейных данных...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Users className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold font-montserrat bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Семейный банк данных
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto font-roboto text-lg">
            Управляйте медицинской информацией семьи, отслеживайте наследственные риски 
            и создавайте персонализированные планы здоровья для всех членов семьи.
          </p>
        </div>

        {/* Family Group Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <span>Выберите семейную группу</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FamilyGroupList 
              familyGroups={familyGroups}
              selectedFamily={selectedGroup}
              onSelectFamily={handleGroupSelect}
              onFamilyUpdated={refreshData}
            />
          </CardContent>
        </Card>

        {selectedGroup && (
          <>
            {/* Selected Group Info */}
            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-purple-800">
                      {selectedGroup.tree_name || selectedGroup.family_name}
                    </h2>
                    <p className="text-purple-600">{selectedGroup.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-purple-600">
                      <span>Членов семьи: {familyMembers.length}</span>
                      <span>•</span>
                      <span>
                        Активных: {familyMembers.filter(m => m.status === 'active').length}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    Активная группа
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm border border-purple-200">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span className="hidden md:inline">Обзор</span>
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline">Члены</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden md:inline">События</span>
                </TabsTrigger>
                <TabsTrigger value="risks" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden md:inline">Риски</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <Archive className="w-4 h-4" />
                  <span className="hidden md:inline">История</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden md:inline">Документы</span>
                </TabsTrigger>
                <TabsTrigger value="access" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden md:inline">Доступ</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Всего членов</p>
                          <p className="text-2xl font-bold text-purple-600">{familyMembers.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 backdrop-blur-sm border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                          <Heart className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Живых</p>
                          <p className="text-2xl font-bold text-green-600">
                            {familyMembers.filter(m => m.is_alive).length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">С согласием</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {familyMembers.filter(m => m.consent_status).length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl">
                          <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">С заметками</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {familyMembers.filter(m => m.medical_notes).length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Недавние обновления</CardTitle>
                      <CardDescription>Последние изменения в семейных данных</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {familyMembers.slice(0, 3).map((member) => (
                          <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-gray-600">{member.relationship}</p>
                            </div>
                            <Badge 
                              className={
                                member.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {member.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Быстрые действия</CardTitle>
                      <CardDescription>Часто используемые функции</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('members')}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Добавить члена семьи
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('events')}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Записать медицинское событие
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('risks')}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Анализировать риски
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('documents')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Загрузить документ
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="members">
                <FamilyMembersList 
                  familyGroupId={selectedGroup.id}
                />
              </TabsContent>

              <TabsContent value="events">
                <FamilyMedicalEvents 
                  familyGroupId={selectedGroup.id}
                  familyMembers={familyMembers}
                />
              </TabsContent>

              <TabsContent value="risks">
                <FamilyHereditaryRisks 
                  familyGroupId={selectedGroup.id}
                  familyMembers={familyMembers}
                />
              </TabsContent>

              <TabsContent value="history">
                <FamilyMedicalHistory familyGroupId={selectedGroup.id} />
              </TabsContent>

              <TabsContent value="documents">
                <FamilyDocuments familyGroupId={selectedGroup.id} />
              </TabsContent>

              <TabsContent value="access">
                <FamilyAccessManagement 
                  familyGroupId={selectedGroup.id}
                  familyGroupName={selectedGroup.family_name}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedFamilyDataBank;
