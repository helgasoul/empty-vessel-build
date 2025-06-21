
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, FileText, Heart, Shield, Brain, Database, Search, Filter, Upload, Download, Activity } from "lucide-react";
import { useFamilyGroups } from "@/hooks/useFamilyGroups";
import FamilyGroupList from "./FamilyGroupList";
import CreateFamilyGroupModal from "./CreateFamilyGroupModal";
import FamilyMembersList from "./FamilyMembersList";
import FamilyMedicalHistory from "./FamilyMedicalHistory";
import FamilyDocuments from "./FamilyDocuments";
import FamilyAccessManagement from "./FamilyAccessManagement";
import FamilyAIRiskAnalysis from "./FamilyAIRiskAnalysis";
import BackButton from '@/components/ui/back-button';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white py-20">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <BackButton fallbackPath="/dashboard" className="mb-6 bg-white/20 hover:bg-white/30 text-white border-white/30" />
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Database className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Семейный банк данных
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Создайте полную медицинскую историю вашей семьи для точного анализа генетических рисков
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{familyGroups.length}</div>
              <div className="text-sm text-gray-600">Семейных групп</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Медицинских записей</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Выявленных рисков</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Точность анализа</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {familyGroups.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Нет семейных групп
              </h3>
              <p className="text-gray-600 mb-6">
                Создайте семейную группу для отслеживания медицинской истории вашей семьи
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать первую группу
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-900">
                    <Plus className="w-5 h-5 mr-2" />
                    Быстрые действия
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Новая семейная группа
                  </Button>
                  <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Загрузить данные
                  </Button>
                  <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт данных
                  </Button>
                </CardContent>
              </Card>

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
                  <TabsList className="grid w-full grid-cols-5 bg-white/95 backdrop-blur-sm">
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
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
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
      </div>

      <CreateFamilyGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onFamilyCreated={handleFamilyCreated}
      />
    </div>
  );
};

export default FamilyDataBank;
