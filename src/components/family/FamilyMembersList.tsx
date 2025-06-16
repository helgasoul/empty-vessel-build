
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Calendar, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import AddFamilyMemberModal from "./AddFamilyMemberModal";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  gender: string;
  date_of_birth: string;
  is_alive: boolean;
  notes: string;
  created_at: string;
}

interface FamilyMembersListProps {
  familyGroupId: string;
}

const FamilyMembersList: React.FC<FamilyMembersListProps> = ({ familyGroupId }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (familyGroupId) {
      loadFamilyMembers();
    }
  }, [familyGroupId]);

  const loadFamilyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('family_group_id', familyGroupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading family members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberAdded = (newMember: FamilyMember) => {
    setMembers(prev => [newMember, ...prev]);
    setShowAddModal(false);
  };

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  };

  const getRelationshipColor = (relationship: string) => {
    const colors: Record<string, string> = {
      'мать': 'bg-pink-100 text-pink-800',
      'отец': 'bg-blue-100 text-blue-800',
      'сын': 'bg-green-100 text-green-800',
      'дочь': 'bg-purple-100 text-purple-800',
      'брат': 'bg-cyan-100 text-cyan-800',
      'сестра': 'bg-orange-100 text-orange-800',
      'дедушка': 'bg-gray-100 text-gray-800',
      'бабушка': 'bg-red-100 text-red-800'
    };
    return colors[relationship.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
                <User className="w-5 h-5 text-blue-600" />
                <span>Члены семьи</span>
              </CardTitle>
              <CardDescription>
                Управляйте информацией о членах вашей семьи
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить члена семьи
            </Button>
          </div>
        </CardHeader>
      </Card>

      {members.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет членов семьи
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте членов семьи для отслеживания их медицинской истории
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить первого члена семьи
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getRelationshipColor(member.relationship)}>
                          {member.relationship}
                        </Badge>
                        {member.gender && (
                          <Badge variant="secondary">
                            {member.gender === 'male' ? 'Мужской' : 'Женский'}
                          </Badge>
                        )}
                        {!member.is_alive && (
                          <Badge variant="destructive">
                            Покойный
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-600">
                    {member.date_of_birth && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {calculateAge(member.date_of_birth)} лет
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {member.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{member.notes}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Добавлен {format(new Date(member.created_at), 'dd MMM yyyy', { locale: ru })}
                  </span>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Медицинская история
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddFamilyMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        familyGroupId={familyGroupId}
        onMemberAdded={handleMemberAdded}
      />
    </div>
  );
};

export default FamilyMembersList;
