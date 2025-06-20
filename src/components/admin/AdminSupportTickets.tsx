
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageSquare, Clock, CheckCircle, AlertTriangle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_email: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  category: string;
  assigned_to?: string;
  assigned_at?: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

const AdminSupportTickets = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Mock data - в реальном приложении это будет загружаться из базы данных
  const mockTickets: SupportTicket[] = [
    {
      id: '1',
      ticket_number: 'TICKET-001234',
      user_id: 'user1',
      user_email: 'patient@example.com',
      subject: 'Проблема с доступом к медицинским записям',
      description: 'Не могу получить доступ к своим медицинским записям после последнего обновления. Появляется ошибка 500.',
      priority: 'high',
      status: 'open',
      category: 'technical',
      created_at: '2025-06-20T09:30:00Z',
      updated_at: '2025-06-20T09:30:00Z'
    },
    {
      id: '2',
      ticket_number: 'TICKET-001235',
      user_id: 'user2',
      user_email: 'doctor@clinic.com',
      subject: 'Запрос на добавление новой роли',
      description: 'Необходимо добавить роль врача для нового сотрудника клиники.',
      priority: 'medium',
      status: 'in_progress',
      category: 'account',
      assigned_to: 'admin@prevent.com',
      assigned_at: '2025-06-20T10:00:00Z',
      created_at: '2025-06-19T14:20:00Z',
      updated_at: '2025-06-20T10:00:00Z'
    },
    {
      id: '3',
      ticket_number: 'TICKET-001236',
      user_id: 'user3',
      user_email: 'support@lab.com',
      subject: 'Критическая ошибка интеграции с лабораторной системой',
      description: 'Интеграция с нашей лабораторной системой перестала работать. Результаты анализов не загружаются.',
      priority: 'critical',
      status: 'resolved',
      category: 'integration',
      assigned_to: 'admin@prevent.com',
      assigned_at: '2025-06-19T08:00:00Z',
      resolved_at: '2025-06-19T12:30:00Z',
      resolution_notes: 'Исправлена ошибка в API интеграции. Обновлены токены доступа.',
      created_at: '2025-06-19T07:45:00Z',
      updated_at: '2025-06-19T12:30:00Z'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <MessageSquare className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleAssignTicket = (ticketId: string) => {
    toast({
      title: "Тикет назначен",
      description: "Тикет назначен вам для обработки",
    });
  };

  const handleResolveTicket = (ticketId: string) => {
    if (!resolutionNotes.trim()) {
      toast({
        title: "Ошибка",
        description: "Необходимо указать заметки по решению",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Тикет решен",
      description: "Тикет отмечен как решенный",
    });
    setSelectedTicket(null);
    setResolutionNotes('');
  };

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCount = mockTickets.filter(t => t.status === 'open').length;
  const inProgressCount = mockTickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = mockTickets.filter(t => t.status === 'resolved').length;
  const criticalCount = mockTickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Тикеты поддержки</h2>
          <p className="text-gray-600">Управление заявками пользователей</p>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{openCount}</p>
                <p className="text-sm text-gray-600">Открытые</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-gray-600">В работе</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{resolvedCount}</p>
                <p className="text-sm text-gray-600">Решенные</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-sm text-gray-600">Критические</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Поиск тикетов</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Поиск по номеру, теме или email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Статус</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Все статусы</option>
                <option value="open">Открытые</option>
                <option value="in_progress">В работе</option>
                <option value="pending">Ожидание</option>
                <option value="resolved">Решенные</option>
                <option value="closed">Закрытые</option>
              </select>
            </div>
            <div>
              <Label htmlFor="priority-filter">Приоритет</Label>
              <select
                id="priority-filter"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Все приоритеты</option>
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="critical">Критический</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список тикетов */}
      <Card>
        <CardHeader>
          <CardTitle>Тикеты поддержки</CardTitle>
          <CardDescription>
            Найдено тикетов: {filteredTickets.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <h3 className="font-semibold">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600">
                        {ticket.ticket_number} • {ticket.user_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(ticket.status)}
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{ticket.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Создан: {new Date(ticket.created_at).toLocaleString('ru-RU')}</span>
                  {ticket.assigned_to && (
                    <span>Назначен: {ticket.assigned_to}</span>
                  )}
                </div>

                {ticket.resolution_notes && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                    <Label className="text-sm font-medium text-green-800">Решение</Label>
                    <p className="text-sm text-green-700 mt-1">{ticket.resolution_notes}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {ticket.status === 'open' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleAssignTicket(ticket.id)}
                    >
                      Взять в работу
                    </Button>
                  )}
                  
                  {(ticket.status === 'in_progress' || ticket.status === 'pending') && (
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedTicket(ticket)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Решить
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    Подробности
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно для решения тикета */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Решение тикета</CardTitle>
              <CardDescription>
                {selectedTicket.ticket_number}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resolution">Заметки по решению</Label>
                <Textarea
                  id="resolution"
                  placeholder="Опишите как был решен данный тикет..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleResolveTicket(selectedTicket.id)}
                  className="flex-1"
                >
                  Отметить как решенный
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedTicket(null);
                    setResolutionNotes('');
                  }}
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminSupportTickets;
