
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Plus } from "lucide-react";

interface TokensEmptyStateProps {
  onCreateToken: () => void;
}

const TokensEmptyState: React.FC<TokensEmptyStateProps> = ({ onCreateToken }) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Нет активных токенов
        </h3>
        <p className="text-gray-600 mb-4">
          Создайте токен доступа для безопасного обмена данными с врачом
        </p>
        <Button onClick={onCreateToken}>
          <Plus className="w-4 h-4 mr-2" />
          Создать первый токен
        </Button>
      </CardContent>
    </Card>
  );
};

export default TokensEmptyState;
