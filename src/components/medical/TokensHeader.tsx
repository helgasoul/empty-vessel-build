
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Plus } from "lucide-react";

interface TokensHeaderProps {
  onCreateToken: () => void;
}

const TokensHeader: React.FC<TokensHeaderProps> = ({ onCreateToken }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Доступ для врачей</span>
            </CardTitle>
            <CardDescription>
              Управляйте токенами доступа для врачей к вашим медицинским данным
            </CardDescription>
          </div>
          <Button onClick={onCreateToken}>
            <Plus className="w-4 h-4 mr-2" />
            Создать токен
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default TokensHeader;
