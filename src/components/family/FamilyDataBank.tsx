
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, FileText, Heart, Shield, Brain } from "lucide-react";
import { useFamilyGroups } from "@/hooks/useFamilyGroups";
import FamilyGroupList from "./FamilyGroupList";
import CreateFamilyGroupModal from "./CreateFamilyGroupModal";
import FamilyMembersList from "./FamilyMembersList";
import FamilyMedicalHistory from "./FamilyMedicalHistory";
import FamilyDocuments from "./FamilyDocuments";
import FamilyAccessManagement from "./FamilyAccessManagement";
import FamilyAIRiskAnalysis from "./FamilyAIRiskAnalysis";

const FamilyDataBank: React.FC = () => {
  const { familyGroups, loading, createFamilyGroup } = useFamilyGroups();
  const [selectedFamily, setSelectedFamily] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Автоматически выбираем первую семью, если она есть
    if (familyGroups.length > 0 && !selectedFamily) {
      setSelectedFamily(familyGroups[0]);
    }
  }, [familyGroups, selectedFamily]);

  const handleFamilyCreated = async (familyData: any) => {
    try {
      const newFamily = await createFamilyGroup(familyData);
      setSelectedFamily(newFamily);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating family group:', error);
    }
  };

  const handleSelectFamily = (family: any) => {
    setSelectedFamily(family);
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
              onSelectFamily={handleSelectFamily}
              onFamilyUpdated={() => {}}
            />
          </div>

          <div className="lg:col-span-3">
            {selectedFamily ? (
              <Tabs defaultValue="members" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="members" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Члены семьи</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai-analysis" className="flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <span>AI Анализ</span>
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

                <TabsContent value="ai-analysis">
                  <FamilyAIRiskAnalysis 
                    familyGroupId={selectedFamily.id} 
                    familyMembers={[]}
                  />
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
