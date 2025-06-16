
import React, { useState } from 'react';
import { useDoctorAccessTokens } from "@/hooks/useDoctorAccessTokens";
import { Card, CardContent } from "@/components/ui/card";
import TokensHeader from "./TokensHeader";
import TokensEmptyState from "./TokensEmptyState";
import TokenCard from "./TokenCard";
import DoctorDataSharingModal from "./DoctorDataSharingModal";

const DoctorAccessTokens: React.FC = () => {
  const { tokens, loading, loadTokens, deleteToken } = useDoctorAccessTokens();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDeleteToken = async (tokenId: string) => {
    try {
      await deleteToken(tokenId);
    } catch (error) {
      console.error('Error deleting token:', error);
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
      <TokensHeader onCreateToken={handleCreateToken} />

      {tokens.length === 0 ? (
        <TokensEmptyState onCreateToken={handleCreateToken} />
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <TokenCard
              key={token.id}
              token={token}
              onDelete={handleDeleteToken}
            />
          ))}
        </div>
      )}

      <DoctorDataSharingModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onTokenCreated={loadTokens}
      />
    </div>
  );
};

export default DoctorAccessTokens;
