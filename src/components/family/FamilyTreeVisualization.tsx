
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Heart, 
  User, 
  UserCheck, 
  UserX, 
  Calendar,
  Info,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  gender?: string;
  date_of_birth?: string;
  birth_year?: number;
  medical_notes?: string;
  is_alive: boolean;
  status: string;
  avatar_url?: string;
}

interface MedicalEvent {
  id: string;
  event_type: string;
  title: string;
  event_date?: string;
  severity?: string;
}

interface FamilyTreeVisualizationProps {
  familyGroupId: string;
  familyMembers: FamilyMember[];
}

const FamilyTreeVisualization: React.FC<FamilyTreeVisualizationProps> = ({
  familyGroupId,
  familyMembers
}) => {
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [memberEvents, setMemberEvents] = useState<MedicalEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMemberEvents = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('family_medical_events')
        .select('id, event_type, title, event_date, severity')
        .eq('family_member_id', memberId)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setMemberEvents(data || []);
    } catch (error) {
      console.error('Error loading member events:', error);
    }
  };

  const handleMemberClick = async (member: FamilyMember) => {
    setSelectedMember(member);
    await loadMemberEvents(member.id);
    setIsModalOpen(true);
  };

  const getMemberIcon = (member: FamilyMember) => {
    if (!member.is_alive) return UserX;
    if (member.status === 'active') return UserCheck;
    return User;
  };

  const getMemberColor = (member: FamilyMember) => {
    if (!member.is_alive) return 'bg-gray-100 text-gray-600 border-gray-300';
    if (member.medical_notes) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  const getRelationshipPosition = (relationship: string) => {
    const positions = {
      'мать': { generation: 0, side: 'left' },
      'отец': { generation: 0, side: 'right' },
      'сын': { generation: 2, side: 'left' },
      'дочь': { generation: 2, side: 'right' },
      'брат': { generation: 1, side: 'left' },
      'сестра': { generation: 1, side: 'right' },
      'дедушка': { generation: -1, side: 'left' },
      'бабушка': { generation: -1, side: 'right' },
      'дядя': { generation: 0, side: 'far-left' },
      'тётя': { generation: 0, side: 'far-right' },
    };
    return positions[relationship.toLowerCase()] || { generation: 1, side: 'center' };
  };

  const organizeByGeneration = (members: FamilyMember[]) => {
    const generations: { [key: number]: FamilyMember[] } = {};
    
    members.forEach(member => {
      const pos = getRelationshipPosition(member.relationship);
      if (!generations[pos.generation]) {
        generations[pos.generation] = [];
      }
      generations[pos.generation].push(member);
    });

    return generations;
  };

  const generationLabels = {
    '-1': 'Прародители',
    '0': 'Родители',
    '1': 'Ваше поколение',
    '2': 'Дети'
  };

  const generations = organizeByGeneration(familyMembers);
  const sortedGenerations = Object.keys(generations)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(key => ({ generation: parseInt(key), members: generations[parseInt(key)] }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Семейное дерево</h3>
          <p className="text-sm text-gray-600">
            Визуальное представление семейных связей и медицинской информации
          </p>
        </div>
      </div>

      {/* Legend */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Здоров</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
              <span>Есть медицинские заметки</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Ушёл из жизни</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Tree */}
      <div className="space-y-8">
        {sortedGenerations.map(({ generation, members }) => (
          <Card key={generation} className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                {generationLabels[generation.toString()] || `Поколение ${generation}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {members.map((member) => {
                  const MemberIcon = getMemberIcon(member);
                  const memberColor = getMemberColor(member);
                  
                  return (
                    <div
                      key={member.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${memberColor}`}
                      onClick={() => handleMemberClick(member)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${memberColor}`}>
                              <MemberIcon className="w-5 h-5" />
                            </div>
                          )}
                          {member.medical_notes && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                              <AlertCircle className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{member.name}</h4>
                          <p className="text-xs opacity-75">{member.relationship}</p>
                          {member.birth_year && (
                            <p className="text-xs opacity-60">
                              {member.birth_year} г.р.
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-1">
                        <Badge 
                          size="sm"
                          className={
                            member.is_alive 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                          }
                        >
                          {member.is_alive ? 'В живых' : 'Ушёл из жизни'}
                        </Badge>
                        {member.gender && (
                          <Badge size="sm" variant="outline">
                            {member.gender === 'male' ? 'М' : 'Ж'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{selectedMember.name}</span>
                </DialogTitle>
                <DialogDescription>
                  {selectedMember.relationship} • {selectedMember.gender === 'male' ? 'Мужчина' : 'Женщина'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Basic Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Статус:</span>
                        <Badge className={selectedMember.is_alive ? 'bg-green-100 text-green-800 ml-2' : 'bg-gray-100 text-gray-800 ml-2'}>
                          {selectedMember.is_alive ? 'В живых' : 'Ушёл из жизни'}
                        </Badge>
                      </div>
                      {selectedMember.birth_year && (
                        <div>
                          <span className="font-medium">Год рождения:</span>
                          <span className="ml-2">{selectedMember.birth_year}</span>
                        </div>
                      )}
                      {selectedMember.date_of_birth && (
                        <div>
                          <span className="font-medium">Дата рождения:</span>
                          <span className="ml-2">{new Date(selectedMember.date_of_birth).toLocaleDateString('ru-RU')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Notes */}
                {selectedMember.medical_notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Медицинские заметки</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{selectedMember.medical_notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Medical Events */}
                {memberEvents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Медицинские события</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {memberEvents.slice(0, 5).map((event) => (
                          <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.title}</p>
                              <p className="text-xs text-gray-600">
                                {event.event_date && new Date(event.event_date).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            {event.severity && (
                              <Badge size="sm" variant="outline">
                                {event.severity}
                              </Badge>
                            )}
                          </div>
                        ))}
                        {memberEvents.length > 5 && (
                          <p className="text-xs text-gray-500 text-center">
                            И ещё {memberEvents.length - 5} событий...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Закрыть
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamilyTreeVisualization;
