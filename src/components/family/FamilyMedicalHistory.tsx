
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Construction } from "lucide-react";

interface FamilyMedicalHistoryProps {
  familyGroupId: string;
}

const FamilyMedicalHistory: React.FC<FamilyMedicalHistoryProps> = ({ familyGroupId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-600" />
          <span>Медицинская история семьи</span>
        </CardTitle>
        <CardDescription>
          Отслеживайте заболевания и медицинские состояния членов семьи
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 text-center">
        <Construction className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          В разработке
        </h3>
        <p className="text-gray-600">
          Функционал медицинской истории семьи будет доступен в ближайшее время
        </p>
      </CardContent>
    </Card>
  );
};

export default FamilyMedicalHistory;
