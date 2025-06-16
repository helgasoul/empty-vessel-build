
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Calendar, 
  Clock, 
  User, 
  Phone,
  Monitor,
  CreditCard,
  FileText,
  ExternalLink
} from "lucide-react";
import { useTelemedicine } from "@/hooks/useTelemedicine";
import { useMedicalAppointments } from "@/hooks/useMedicalAppointments";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const TelemedicineConsultations = () => {
  const { sessions, loading, updateSession } = useTelemedicine();
  const { doctors } = useMedicalAppointments();
  const [activeTab, setActiveTab] = useState<'scheduled' | 'completed' | 'upcoming'>('scheduled');

  const scheduledSessions = sessions.filter(s => s.session_status === 'scheduled' || s.session_status === 'pending');
  const completedSessions = sessions.filter(s => s.session_status === 'completed');
  const upcomingSessions = sessions.filter(s => s.session_status === 'in_progress');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'in_progress': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const handleJoinSession = async (sessionId: string, meetingLink?: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
      await updateSession(sessionId, { session_status: 'in_progress' });
    }
  };

  const SessionCard = ({ session }: { session: any }) => {
    const doctor = doctors.find(d => d.id === session.doctor_id);
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Консультация с {doctor?.full_name || 'Врач'}
                </CardTitle>
                <CardDescription>{doctor?.specialization}</CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant={getStatusColor(session.session_status)}>
                {session.session_status === 'scheduled' ? 'Запланирована' :
                 session.session_status === 'in_progress' ? 'В процессе' :
                 session.session_status === 'completed' ? 'Завершена' :
                 session.session_status === 'cancelled' ? 'Отменена' : 'Ожидание'}
              </Badge>
              {session.payment_amount && (
                <Badge variant={getPaymentStatusColor(session.payment_status)}>
                  {session.payment_status === 'paid' ? 'Оплачено' :
                   session.payment_status === 'pending' ? 'Ожидает оплаты' :
                   session.payment_status === 'failed' ? 'Ошибка оплаты' : 'Возврат'}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {session.started_at ? 
                  format(new Date(session.started_at), 'd MMMM yyyy', { locale: ru }) :
                  'Дата не указана'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {session.duration_minutes ? `${session.duration_minutes} мин` : 'Длительность не указана'}
              </span>
            </div>

            {session.payment_amount && (
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{session.payment_amount}₽</span>
              </div>
            )}

            {session.prescription_issued && (
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Рецепт выписан</span>
              </div>
            )}
          </div>

          {session.session_notes && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Заметки врача:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{session.session_notes}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {session.session_status === 'scheduled' && session.meeting_link && (
              <Button 
                onClick={() => handleJoinSession(session.id, session.meeting_link)}
                className="flex items-center space-x-2"
              >
                <Monitor className="w-4 h-4" />
                <span>Присоединиться к консультации</span>
              </Button>
            )}

            {session.session_recording_url && (
              <Button 
                variant="outline"
                onClick={() => window.open(session.session_recording_url, '_blank')}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Просмотреть запись</span>
              </Button>
            )}

            {session.follow_up_required && (
              <Badge variant="secondary">
                Требуется повторная консультация
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Загрузка консультаций...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Телемедицинские консультации
        </h2>
        <p className="text-gray-600">
          Онлайн консультации с врачами в удобное время
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Запланированные ({scheduledSessions.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Активные ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Завершенные ({completedSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="mt-6">
          {scheduledSessions.length > 0 ? (
            scheduledSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Нет запланированных консультаций</h3>
                <p className="text-gray-600 mb-4">
                  Запишитесь на консультацию к врачу для получения квалифицированной помощи
                </p>
                <Button>Записаться на консультацию</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Нет активных консультаций</h3>
                <p className="text-gray-600">
                  Активные консультации будут отображаться здесь
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedSessions.length > 0 ? (
            completedSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Нет завершенных консультаций</h3>
                <p className="text-gray-600">
                  История ваших консультаций будет отображаться здесь
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelemedicineConsultations;
