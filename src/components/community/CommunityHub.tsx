import React, { useState, useEffect } from 'react';
import { Heart, Users, MessageCircle, Shield, Lightbulb, UserCheck, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types for Community features
interface CommunityUser {
  id: string;
  anonymousHandle: string;
  emotionalProfile: {
    anxietyLevel: 1 | 2 | 3 | 4 | 5;
    supportNeeded: string[];
    communicationStyle: 'direct' | 'gentle' | 'fact-based' | 'emotional';
    triggers: string[];
  };
  healthConcerns: string[];
  joinDate: Date;
  lastActive: Date;
}

interface SupportGroup {
  id: string;
  name: string;
  type: 'circle-of-trust' | 'diagnosis-support' | 'life-stage' | 'expert-qa';
  description: string;
  currentMembers: number;
  maxMembers: number;
  nextMeeting: Date;
  moderator: string;
  tags: string[];
  isJoined: boolean;
}

interface EmotionalState {
  anxiety: number;
  stress: number;
  hope: number;
  confidence: number;
  timestamp: Date;
}

interface ExpertSession {
  id: string;
  expert: {
    name: string;
    specialization: string;
    credentials: string;
    rating: number;
  };
  topic: string;
  scheduledTime: Date;
  spotsAvailable: number;
  isRegistered: boolean;
}

const CommunityHub: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CommunityUser | null>(null);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [expertSessions, setExpertSessions] = useState<ExpertSession[]>([]);
  const [showEmotionalCheck, setShowEmotionalCheck] = useState(false);

  // Mock data initialization
  useEffect(() => {
    // Initialize with sample data
    const mockGroups: SupportGroup[] = [
      {
        id: '1',
        name: 'Круг доверия "Розовые надежды"',
        type: 'circle-of-trust',
        description: 'Безопасное пространство для женщин с повышенными рисками. Мы поддерживаем друг друга с теплотой и пониманием.',
        currentMembers: 8,
        maxMembers: 12,
        nextMeeting: new Date('2024-07-01T19:00:00'),
        moderator: 'Анна, психолог',
        tags: ['высокий риск', 'эмоциональная поддержка', 'анонимно'],
        isJoined: false
      },
      {
        id: '2',
        name: 'Менопауза: новая глава жизни',
        type: 'life-stage',
        description: 'Обсуждаем изменения в организме, делимся способами заботы о себе и находим радость в новом этапе жизни.',
        currentMembers: 15,
        maxMembers: 20,
        nextMeeting: new Date('2024-06-28T18:30:00'),
        moderator: 'Елена, эндокринолог',
        tags: ['менопауза', 'гормоны', 'самочувствие'],
        isJoined: true
      },
      {
        id: '3',
        name: 'После диагноза: вместе сильнее',
        type: 'diagnosis-support',
        description: 'Поддержка для тех, кто получил диагноз. Здесь можно поделиться страхами и найти силы для следующих шагов.',
        currentMembers: 6,
        maxMembers: 10,
        nextMeeting: new Date('2024-06-30T16:00:00'),
        moderator: 'Мария, онко-психолог',
        tags: ['диагноз', 'лечение', 'поддержка'],
        isJoined: false
      }
    ];

    const mockSessions: ExpertSession[] = [
      {
        id: '1',
        expert: {
          name: 'Др. Светлана Иванова',
          specialization: 'Маммолог-онколог',
          credentials: 'КМН, 15 лет опыта',
          rating: 4.9
        },
        topic: 'Профилактика рака молочной железы: что важно знать каждой женщине',
        scheduledTime: new Date('2024-06-27T20:00:00'),
        spotsAvailable: 23,
        isRegistered: false
      },
      {
        id: '2',
        expert: {
          name: 'Др. Анна Петрова',
          specialization: 'Психолог, специалист по тревожности',
          credentials: 'Клинический психолог, сертификат CBT',
          rating: 4.8
        },
        topic: 'Как справиться с тревогой при медицинских обследованиях',
        scheduledTime: new Date('2024-06-29T19:00:00'),
        spotsAvailable: 12,
        isRegistered: true
      }
    ];

    setSupportGroups(mockGroups);
    setExpertSessions(mockSessions);

    // Check emotional state on mount
    setShowEmotionalCheck(true);
  }, []);

  // Emotional intelligence functions
  const checkEmotionalState = () => {
    // Simulate emotional state analysis
    const mockState: EmotionalState = {
      anxiety: Math.floor(Math.random() * 40) + 30, // 30-70 range
      stress: Math.floor(Math.random() * 50) + 25,
      hope: Math.floor(Math.random() * 40) + 60,
      confidence: Math.floor(Math.random() * 30) + 50,
      timestamp: new Date()
    };
    setEmotionalState(mockState);
    setShowEmotionalCheck(false);
  };

  const getEmotionalColor = (level: number) => {
    if (level <= 30) return 'text-green-600';
    if (level <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGroupIcon = (type: SupportGroup['type']) => {
    switch (type) {
      case 'circle-of-trust': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'diagnosis-support': return <Shield className="w-5 h-5 text-purple-500" />;
      case 'life-stage': return <Users className="w-5 h-5 text-blue-500" />;
      case 'expert-qa': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const joinGroup = (groupId: string) => {
    setSupportGroups(groups => 
      groups.map(group => 
        group.id === groupId 
          ? { ...group, isJoined: true, currentMembers: group.currentMembers + 1 }
          : group
      )
    );
  };

  const registerForSession = (sessionId: string) => {
    setExpertSessions(sessions =>
      sessions.map(session =>
        session.id === sessionId
          ? { ...session, isRegistered: true, spotsAvailable: session.spotsAvailable - 1 }
          : session
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header with warm greeting */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Сообщество заботы и поддержки
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Здесь вы найдете понимание, поддержку и силы. Мы вместе заботимся о своем здоровье с теплотой и пониманием.
        </p>
      </div>

      {/* Emotional State Check */}
      {showEmotionalCheck && (
        <Alert className="border-pink-200 bg-pink-50">
          <Heart className="h-4 w-4 text-pink-500" />
          <AlertDescription className="flex items-center justify-between">
            <span>Как вы себя чувствуете сегодня? Позвольте нам лучше понять ваше состояние.</span>
            <Button 
              onClick={checkEmotionalState}
              className="bg-pink-500 hover:bg-pink-600 text-white"
              size="sm"
            >
              Поделиться самочувствием
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Emotional State Display */}
      {emotionalState && (
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Ваше эмоциональное состояние
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getEmotionalColor(emotionalState.anxiety)}`}>
                  {emotionalState.anxiety}%
                </div>
                <div className="text-sm text-gray-600">Тревожность</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getEmotionalColor(emotionalState.stress)}`}>
                  {emotionalState.stress}%
                </div>
                <div className="text-sm text-gray-600">Стресс</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getEmotionalColor(100 - emotionalState.hope)}`}>
                  {emotionalState.hope}%
                </div>
                <div className="text-sm text-gray-600">Надежда</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getEmotionalColor(100 - emotionalState.confidence)}`}>
                  {emotionalState.confidence}%
                </div>
                <div className="text-sm text-gray-600">Уверенность</div>
              </div>
            </div>
            {emotionalState.anxiety > 60 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Мы заметили повышенную тревожность</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Рекомендуем присоединиться к группе поддержки или воспользоваться техниками релаксации.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Community Tabs */}
      <Tabs defaultValue="support-groups" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="support-groups" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Группы поддержки
          </TabsTrigger>
          <TabsTrigger value="expert-sessions" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Встречи с экспертами
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Менторство
          </TabsTrigger>
        </TabsList>

        {/* Support Groups Tab */}
        <TabsContent value="support-groups" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {supportGroups.map((group) => (
              <Card key={group.id} className="border-gray-200 hover:border-pink-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getGroupIcon(group.type)}
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                    </div>
                    {group.isJoined && (
                      <Badge className="bg-green-100 text-green-800">Участвую</Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{group.currentMembers}/{group.maxMembers} участниц</span>
                    <span>{group.moderator}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Следующая встреча: {group.nextMeeting.toLocaleDateString('ru-RU', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={() => joinGroup(group.id)}
                    disabled={group.isJoined || group.currentMembers >= group.maxMembers}
                    className={`w-full ${
                      group.isJoined 
                        ? 'bg-gray-100 text-gray-600' 
                        : 'bg-pink-500 hover:bg-pink-600 text-white'
                    }`}
                  >
                    {group.isJoined ? 'Уже участвую' : 'Присоединиться'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Expert Sessions Tab */}
        <TabsContent value="expert-sessions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {expertSessions.map((session) => (
              <Card key={session.id} className="border-gray-200 hover:border-purple-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{session.topic}</CardTitle>
                    {session.isRegistered && (
                      <Badge className="bg-purple-100 text-purple-800">Записана</Badge>
                    )}
                  </div>
                  <CardDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">{session.expert.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.expert.specialization} • {session.expert.credentials}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Heart 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < Math.floor(session.expert.rating) 
                                ? 'text-pink-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          ({session.expert.rating})
                        </span>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {session.scheduledTime.toLocaleDateString('ru-RU', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Свободных мест: {session.spotsAvailable}
                  </div>

                  <Button 
                    onClick={() => registerForSession(session.id)}
                    disabled={session.isRegistered || session.spotsAvailable === 0}
                    className={`w-full ${
                      session.isRegistered 
                        ? 'bg-gray-100 text-gray-600' 
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {session.isRegistered ? 'Уже записана' : 'Записаться'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Mentorship Tab */}
        <TabsContent value="mentorship" className="space-y-6">
          <Card className="border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Программа менторства "Рука помощи"
              </CardTitle>
              <CardDescription>
                Поддержка от женщин, которые прошли похожий путь. Делимся опытом с теплотой и пониманием.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Стать подопечной</h3>
                  <p className="text-gray-600">
                    Получите поддержку от опытной наставницы, которая понимает ваши переживания.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Эмоциональная поддержка и понимание</li>
                    <li>• Практические советы и рекомендации</li>
                    <li>• Подготовка к медицинским процедурам</li>
                    <li>• Помощь в принятии решений</li>
                  </ul>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    Найти наставницу
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Стать наставницей</h3>
                  <p className="text-gray-600">
                    Поделитесь своим опытом и помогите другим женщинам на их пути к здоровью.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Помогите преодолеть страхи и тревоги</li>
                    <li>• Поделитесь личным опытом</li>
                    <li>• Создайте значимую связь</li>
                    <li>• Внесите вклад в благополучие сообщества</li>
                  </ul>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    Стать наставницей
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityHub;