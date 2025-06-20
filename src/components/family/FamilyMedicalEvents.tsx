import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, User, AlertCircle, Shield, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface FamilyMedicalEvent {
  id: string;
  family_member_id: string;
  event_type: string;
  title: string;
  description?: string;
  event_date?: string;
  age_at_event?: number;
  severity?: string;
  treatment?: string;
  outcome?: string;
  verified_by_doctor: boolean;
  doctor_name?: string;
  clinic_name?: string;
  notes?: string;
  tags: string[];
  created_at: string;
  family_members: {
    name: string;
    relationship: string;
  };
}

interface FamilyMedicalEventsProps {
  familyGroupId: string;
  familyMembers: Array<{
    id: string;
    name: string;
    relationship: string;
  }>;
}

const FamilyMedicalEvents: React.FC<FamilyMedicalEventsProps> = ({
  familyGroupId,
  familyMembers
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<FamilyMedicalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('');

  const [newEvent, setNewEvent] = useState({
    family_member_id: '',
    event_type: '',
    title: '',
    description: '',
    event_date: '',
    age_at_event: '',
    severity: '',
    treatment: '',
    outcome: '',
    verified_by_doctor: false,
    doctor_name: '',
    clinic_name: '',
    notes: '',
    tags: [] as string[]
  });

  const eventTypes = [
    { value: 'diagnosis', label: 'Диагноз', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
    { value: 'surgery', label: 'Операция', icon: Heart, color: 'bg-blue-100 text-blue-800' },
    { value: 'chronic_condition', label: 'Хроническое заболевание', icon: Shield, color: 'bg-orange-100 text-orange-800' },
    { value: 'screening', label: 'Обследование', icon: Calendar, color: 'bg-green-100 text-green-800' }
  ];

  const severityLevels = [
    { value: 'mild', label: 'Легкая' },
    { value: 'moderate', label: 'Умеренная' },
    { value: 'severe', label: 'Тяжелая' }
  ];

  React.useEffect(() => {
    loadMedicalEvents();
  }, [familyGroupId]);

  const loadMedicalEvents = async () => {
    if (!familyGroupId || !familyMembers.length) return;

    setLoading(true);
    try {
      const memberIds = familyMembers.map(m => m.id);
      const { data, error } = await supabase
        .from('family_medical_events')
        .select(`
          *,
          family_members (
            name,
            relationship
          )
        `)
        .in('family_member_id', memberIds)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading medical events:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить медицинские события",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!user || !newEvent.family_member_id || !newEvent.title.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('family_medical_events')
        .insert({
          ...newEvent,
          age_at_event: newEvent.age_at_event ? parseInt(newEvent.age_at_event) : null,
          created_by: user.id
        })
        .select(`
          *,
          family_members (
            name,
            relationship
          )
        `)
        .single();

      if (error) throw error;

      setEvents(prev => [data, ...prev]);
      setNewEvent({
        family_member_id: '',
        event_type: '',
        title: '',
        description: '',
        event_date: '',
        age_at_event: '',
        severity: '',
        treatment: '',
        outcome: '',
        verified_by_doctor: false,
        doctor_name: '',
        clinic_name: '',
        notes: '',
        tags: []
      });
      setIsAddModalOpen(false);

      toast({
        title: "Событие добавлено",
        description: "Медицинское событие успешно добавлено в семейную историю"
      });
    } catch (error) {
      console.error('Error adding medical event:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить медицинское событие",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeConfig = (type: string) => {
    return eventTypes.find(t => t.value === type) || eventTypes[0];
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = selectedEventType 
    ? events.filter(event => event.event_type === selectedEventType)
    : events;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Медицинские события семьи</h3>
          <p className="text-sm text-gray-600">
            История заболеваний, операций и важных медицинских событий
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
              <Plus className="w-4 h-4 mr-2" />
              Добавить событие
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить медицинское событие</DialogTitle>
              <DialogDescription>
                Добавьте важное медицинское событие в семейную историю
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Член семьи *</Label>
                  <Select
                    value={newEvent.family_member_id}
                    onValueChange={(value) => setNewEvent(prev => ({ ...prev, family_member_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите члена семьи" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.relationship})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Тип события *</Label>
                  <Select
                    value={newEvent.event_type}
                    onValueChange={(value) => setNewEvent(prev => ({ ...prev, event_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Название события *</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Например: Диагностирован диабет 2 типа"
                />
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Подробное описание события"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Дата события</Label>
                  <Input
                    type="date"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Возраст на момент события</Label>
                  <Input
                    type="number"
                    value={newEvent.age_at_event}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, age_at_event: e.target.value }))}
                    placeholder="35"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Тяжесть</Label>
                  <Select
                    value={newEvent.severity}
                    onValueChange={(value) => setNewEvent(prev => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тяжесть" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Лечение</Label>
                  <Textarea
                    value={newEvent.treatment}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, treatment: e.target.value }))}
                    placeholder="Назначенное лечение"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Исход</Label>
                  <Textarea
                    value={newEvent.outcome}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, outcome: e.target.value }))}
                    placeholder="Результат лечения"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Врач</Label>
                  <Input
                    value={newEvent.doctor_name}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, doctor_name: e.target.value }))}
                    placeholder="Имя врача"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Клиника</Label>
                  <Input
                    value={newEvent.clinic_name}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, clinic_name: e.target.value }))}
                    placeholder="Название клиники"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Заметки</Label>
                <Textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Дополнительные заметки"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={newEvent.verified_by_doctor}
                  onCheckedChange={(checked) => 
                    setNewEvent(prev => ({ ...prev, verified_by_doctor: !!checked }))
                  }
                />
                <Label htmlFor="verified">Подтверждено врачом</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Отмена
                </Button>
                <Button 
                  onClick={handleAddEvent}
                  disabled={loading || !newEvent.family_member_id || !newEvent.title.trim()}
                >
                  {loading ? 'Добавление...' : 'Добавить событие'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Фильтры по типу события */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedEventType === '' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedEventType('')}
        >
          Все события
        </Button>
        {eventTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedEventType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedEventType(type.value)}
            className="flex items-center space-x-1"
          >
            <type.icon className="w-3 h-3" />
            <span>{type.label}</span>
          </Button>
        ))}
      </div>

      {/* Список событий */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Загрузка событий...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Медицинских событий пока нет
              </h3>
              <p className="text-gray-600 mb-4">
                Добавьте важные медицинские события в семейную историю
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => {
            const typeConfig = getEventTypeConfig(event.event_type);
            const TypeIcon = typeConfig.icon;
            
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{event.family_members.name} ({event.family_members.relationship})</span>
                            {event.event_date && (
                              <>
                                <span>•</span>
                                <span>{format(new Date(event.event_date), 'dd MMMM yyyy', { locale: ru })}</span>
                              </>
                            )}
                            {event.age_at_event && (
                              <>
                                <span>•</span>
                                <span>Возраст: {event.age_at_event} лет</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {event.severity && (
                            <Badge className={getSeverityColor(event.severity)}>
                              {severityLevels.find(s => s.value === event.severity)?.label}
                            </Badge>
                          )}
                          {event.verified_by_doctor && (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="w-3 h-3 mr-1" />
                              Подтверждено
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-700">{event.description}</p>
                      )}
                      
                      {(event.treatment || event.outcome) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {event.treatment && (
                            <div>
                              <span className="font-medium">Лечение:</span>
                              <p className="text-gray-600">{event.treatment}</p>
                            </div>
                          )}
                          {event.outcome && (
                            <div>
                              <span className="font-medium">Исход:</span>
                              <p className="text-gray-600">{event.outcome}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {(event.doctor_name || event.clinic_name) && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {event.doctor_name && (
                            <span>Врач: {event.doctor_name}</span>
                          )}
                          {event.clinic_name && (
                            <span>Клиника: {event.clinic_name}</span>
                          )}
                        </div>
                      )}
                      
                      {event.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Заметки:</span>
                          <p className="text-gray-600">{event.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FamilyMedicalEvents;
