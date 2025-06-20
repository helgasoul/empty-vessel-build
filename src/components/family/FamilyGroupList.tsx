
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, MoreVertical, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateFamilyGroupModal from './CreateFamilyGroupModal';

interface DatabaseFamilyGroup {
  id: string;
  family_name: string;
  description?: string;
  tree_name?: string;
  created_by: string;
  visibility_settings: any;
  created_at: string;
  updated_at: string;
}

interface FamilyGroupListProps {
  familyGroups: DatabaseFamilyGroup[];
  selectedFamily: DatabaseFamilyGroup | null;
  onSelectFamily: (family: DatabaseFamilyGroup) => void;
  onFamilyUpdated: () => void;
}

const FamilyGroupList: React.FC<FamilyGroupListProps> = ({
  familyGroups,
  selectedFamily,
  onSelectFamily,
  onFamilyUpdated
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleFamilyCreated = (newFamily: any) => {
    onFamilyUpdated();
    setShowCreateModal(false);
  };

  if (familyGroups.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Нет семейных групп
        </h3>
        <p className="text-gray-600 mb-4">
          Создайте семейную группу для отслеживания медицинской истории вашей семьи
        </p>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать группу
        </Button>
        <CreateFamilyGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onFamilyCreated={handleFamilyCreated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Семейные группы</h3>
        <Button size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать группу
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyGroups.map((group) => (
          <Card 
            key={group.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedFamily?.id === group.id 
                ? 'ring-2 ring-purple-500 bg-purple-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectFamily(group)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {group.tree_name || group.family_name}
                  </CardTitle>
                  {group.description && (
                    <CardDescription className="mt-1">
                      {group.description}
                    </CardDescription>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(group.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <Badge 
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Активная
                </Badge>
                
                {selectedFamily?.id === group.id && (
                  <Badge className="bg-purple-100 text-purple-800">
                    Выбрана
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateFamilyGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onFamilyCreated={handleFamilyCreated}
      />
    </div>
  );
};

export default FamilyGroupList;
