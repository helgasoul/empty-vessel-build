
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users2, Shield } from "lucide-react";
import { useFamilyAccessTokens } from "@/hooks/useFamilyAccessTokens";
import FamilyAccessTokenCard from "./FamilyAccessTokenCard";
import CreateFamilyAccessTokenModal from "./CreateFamilyAccessTokenModal";

interface FamilyAccessManagementProps {
  familyGroupId: string;
  familyGroupName: string;
}

const FamilyAccessManagement: React.FC<FamilyAccessManagementProps> = ({
  familyGroupId,
  familyGroupName
}) => {
  const { tokens, loading, loadTokens, createToken, deleteToken } = useFamilyAccessTokens(familyGroupId);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDeleteToken = async (tokenId: string) => {
    try {
      await deleteToken(tokenId);
    } catch (error) {
      console.error('Error deleting family access token:', error);
    }
  };

  const handleCreateToken = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Семейный доступ</span>
              </CardTitle>
              <CardDescription>
                Управляйте доступом членов семьи к данным группы "{familyGroupName}"
              </CardDescription>
            </div>
            <Button onClick={handleCreateToken}>
              <Plus className="w-4 h-4 mr-2" />
              Пригласить члена семьи
            </Button>
          </div>
        </CardHeader>
      </Card>

      {tokens.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет приглашений
            </h3>
            <p className="text-gray-600 mb-4">
              Создайте токен доступа для приглашения членов семьи к этой группе
            </p>
            <Button onClick={handleCreateToken}>
              <Plus className="w-4 h-4 mr-2" />
              Создать первое приглашение
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <FamilyAccessTokenCard
              key={token.id}
              token={token}
              onDelete={handleDeleteToken}
            />
          ))}
        </div>
      )}

      <CreateFamilyAccessTokenModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        familyGroupId={familyGroupId}
        familyGroupName={familyGroupName}
        onTokenCreated={loadTokens}
        createToken={createToken}
      />
    </div>
  );
};

export default FamilyAccessManagement;
