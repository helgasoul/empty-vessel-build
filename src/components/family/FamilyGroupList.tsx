
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface FamilyGroup {
  id: string;
  family_name: string;
  description: string;
  created_by: string;
  created_at: string;
}

interface FamilyGroupListProps {
  familyGroups: FamilyGroup[];
  selectedFamily: FamilyGroup | null;
  onSelectFamily: (family: FamilyGroup) => void;
  onFamilyUpdated: () => void;
}

const FamilyGroupList: React.FC<FamilyGroupListProps> = ({
  familyGroups,
  selectedFamily,
  onSelectFamily,
  onFamilyUpdated
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Семейные группы</CardTitle>
        <CardDescription>
          Выберите семью для просмотра информации
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {familyGroups.map((family) => (
          <div
            key={family.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedFamily?.id === family.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectFamily(family)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">
                  {family.family_name}
                </span>
              </div>
            </div>
            
            {family.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {family.description}
              </p>
            )}
            
            <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>
                {format(new Date(family.created_at), 'dd MMM yyyy', { locale: ru })}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FamilyGroupList;
