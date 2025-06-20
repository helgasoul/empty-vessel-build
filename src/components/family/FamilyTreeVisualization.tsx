
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  Heart, 
  User, 
  UserCheck, 
  UserX, 
  Calendar,
  Info,
  AlertCircle,
  Eye,
  Plus,
  Minus
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');

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
    if (!member.is_alive) return 'bg-gray-200 border-gray-400 text-gray-700';
    if (member.medical_notes) return 'bg-orange-100 border-orange-400 text-orange-800';
    return 'bg-blue-100 border-blue-400 text-blue-800';
  };

  const getGenderSymbol = (gender?: string) => {
    if (gender === 'male') return '♂';
    if (gender === 'female') return '♀';
    return '';
  };

  const getRelationshipPosition = (relationship: string) => {
    const positions = {
      'дедушка': { generation: -2, side: 'left', order: 1 },
      'бабушка': { generation: -2, side: 'right', order: 2 },
      'прадедушка': { generation: -3, side: 'left', order: 1 },
      'прабабушка': { generation: -3, side: 'right', order: 2 },
      'отец': { generation: -1, side: 'left', order: 1 },
      'мать': { generation: -1, side: 'right', order: 2 },
      'дядя': { generation: -1, side: 'far-left', order: 3 },
      'тётя': { generation: -1, side: 'far-right', order: 4 },
      'я': { generation: 0, side: 'center', order: 1 },
      'муж': { generation: 0, side: 'center-left', order: 2 },
      'жена': { generation: 0, side: 'center-right', order: 3 },
      'брат': { generation: 0, side: 'left', order: 4 },
      'сестра': { generation: 0, side: 'right', order: 5 },
      'сын': { generation: 1, side: 'left', order: 1 },
      'дочь': { generation: 1, side: 'right', order: 2 },
      'внук': { generation: 2, side: 'left', order: 1 },
      'внучка': { generation: 2, side: 'right', order: 2 },
    };
    return positions[relationship.toLowerCase()] || { generation: 0, side: 'center', order: 10 };
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

    // Сортируем членов семьи в каждом поколении по порядку
    Object.keys(generations).forEach(gen => {
      generations[parseInt(gen)].sort((a, b) => {
        const posA = getRelationshipPosition(a.relationship);
        const posB = getRelationshipPosition(b.relationship);
        return posA.order - posB.order;
      });
    });

    return generations;
  };

  const generationLabels = {
    '-3': 'Прапрародители',
    '-2': 'Прародители',
    '-1': 'Родители',
    '0': 'Ваше поколение',
    '1': 'Дети',
    '2': 'Внуки'
  };

  const generations = organizeByGeneration(familyMembers);
  const sortedGenerations = Object.keys(generations)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(key => ({ generation: parseInt(key), members: generations[parseInt(key)] }));

  const TreeMemberCard = ({ member }: { member: FamilyMember }) => {
    const MemberIcon = getMemberIcon(member);
    const memberColor = getMemberColor(member);
    const age = member.birth_year ? new Date().getFullYear() - member.birth_year : null;
    
    return (
      <div
        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${memberColor} min-w-[180px] max-w-[200px]`}
        onClick={() => handleMemberClick(member)}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Медицинский индикатор */}
        {member.medical_notes && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Аватар или иконка */}
        <div className="flex flex-col items-center space-y-2">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-md">
              <MemberIcon className="w-8 h-8 text-gray-600" />
            </div>
          )}
          
          {/* Имя и возраст */}
          <div className="text-center">
            <h4 className="font-semibold text-sm leading-tight">{member.name}</h4>
            <div className="flex items-center justify-center space-x-1 text-xs opacity-75">
              <span>{member.relationship}</span>
              {member.gender && (
                <span className="font-bold">{getGenderSymbol(member.gender)}</span>
              )}
            </div>
            {age && (
              <p className="text-xs opacity-60">{age} лет</p>
            )}
          </div>
        </div>

        {/* Статусы */}
        <div className="mt-2 flex flex-wrap gap-1 justify-center">
          <Badge 
            className={`text-xs px-2 py-1 ${
              member.is_alive 
                ? 'bg-green-200 text-green-800 border-green-300' 
                : 'bg-gray-200 text-gray-600 border-gray-300'
            }`}
          >
            {member.is_alive ? 'В живых' : 'Покойный'}
          </Badge>
        </div>

        {/* Связующие линии (для будущего расширения) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-px h-4 bg-gray-400 opacity-50"></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с управлением */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Семейное дерево</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Визуальное представление семейных связей и медицинской информации
          </p>
        </div>
        
        {/* Панель управления */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tree')}
              className="px-3 py-1 text-xs"
            >
              Дерево
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3 py-1 text-xs"
            >
              Сетка
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.1))}
              disabled={zoomLevel <= 0.7}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[50px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
              disabled={zoomLevel >= 1.5}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Легенда */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
              <span>Здоров</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-100 border-2 border-orange-400 rounded"></div>
              <span>Есть медицинские заметки</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded"></div>
              <span>Покойный</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-2 h-2 text-white" />
              </div>
              <span>Требует внимания</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Семейное дерево */}
      {familyMembers.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет членов семьи
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте членов семьи для создания семейного дерева
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 overflow-x-auto">
          {viewMode === 'tree' ? (
            /* Древовидное представление */
            <div className="space-y-12">
              {sortedGenerations.map(({ generation, members }) => (
                <div key={generation} className="relative">
                  {/* Заголовок поколения */}
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 bg-white/80 inline-block px-4 py-2 rounded-full border-2 border-purple-200">
                      {generationLabels[generation.toString()] || `Поколение ${generation}`}
                    </h4>
                  </div>
                  
                  {/* Члены поколения */}
                  <div className="flex flex-wrap justify-center gap-6 min-h-[200px] items-center">
                    {members.map((member) => (
                      <TreeMemberCard key={member.id} member={member} />
                    ))}
                  </div>
                  
                  {/* Соединительные линии между поколениями */}
                  {generation < Math.max(...sortedGenerations.map(g => g.generation)) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 w-px h-12 bg-gray-400 opacity-50"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Сеточное представление */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {familyMembers.map((member) => (
                <TreeMemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Модальное окно с деталями члена семьи */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <span>{selectedMember.name}</span>
                    {selectedMember.gender && (
                      <span className="text-lg">{getGenderSymbol(selectedMember.gender)}</span>
                    )}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  {selectedMember.relationship} • {selectedMember.birth_year && `${new Date().getFullYear() - selectedMember.birth_year} лет`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Основная информация */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Статус:</span>
                        <Badge className={`ml-2 ${selectedMember.is_alive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedMember.is_alive ? 'В живых' : 'Покойный'}
                        </Badge>
                      </div>
                      {selectedMember.birth_year && (
                        <div>
                          <span className="font-medium text-gray-700">Год рождения:</span>
                          <span className="ml-2">{selectedMember.birth_year}</span>
                        </div>
                      )}
                      {selectedMember.date_of_birth && (
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">Дата рождения:</span>
                          <span className="ml-2">{new Date(selectedMember.date_of_birth).toLocaleDateString('ru-RU')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Медицинские заметки */}
                {selectedMember.medical_notes && (
                  <Card className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span>Медицинские заметки</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{selectedMember.medical_notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Медицинские события */}
                {memberEvents.length > 0 && (
                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>Медицинские события</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {memberEvents.slice(0, 5).map((event) => (
                          <div key={event.id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                            <Heart className="w-4 h-4 text-purple-500 shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.title}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                                {event.event_date && (
                                  <span>{new Date(event.event_date).toLocaleDateString('ru-RU')}</span>
                                )}
                                {event.severity && (
                                  <Badge variant="outline" className="text-xs">
                                    {event.severity}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {memberEvents.length > 5 && (
                          <p className="text-xs text-gray-500 text-center py-2">
                            И ещё {memberEvents.length - 5} событий...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Закрыть
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Подробнее
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
