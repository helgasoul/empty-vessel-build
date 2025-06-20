
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import EnhancedFamilyDataBank from '@/components/family/EnhancedFamilyDataBank';

const FamilyData = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад в панель</span>
          </Button>
        </div>

        <EnhancedFamilyDataBank />
      </div>
    </div>
  );
};

export default FamilyData;
