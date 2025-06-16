
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, FileText, Heart, Upload, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FamilyGroupList from "./FamilyGroupList";
import CreateFamilyGroupModal from "./CreateFamilyGroupModal";
import FamilyMembersList from "./FamilyMembersList";
import FamilyMedicalHistory from "./FamilyMedicalHistory";
import FamilyDocuments from "./FamilyDocuments";
import FamilyAccessManagement from "./FamilyAccessManagement";

interface FamilyGroup {
  id: string;
  family_name: string;
  description: string;
  created_by: string;
  created_at: string;
}

const FamilyDataBank: React.FC = () => {
  const { user } = useAuth();
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<FamilyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadFamilyGroups();
    }
  }, [user]);

  const loadFamilyGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('family_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilyGroups(data || []);
      
      // Автоматически выбираем первую семью, если она есть
      if (data && data.length > 0 && !selectedFamily) {
        setSelectedFamily(data[0]);
      }
    } catch (error) {
      console.error('Error loading family groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFamilyCreated = (newFamily: FamilyGroup) => {
    setFamilyGroups(prev => [newFamily, ...prev]);
    setSelectedFamily(newFamily);
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Семейный банк данных</span>
              </CardTitle>
              <CardDescription>
                Управляйте медицинской информацией вашей семьи для лучшего понимания наследственных рисков
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать семейную группу
            </Button>
          </div>
        </CardHeader>
      </Card>

      {familyGroups.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет семейных групп
            </h3>
            <p className="text-gray-600 mb-4">
              Создайте семейную группу для отслеживания медицинской истории вашей семьи
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать первую группу
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FamilyGroupList
              familyGroups={familyGroups}
              selectedFamily={selectedFamily}
              onSelectFamily={setSelectedFamily}
              onFamilyUpdated={loadFamilyGroups}
            />
          </div>

          <div className="lg:col-span-3">
            {selectedFamily ? (
              <Tabs defaultValue="members" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="members" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Члены семьи</span>
                  </TabsTrigger>
                  <TabsTrigger value="medical" className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Медицинская история</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Документы</span>
                  </TabsTrigger>
                  <TabsTrigger value="access" className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Доступ</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members">
                  <FamilyMembersList familyGroupId={selectedFamily.id} />
                </TabsContent>

                <TabsContent value="medical">
                  <FamilyMedicalHistory familyGroupId={selectedFamily.id} />
                </TabsContent>

                <TabsContent value="documents">
                  <FamilyDocuments familyGroupId={selectedFamily.id} />
                </TabsContent>

                <TabsContent value="access">
                  <FamilyAccessManagement 
                    familyGroupId={selectedFamily.id}
                    familyGroupName={selectedFamily.family_name}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Выберите семейную группу
                  </h3>
                  <p className="text-gray-600">
                    Выберите семейную группу слева для просмотра и редактирования информации
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <CreateFamilyGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onFamilyCreated={handleFamilyCreated}
      />
    </div>
  );
};

export default FamilyDataBank;
